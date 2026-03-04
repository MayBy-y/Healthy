<script setup lang="ts">
import {computed} from 'vue'
import CommentItem from './CommentItem.vue'
import type { CommentItem as CommentType } from '@/types/comment'
const props = defineProps<{
  comment: CommentType
  currentUserId?: string
}>()
const emit = defineEmits<{
  (e: 'reply', comment: CommentType): void
  (e: 'delete', commentId: string): void
  (e: 'like', commentId: string): void
  
}>()
// 是否是自己的评论
const isOwner = computed(() => {
  return props.currentUserId === props.comment.userId._id
})
// 事件
const onReply = () => {
  emit('reply', props.comment)
}

const onDelete = () => {
  emit('delete', props.comment._id)
}

const onLike = () => {
  emit('like', props.comment._id)
}
const formatTime = (time: string) => {
  return new Date(time).toLocaleString()
}
</script>
<template>
     <div class="comment-item">
    <!-- 头像 + 内容 -->
    <div class="comment-main">
      <img class="avatar" :src="`http://localhost:3000${comment.userId.avatar}`" />

      <div class="body">
        <div class="header">
          <h3 class="username">{{ comment.userId.username }}</h3>
          <span v-if="comment.replyTo" class="reply-to">
            回复 @{{ comment.replyTo}}
          </span>
        </div>

        <div class="content">
          {{ comment.content }}
        </div>

        <div class="actions">
          <button @click="onReply">回复</button>
          <button v-if="isOwner" @click="onDelete">删除</button>
          <button @click="onLike">👍 {{ comment.likes }}</button>
          <span class="time">{{ formatTime(comment.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- 子评论（递归） -->
    <div class="children" v-if="comment.children?.length">
      <CommentItem
        v-for="child in comment.children"
        :key="child._id"
        :comment="child"
        @reply="$emit('reply', $event)"
        @delete="$emit('delete', $event)"
        @like="$emit('like', $event)"
      />
    </div>
  </div>
</template>
<style>
.comment-item {
  margin-top: 16px;
}

.comment-main {
  display: flex;
  align-items: flex-start;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  border: 1px solid #939191;
}

.body {
  flex: 1;
}

.header {
  font-size: 14px;
  color: #555;
}

.username {
  font-weight: 600;
  margin-right: 6px;
}

.reply-to {
  color: #409eff;
  margin-right: 6px;
}

.time {
  color: #999;
  font-size: 12px;
}

.content {
  margin: 6px 0;
  line-height: 1.6;
}

.actions button {
  margin-right: 10px;
  font-size: 12px;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
}

.actions button:hover {
  color: #409eff;
}

.children {
  margin-left: 48px;
  margin-top: 8px;
  border-left: 2px solid #f0f0f0;
  padding-left: 12px;
}
</style>