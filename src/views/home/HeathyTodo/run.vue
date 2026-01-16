<script setup lang="ts">
import axios from "axios"
import { ref, computed, onMounted } from 'vue'
// 用户输入
const target = ref<number | null>(null)
const actual = ref<number | null>(null)
  const emit = defineEmits<{
  (e:'close'):void
}>()
//在页面加载前调用接口
onMounted(()=> {
  fetchSport()
})
const fetchSport = async()=> {
   const today = new Date().toISOString().split('T')[0]
  const token = localStorage.getItem('token')
  const res = await axios.get(
    `http://localhost:3000/api/steps/today?date=${today}`,
    {
      headers: {
        Authorization: token
      }
    }
  )
   if(res.data.code === 200) {
    if(res.data.data) {
      target.value = res.data.data.idealSteps,
      actual.value = res.data.data.steps
    }else {
      return
    }
  }
}

//储存输入数据
 const showRun = ref(true) 
function handleClickOutside(e: MouseEvent) {
  const sleepBox = document.querySelector('.step-box')
    showRun.value = false
}
const saveSteps = async() => {
   try{
     const today = new Date().toISOString().split("T")[0]
     const token  = localStorage.getItem("token")
     if(!token) {
       return alert('请先登录')
     }
     const res = await axios.post(
      "http://localhost:3000/api/steps",
      {
        date:today,
        idealSteps:target.value,
        steps:actual.value
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
// 完成度百分比
const percent = computed(() => {
  if (target.value === null || actual.value === null || target.value === 0) {
    return 0
  }
  return Math.min(100, Math.round((actual.value / target.value) * 100))
})
</script>

<template>
  <div class="step-box" >
     
       
    <div class="input-group">
      <label>目标步数</label>
      <input v-model.number="target" type="number" min="0" placeholder="请输入目标步数" />
    </div>

    <div class="input-group">
      <label>实际步数</label>
      <input v-model.number="actual" type="number" min="0" placeholder="请输入实际步数" />
    </div>

    <!-- 进度条 -->
    <div class="progress-wrap" v-if="target !== null && actual !== null">
      <div class="progress">
        <div class="bar" :style="{ width: percent + '%' }"></div>
      </div>
      <span class="percent">{{ percent }}%</span>
    </div>
    <button @click="saveSteps">确认</button>
  </div>
</template>

<style scoped>
button {
  width: 100px;
  text-align: center;
  font-size: 20px;
  background-color: #d7d5d5;
  border-radius: 20px;
  border: 0;
  margin: 0 auto;
}
.head {
  display: flex;
  justify-content: space-around;
  gap: 10px;
  
}
.process {
  display: flex;
  align-items: baseline;
  gap: 5px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step-box {
    position: absolute;
    top: 50%;
    left: 43%;
    width: 300px;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input {
  padding: 8px 10px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress {
  flex: 1;
  height: 10px;
  background: #eee;
  border-radius: 999px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #d8fcfe;
  transition: width .3s ease;
}

.percent {
  font-weight: bold;
  width: 45px;
  text-align: right;
}
</style>
