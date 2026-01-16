<script setup lang="ts">
import axios from "axios"
import SleepTime from './SleepTime.vue'
import { onMounted, ref } from 'vue'
const emit = defineEmits<{
  (e:'close'):void
}>()
interface SleepData {
  targetHour: number
  targetMin: number
  actualHour: number
  actualMin: number
  percent: number | null
}
interface Item {
    title: string
    hour: number
    min: number
}
const sleepData = ref<SleepData>({
  targetHour: 0,
  targetMin: 0,
  actualHour: 0,
  actualMin: 0,
  percent: null
})
const todayDate  = new Date().toISOString().split('T')[0]
//在组件加载之前调用接口
onMounted(()=> {
  fetchSleep()
})
const fetchSleep = async() => {
  const today = new Date().toISOString().split('T')[0]
  const token = localStorage.getItem('token')
  const res =  await axios.get(
    `http://localhost:3000/api/sleep/today?date=${today}`,
    {
      headers: {
        Authorization: token
      }
    }

  )
  if(res.data.code === 200) {
    if(res.data.data) {
      sleepData.value = res.data.data
    }else {
      return
    }
  }
}
// 是否显示弹窗
const showDialog = ref(false)

// 选中的日期
const selectedDate = ref('')

// 生成近三天日期
function getLast3Days() {
  const arr: string[] = []
  for (let i = 0; i < 3; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
   const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    arr.push(`${year}-${month}-${day}`)
  }
  return arr
}

const days = getLast3Days()

// 点击选择日期
function choose(d: string) {
  selectedDate.value = d
  console.log(selectedDate.value)
  showDialog.value = false

}

//存储睡眠数据
const handleSleepChange = async(data : SleepData) => {
  try {
    const today = new Date().toISOString().split("T")[0]
  const token = localStorage.getItem("token")
  console.log("token:", localStorage.getItem("token"))
  if(!token) {
    return alert('请先登录')
  }
  const res =  await axios.post(
     "http://localhost:3000/api/sleep",
      {
      date:today,
      actualHour:data.actualHour,
      actualMin:data.actualMin,
      targetHour:data.targetHour,
      targetMin:data.targetMin
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
  console.log('父组件收到数据:', data)
  sleepData.value = data
  console.log(sleepData.value.targetHour);
  }catch(error) {
    console.log(error)
     alert('服务器错误')
    
  }
  
}

</script>
<template>
    <div class="sleep" @click.stop>
       <div class="head">
       
        <div class="sleeping">
            <span>目标睡眠时长</span>
             <div class="process"><h1>{{sleepData.targetHour}}</h1>小时<h1>{{ sleepData.targetMin }}</h1>分钟</div>
        </div>
         <div class="sleeping">
            <span>目标睡眠时长</span>
             <div class="process"><h1>{{sleepData.actualHour}}</h1>小时<h1>{{ sleepData.actualMin }}</h1>分钟</div>
        </div>
        </div>
       <!-- <div
        class="open-box"
    @click="showDialog = true">
        <span>日期</span>
        <span>{{ selectedDate || todayDate }}</span>
       </div>
        <div v-if="showDialog" class="mask" @click="showDialog = false"></div>
        <div v-if="showDialog" class="dialog">
    <h3>选择近三天的日期</h3>

    <div class="list">
      <div
        class="item"
        v-for="d in days"
        :key="d"
        @click="choose(d)"
      >
        {{ d }}
      </div>
    </div>
  </div> -->

<SleepTime @sleep-change="handleSleepChange"/>
</div>
</template>
<style scoped>
.sleep {
    position: absolute;
    top: 50%;
    left: 40%;
    padding: 20px;
    margin-right: 400px;
    z-index: 1000;
    width: 400px;
    border-radius: 30px;
    background-color: #fff;
    border: solid 1px #b5b5b5;
}
.head {
    display:flex;
    justify-content: space-around;
}
.sleeping {
    width: 125px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.process {
    display: flex;
    align-items: baseline;
    gap: 5px;
}
.open-box {
    width: 340px;
    margin: 10px auto 10px auto;
    display: flex;
    border-radius: 20px;
    /* margin-top: 10px; */
    padding: 10px;
    background-color: #dfdede;
    justify-content: space-between;
}
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

/* 弹窗 */
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 260px;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 20px;
  z-index: 100;
}

.list {
  margin-top: 10px;
}

.item {
  padding: 10px;
  background: #f5f5f5;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.item:hover {
  background: #dfe8ff;
}
</style>