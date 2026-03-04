<script setup lang="ts">
import Header from './Header.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import authon from '@/views/article/authon.vue'
import CommentList from './comment/CommentList.vue'
const token = localStorage.getItem('token') || ''
const authorId = ref('')
const currentUserId = localStorage.getItem('user') || ''
const likecount = ref(0)
// 单篇文章类型
interface UserPost {
  _id: string
  title: string
  content: string
  cover: string
  summary: string
  createdAt: string
  updatedAt: string
  likes: number
  views: number
  authorId: string
  tags: string[]
}

const article = ref<UserPost | null>(null)

// 获取路由参数
const route = useRoute()
const articleId = route.params.id as string

onMounted(async () => {
  try {
    axios.post(`http://localhost:3000/api/post/${articleId}/view`,
       {
        headers: {
          Authorization: token
        }
      }
    )
    //获得文章内容
    const res = await axios.get(
      `http://localhost:3000/api/post/only?postId=${articleId}`,
      {
        headers: {
          Authorization: token
        }
      }
    )

    article.value = res.data.article
    authorId.value = res.data.article.authorId

    const liked = await axios.get(
      `http://localhost:3000/api/articles/likefor/${articleId}`,
      { headers: { Authorization: `${token}` }, }
    )
    likecount.value = liked.data.count
  } catch (err) {
    console.log(err)
  }
})
const updateLike = ( newCount: number) => {
  likecount.value = newCount
}
</script>

<template>
  <Header />
  <div class="nav">
 <authon 
 :id="authorId"
 :articleId="articleId"
 :likecount="likecount"
  @update="updateLike"
 />
  </div>
  <div v-if="article" class="article-wrapper">
    <!-- 封面 -->
   
    <!-- 标题 -->
    <h1 class="title">{{ article.title }}</h1>

    <!-- 信息栏 -->
    <div class="meta">
      <span>发布时间：{{ article.createdAt.slice(0,10) }}</span>
      <span>👀 {{ article.views }}</span>
      <span>❤️ {{ likecount }}</span>
    </div>

    <!-- 摘要 -->
    <p class="summary" v-if="article.summary">
      {{ article.summary }}
    </p>

    <!-- 正文（富文本） -->
    <div class="content" v-html="article.content"></div>
  </div>
  <CommentList 
  :articleId="articleId"
  :currentUserId="currentUserId"
  />
</template>

<style scoped>
   .article-wrapper {
   margin-top: 100px;
  max-width: 1000px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.cover {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 24px;
}
.nav {
  width: 100px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 102px;
  left: 163px;
}
.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #888;
  margin-bottom: 20px;
}

.summary {
  padding: 12px 16px;
  background: #f7f7f7;
  border-left: 4px solid #409eff;
  color: #555;
  margin-bottom: 24px;
}

.content {
  line-height: 1.8;
  font-size: 16px;
}

/* 富文本常见标签优化 */
.content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
}

.content p {
  margin-bottom: 14px;
}

.content h2,
.content h3 {
  margin: 24px 0 12px;
}

</style>