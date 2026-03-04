<script setup lang="ts">
import {ref,computed,onMounted} from 'vue'
import CommentItem from './CommentItem.vue';
import CommentEditor from './CommentEditor.vue';
import type { CommentItem as CommentType, ReplyInfo } from '@/types/comment'
import axios from 'axios'
const token = localStorage.getItem('token') || ''
//映入文章id
const props = defineProps<{
  articleId: string
  currentUserId?: string
}>()
const comments = ref<CommentType[]>([])
const replying = ref<ReplyInfo | null>(null)

const page = ref(1)
const limit = 5
const hasMore = ref(true)

//加载评论
const fetchComment = async()=>{
    const res = await axios.get('http://localhost:3000/api/comment/get',
        {params: {
            articleId:props.articleId,
            page:page.value,
            limit
        },
          headers: {
          Authorization: token
        }
    },
    )
    const data = res.data.data
    console.log(data);
    if (data.length < limit) {
    hasMore.value = false
  }
  comments.value.push(...data)
}
/* ====== 加载更多 ====== */
const loadMore = async () => {
  page.value++
  await fetchComment()
}
//回复
const handleReply = (comment:CommentType) => {
    replying.value = {
        parentId:comment._id,
        replyUserId:comment.userId._id,
        replyUsername:comment.userId.username
    }    
}
//提交评论
const handleSubmit = async(content:string) => {
   await axios.post('http://localhost:3000/api/comment/create',
    {
        content,
        articleId:props.articleId,
        parentId:replying.value?.parentId,
        replyTo:replying.value?.replyUsername,
    },
    {
        headers: {
          Authorization: token
        }
    }
   )
   //重置状态
   replying.value = null
  comments.value = []
  page.value = 1
  hasMore.value = true

  await fetchComment()
}
onMounted(() => {
  fetchComment()
})
//点赞
const handleLike = async (commentId: string) => {
  const res =  await axios.post(
    `http://localhost:3000/api/comment/like?commentId=${commentId}`,
    {},
    {
      headers: {
        Authorization: token
      }
    }
  )
  console.log(res.data);
  
  // 刷新评论
  comments.value = []
  page.value = 1
  hasMore.value = true
  await fetchComment()
}
//删除
const handleDelete = async (commentId: string) => {
  try {
    await axios.delete(
      `http://localhost:3000/api/comment/delete?commentId=${commentId}`,
      {
        headers: {
          Authorization: token
        }
      }
    )

    // 局部更新（推荐，不刷新列表）
    replying.value = null
  comments.value = []
  page.value = 1
  hasMore.value = true

  await fetchComment()

  } catch (err) {
    console.error('删除失败')
  }
}

</script>
<template>
  <div class="comment-list">

  

    <!-- 评论列表 -->
    <div v-if="comments.length">
      <CommentItem
        v-for="item in comments"
        :key="item._id"
        :comment="item"
        :currentUserId="currentUserId"
        @reply="handleReply"
        @like="handleLike"
        @delete="handleDelete"
      />
        <!-- 编辑器 -->
    
    </div>

    <div v-else class="empty">
      暂无评论
    </div>
    <CommentEditor
      :replyInfo="replying"
      @submit="handleSubmit"
      @cancelReply="replying = null"
    />
    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <button @click="loadMore">加载更多</button>
    </div>

  </div>
</template>

<style scoped>
.comment-list {
    width: 1000px;
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
  margin-bottom: 50px;
}

.empty {
  margin-top: 20px;
  color: #999;
}

.load-more {
  margin-top: 20px;
  text-align: center;
}

.load-more button {
  padding: 6px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}
</style>