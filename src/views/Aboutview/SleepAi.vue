<template>
  <div class="sleep-analysis">
    <h1>睡眠 AI 总结</h1>
    
    <button @click="getSleepAnalysis" :disabled="loading" class="analyze-btn">
      {{ loading ? "分析中..." : "生成睡眠总结" }}
    </button>

    <div v-if="error" class="error">{{ error }}</div>
   
    <div v-if="summary"  class="markdown-body" v-html="markdownHtml">
    </div>
  </div>
</template>

<script setup lang="ts">
import {marked} from 'marked'
import { ref,computed } from 'vue'
import axios from 'axios'

const summary = ref<string>("")
const loading = ref(false)
const error = ref<string | null>(null)
const markdownHtml = computed(() => marked(summary.value))
const getSleepAnalysis = async () => {
  loading.value = true
  error.value = null
  summary.value = ""

  try {
    const token = localStorage.getItem("token")
    if (!token) {
      error.value = "未检测到登录信息，请先登录"
      loading.value = false
      return
    }

    const res = await axios.post(
      "http://localhost:3000/api/deepsleep/ai",
      {},
      { headers: { Authorization: token } }
    )

    if (res.data?.code === 200) {
      summary.value = res.data.summary
    } else {
      error.value = res.data?.msg || "分析失败"
    }
  } catch (err: any) {
    console.error(err)
    error.value = err.message || "请求出错"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.sleep-analysis {
  max-width: 800px;
  margin: 20px 30px;
  padding: 20px;
  background-color: #fff6f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 15px;
}
.markdown-body {
  padding: 10px;
}
.analyze-btn {
  display: block;
  margin: 0 auto 20px auto;
  padding: 10px 20px;
  background-color: #ebb4f3;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.analyze-btn:hover:not(:disabled) {
  background-color: #d67cd8;
}

.analyze-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.summary {
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.error {
  color: red;
  text-align: center;
  margin-bottom: 10px;
}
</style>
