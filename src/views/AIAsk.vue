<template>
  <Header/>
  <div class="chat-container">
    <!-- 聊天标题 -->
    <div class="chat-header">
      <div class="header-content">
        <div class="ai-avatar">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12L3 13.5V15.5L9 14V16L3 17.5V19.5L9 18V22H15V18L21 19.5V17.5L15 16V14L21 15.5V13.5L15 12V10.5L21 9Z"/>
          </svg>
        </div>
        <div class="header-text">
          <h2>策策健康</h2>
          <p>每日健康一问</p>
        </div>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="(msg, index) in messages" 
        :key="index" 
        :class="['message', msg.role]"
      >
        <!-- AI消息 -->
        <div v-if="msg.role === 'assistant'" class="message-content ai-message">
          <div class="avatar ai-avatar">
            <img src="../../public/hello.jpg" alt="">
          </div>
          <div class="message-bubble">
            <div class="message-text">
              <div v-if="msg.isStreaming" class="streaming-content">
                {{ msg.content }}
                <span class="typing-cursor">|</span>
              </div>
              <div v-else>{{ msg.content }}</div>
            </div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else class="message-content user-message">
          <div class="message-bubble">
            <div class="message-text">{{ msg.content }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <div class="input-wrapper">
        <textarea
          v-model="inputMessage"
          @keydown="handleKeydown"
          placeholder="描述您的健康问题或症状..."
          rows="1"
          :disabled="isLoading"
          ref="textareaRef"
        ></textarea>
        <button 
          @click="sendMessage" 
          :disabled="!inputMessage.trim() || isLoading"
          class="send-button"
        >
          <svg v-if="!isLoading" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </button>
      </div>
      <div class="input-hint">
        策策健康，陪伴你的健康每一天
      </div>
    </div>
    
  </div>
  <div class="pictrue" v-once ></div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { ref, nextTick, watch } from 'vue'
import { marked } from 'marked'

// ================== 类型 ==================
type Role = 'user' | 'assistant'

interface ChatMessage {
  role: Role
  content: string
  time: string
  isStreaming?: boolean
}

// ================== 状态 ==================
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isLoading = ref(false)

const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// ================== 工具函数 ==================
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop =
        messagesContainer.value.scrollHeight
    }
  })
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const adjustTextareaHeight = () => {
  nextTick(() => {
    if (!textareaRef.value) return
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height =
      Math.min(textareaRef.value.scrollHeight, 120) + 'px'
  })
}

watch(inputMessage, adjustTextareaHeight)

// ================== 打字机效果（核心） ==================
const typeWriter = async (
  text: string,
  target: ChatMessage
) => {
  for (const char of text) {
    target.content += char
    scrollToBottom()
    await new Promise(resolve => setTimeout(resolve, 20))
  }
}

// ================== 键盘事件 ==================
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// ================== 发送消息 ==================
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  // 用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value.trim(),
    time: getCurrentTime()
  })

  // AI 消息（保存引用，避免 undefined）
  const assistantMessage: ChatMessage = {
    role: 'assistant',
    content: '',
    isStreaming: true,
    time: getCurrentTime()
  }
  messages.value.push(assistantMessage)

  const question = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true

  scrollToBottom()

  try {
    const response = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: question })
    })

    if (!response.ok || !response.body) {
      throw new Error(`请求失败：${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (!line.startsWith('data:')) continue

        const dataStr = line.replace('data:', '').trim()
        if (!dataStr) continue

        try {
          const data: {
            content?: string
            done?: boolean
            error?: string
          } = JSON.parse(dataStr)

          if (data.content) {
            await typeWriter(data.content, assistantMessage)
          }

          if (data.done) {
            assistantMessage.isStreaming = false
            assistantMessage.time = getCurrentTime()
            isLoading.value = false
          }

          if (data.error) {
            assistantMessage.content = '服务异常，请稍后重试。'
            assistantMessage.isStreaming = false
            assistantMessage.time = getCurrentTime()
            isLoading.value = false
          }
        } catch (err) {
          console.warn('JSON 解析失败', err)
        }
      }
    }
  } catch (err) {
    assistantMessage.content = '网络异常，请检查后端服务。'
    assistantMessage.isStreaming = false
    assistantMessage.time = getCurrentTime()
    isLoading.value = false
  }
}

// ================== 初始化 ==================
messages.value.push({
  role: 'assistant',
  content: '您好！我是您的健康小助手策策，可以为您解答健康相关问题。',
  time: getCurrentTime()
})
</script>


<style scoped>
.pictrue {
  position: fixed;
  top: 717px;
  right: -14px;
  width: 200px;
  height: 200px;
  background: url('../../public/hellokitty3.gif') no-repeat;; 
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 头部样式 */
.chat-header {
  background: linear-gradient(135deg, #f0d3f3 0%, #bcd1ea 100%);
  color: white;
  padding: 20px 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-text h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-text p {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
}

/* 消息区域 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.message {
  margin-bottom: 24px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 100%;
}

.ai-message {
  flex-direction: row;
}

.user-message {
  flex-direction: row-reverse;
}

/* 头像 */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar {
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  color: white;
}
.avatar img {
  width: 32px;
  height: 32px;
}
/* 消息气泡 */
.message-bubble {
  max-width: 70%;
  background: white;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
}

.ai-message .message-bubble {
  border-bottom-left-radius: 4px;
  background: white;
}

.user-message .message-bubble {
  border-bottom-right-radius: 4px;
  background: linear-gradient(135deg, #e4d0f0 0%, #d0e1f5 100%);
  color: rgb(82, 81, 81);
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.streaming-content {
  display: inline;
}

/* 输入区域 */
.input-container {
  padding: 20px 24px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 12px 16px;
}

textarea {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  max-height: 120px;
  font-family: inherit;
}

textarea::placeholder {
  color: #6c757d;
}

.send-button {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button:not(:disabled):hover {
  transform: scale(1.05);
}

.send-button svg {
  width: 20px;
  height: 20px;
}

.input-hint {
  text-align: center;
  font-size: 12px;
  color: #6c757d;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6c757d;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.typing-cursor {
  animation: blink 1s infinite;
  color: inherit;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 消息时间 */
.message-time {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>