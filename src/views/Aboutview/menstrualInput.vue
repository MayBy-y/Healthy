<template>
  <div class="menstruation-container">
    <h1 class="title">🌸 月经预测</h1>

    <!-- 输入区域 -->
    <div class="form card-float">
      <label>最近一次月经开始日期</label>
      <input type="date" v-model="lastPeriod" class="input" />

      <label>平均周期（天）</label>
      <input type="number" v-model.number="cycle" class="input" />

      <label>经期长度（天）</label>
      <input type="number" v-model.number="duration" class="input" />

      <button class="btn" @click="predict">
        立即预测
      </button>
    </div>
    <transition name="fade-up" appear>
      <div v-if="showResult" class="result card-float">
        <h3>预测结果</h3>
        <p>📅 下次月经：<b>{{ result.nextPeriod }}</b></p>
        <p>💧 排卵日：<b>{{ result.ovulationDay }}</b></p>
        <p>🌸 排卵期：<b>{{ result.ovulationStart }} ~ {{ result.ovulationEnd }}</b></p>
        <p>🛡 安全期：<b>{{ result.safeStart }} ~ {{ result.safeEnd }}</b></p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue"
import { addMenstrual } from "@/api/menstrual"
interface menstrualItem {
    startDate: Date,
    stayTime: number,
    leaveTime: number,
}
const lastPeriod = ref("")
const cycle = ref(28)
const duration = ref(5)
const showResult = ref(false)
const result = ref<any>(null)
onMounted(()=>{
  const text = localStorage.getItem('menRes')
  if(!text) return;
  try {
   const menResult = JSON.parse(text)
   if(menResult) {
    result.value = menResult
    setTimeout(() => {
      showResult.value = true
    }, 0)
  }
  }catch(err) {
    console.error("JSON parse error:", err);
  }
  
})
const formatDate = (date: Date) => date.toISOString().split("T")[0]
const addDays = (d: Date, n: number) => {
  const date = new Date(d)
  date.setDate(date.getDate() + n)
  return date
}

const predict = async() => {
  if (!lastPeriod.value) return alert("请选择日期")

  const start = new Date(lastPeriod.value)
  const nextPeriod = addDays(start, cycle.value)
  const ovulation = addDays(nextPeriod, -14)
  const ovulationStart = addDays(ovulation, -3)
  const ovulationEnd = addDays(ovulation, +1)
  const periodEnd = addDays(start, duration.value - 1)
  const safeStart = addDays(periodEnd, 1)
  const safeEnd = addDays(ovulationStart, -1)
  const data:menstrualItem = {
    startDate: new Date(lastPeriod.value),
    stayTime:cycle.value,
    leaveTime:duration.value
  }
  try{
    const res  =  await addMenstrual(data) 
  }catch(error){
    console.log(error);
    
  }
  result.value = {
    nextPeriod: formatDate(nextPeriod),
    ovulationDay: formatDate(ovulation),
    ovulationStart: formatDate(ovulationStart),
    ovulationEnd: formatDate(ovulationEnd),
    safeStart: formatDate(safeStart),
    safeEnd: formatDate(safeEnd),
  }
  showResult.value = true
  localStorage.setItem('menRes',JSON.stringify(result.value) )
}
</script>

<style scoped>
/* 容器 */
.menstruation-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

/* 标题动画 */
.title {
  text-align: center;
  font-size: 28px;
  padding-bottom: 10px;
  color: #e95fa4;
  animation: fadeIn 0.8s ease forwards;
}

/* 卡片浮动动画 */
.card-float {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 18px;
  margin-top: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(255, 169, 207, 0.25);
  /* animation: floatIn 0.8s ease; */
  gap: 10px;
}

/* 输入框光晕动画 */
.input {
  padding: 10px ;
  width: 330px;
  border-radius: 8px;
  border: 1px solid #ffd1e6;
  outline: none;
  transition: 0.3s;
}
.input:focus {
  border-color: #ff7ebd;
  box-shadow: 0 0 10px rgba(255, 126, 190, 0.5);
}

/* 按钮波纹动画 */
.btn {
  margin-top: 10px;
  padding: 10px 15px;
  background: linear-gradient(135deg, #ff8cc6, #ff61a5);
  border: none;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  transition: 0.3s;
}
.btn:hover {
  transform: translateY(-2px);
}
.btn:active {
  transform: scale(0.97);
}

/* 结果淡入动画 */
.fade-up-enter-active {
  animation: fadeUp 0.6s ease forwards;
}

/* keyframes */
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes floatIn {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
