<script setup lang="ts">
import {ref,computed} from 'vue'
import type { ReplyInfo } from '@/types/comment'
const props = defineProps<{
  replyInfo?: ReplyInfo | null
}>()
const emit = defineEmits<{
  (e: 'submit', content: string): void
  (e: 'cancelReply'): void
}>()

//输入框
const content = ref('')
//判断是否可以提交评论
const canSubmit = computed(( )=> {
   return content.value.trim().length > 0
})
// 提交评论
const onSubmit = () => {
  if (!canSubmit.value) return

  emit('submit', content.value.trim())

  // 提交后清空输入框
  content.value = ''
}
// 取消回复
const onCancelReply = () => {
  emit('cancelReply')
}
</script>
<template>
     <div class="comment-editor">
    <!-- 回复提示 -->
    <div v-if="replyInfo" class="reply-tip">
      回复 @{{ replyInfo.replyUsername }}
      <span class="cancel" @click="onCancelReply">取消</span>
    </div>

    <!-- 输入框 -->
    <textarea
      v-model="content"
      placeholder="写下你的评论..."
      maxlength="500"
    />

    <!-- 底部操作区 -->
    <div class="footer">
      <span class="count">{{ content.length }}/500</span>
      <button
        :disabled="!canSubmit"
        @click="onSubmit"
      >
        发表评论
      </button>
    </div>
  </div>
</template>
<style scoped>
.comment-editor {
  margin-top: 20px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fafafa;
}

.reply-tip {
  font-size: 14px;
  margin-bottom: 8px;
  color: #409eff;
}

.cancel {
  margin-left: 10px;
  cursor: pointer;
  color: #999;
}

.cancel:hover {
  color: #f56c6c;
}

textarea {
  width: 100%;
  min-height: 80px;
  resize: none;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.count {
  font-size: 12px;
  color: #999;
}

button {
  padding: 4px 12px;
  background: #409eff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}</style>