<script setup lang="ts">
import axios from "axios"
import { ref, onMounted} from "vue"


const emit = defineEmits<{
  (e:'close'):void
}>()
const mood = ref<string>("")
const note = ref<string>("")

const saveMood = async() => {
   try{
     const today = new Date().toISOString().split("T")[0]
     const token  = localStorage.getItem("token")
     if(!token) {
       return alert('请先登录')
     }
     const res = await axios.post(
      "http://localhost:3000/api/mood",
      {
        date:today,
        IdealMood:mood.value,
        mood:note.value
      },
      {
        headers: {
           Authorization: `${token}`
        }
      }
     )
     if(res.data.code === 200) {
       emit('close')
     }else {
    alert('输入失败')
  }
   }catch(error) {
     console.log(error)
     alert('服务器错误')
   }
}
</script>

<template>
  <div class="emotion-box">
    <h3>情绪管理</h3>

    <div class="mood-group">
      <label>今日心情</label>
      <select v-model="mood">
        <option value="">请选择</option>
        <option value="开心 😄">开心 😄</option>
        <option value="一般 🙂">一般 🙂</option>
        <option value="低落 😞">低落 😞</option>
        <option value="压力大 😣">压力大 😣</option>
        <option value="烦躁 😡">烦躁 😡</option>
      </select>
    </div>

    <div class="note-group">
      <label>备注</label>
      <textarea
        v-model="note"
        placeholder="如果想记录发生了什么，可以写在这里..."
      ></textarea>
    </div>
    <button @click="saveMood">确认</button>
  </div>
</template>

<style scoped>
.emotion-box {
    position: absolute;
    top: 50%;
    left: 43%;
  width: 320px;
  padding: 16px;
  background: #f4f7ff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  font-weight: 600;
}

select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
}

textarea {
  width: 100%;
  padding: 8px;
  height: 80px;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  resize: none;
}
</style>
