<template>
  <div class="menstrual-analysis">
    <h2>月经 AI 健康总结</h2>

    <!-- 按钮 -->
    <button 
      @click="getMenstrualAnalysis" 
      :disabled="loading" 
      class="analyze-btn"
      v-if="active"
    >
      {{ loading ? "AI 分析中..." : "生成月经健康总结" }}
    </button>

    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- AI 总结 markdown 展示 -->
    <div v-if="summary" class="markdown-body" v-html="markdownHtml"></div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";
import { marked } from "marked";
const summary = ref<string>("");
const loading = ref(false);
const error = ref<string | null>(null);
const active = ref(true);

// markdown 渲染
const markdownHtml = computed(() => marked(summary.value));

// 提交到 AI 后端
const getMenstrualAnalysis = async () => {
  loading.value = true;
  error.value = null;
  summary.value = "";

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "未检测到登录信息，请先登录";
      loading.value = false;
      return;
    }

    // 调用月经 AI 接口
    const res = await axios.post(
      "http://localhost:3000/api/menstrual/ai",
      {},
      { headers: { Authorization: token } }
    );

    if (res.data?.code === 200) {
      summary.value = res.data.summary; // AI 返回的 markdown 文本
      active.value = false;
    } else {
      error.value = res.data?.msg || "分析失败，请稍后再试";
    }

  } catch (err: any) {
    console.error(err);
    error.value = err.message || "请求出错";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.menstrual-analysis {
  padding: 20px;
  max-width: 1000px;
  background-color: #fff6fb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(255, 130, 170, 0.15);
  line-height: 1.7;
}

h2 {
  text-align: center;
  margin-bottom: 16px;
  color: #d95f93;
}

.analyze-btn {
  display: block;
  margin: 0 auto 18px auto;
  padding: 10px 20px;
  background-color: #f19bc1;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.25s;
}

.analyze-btn:hover:not(:disabled) {
  background-color: #e66ba2;
}

.analyze-btn:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

.markdown-body {
  white-space: normal;
  word-break: break-word;
  line-height: 1.7;
  background: #fff;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #f0bdd3;
}

.error {
  color: red;
  text-align: center;
  margin-bottom: 10px;
}
</style>
