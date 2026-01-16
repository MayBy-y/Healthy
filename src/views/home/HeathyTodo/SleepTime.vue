<script setup lang="ts">
import { ref, computed,watch } from 'vue'
const emit = defineEmits<{
  (e: 'sleep-change', data: { targetHour: number,targetMin: number, actualHour: number, actualMin: number, percent: number|null }): void
}>()

// 目标睡眠时长（小时+分钟）
const targetHour = ref<number | null>(null)
const targetMinute = ref<number | null>(null)

// 实际睡眠时长（小时+分钟）
const actualHour = ref<number | null>(null)
const actualMinute = ref<number | null>(null)

// 完成度（百分比）
const percent = computed(() => {
  if (
    targetHour.value !== null && targetMinute.value !== null &&
    actualHour.value !== null && actualMinute.value !== null
  ) {
    const targetTotal = targetHour.value * 60 + targetMinute.value
    const actualTotal = actualHour.value * 60 + actualMinute.value
    if (targetTotal === 0) return 0
    return Math.min(100, Math.round((actualTotal / targetTotal) * 100))
  }
  return null
})

// 可读文本（例如 7h 30m）
const formatHM = (h: number | null, m: number | null) => {
  if (h === null && m === null) return ''
  const hh = h ?? 0
  const mm = m ?? 0
  return `${hh}小时 ${mm}分钟`
}
// watch([targetHour, targetMinute, actualHour, actualMinute, percent], () => {
//   if (
//     targetHour.value !== null && targetMinute.value !== null &&
//     actualHour.value !== null && actualMinute.value !== null
//   ) {
//     const targetTotal = targetHour.value * 60 + targetMinute.value
//     const actualTotal = actualHour.value * 60 + actualMinute.value

//     emit('sleep-change', {
//       targetHour:  targetHour.value,
//       targetMin:  targetMinute.value,
//       actualHour: actualHour.value,
//       actualMin:actualMinute.value,
//       percent: percent.value
//     })
//   }
// })
const submitData = () => {
  if (
    targetHour.value !== null &&
    targetMinute.value !== null &&
    actualHour.value !== null &&
    actualMinute.value !== null
  ) {
    emit('sleep-change', {
      targetHour: targetHour.value,
      targetMin: targetMinute.value,
      actualHour: actualHour.value,
      actualMin: actualMinute.value,
      percent: percent.value
    })
  } else {
    alert("请把四项数据都填写完整")
  }
}
</script>

<template>
  <div class="sleep-box">
    <h3>睡眠时长记录</h3>

    <div class="input-group">
      <label>目标睡眠</label>
      <div class="row">
        <input
          v-model.number="targetHour"
          type="number"
          min="0"
          placeholder="小时"
        />
        <input
          v-model.number="targetMinute"
          type="number"
          min="0"
          max="59"
          placeholder="分钟"
        />
      </div>
    </div>

    <div class="input-group">
      <label>实际睡眠</label>
      <div class="row">
        <input
          v-model.number="actualHour"
          type="number"
          min="0"
          placeholder="小时"
        />
        <input
          v-model.number="actualMinute"
          type="number"
          min="0"
          max="59"
          placeholder="分钟"
        />
      </div>
    </div>
<!-- 
    <div class="result-row">
      <div>目标：{{ formatHM(targetHour, targetMinute) || '未设置' }}</div>
      <div>实际：{{ formatHM(actualHour, actualMinute) || '未设置' }}</div>
    </div> -->

    <div v-if="percent !== null" class="progress-wrap">
      <div class="progress">
        <div class="bar" :style="{ width: percent + '%' }"></div>
      </div>
      <div class="percent">完成度：{{ percent }}%</div>
    </div>
    <button @click="submitData">确认</button>
  </div>
</template>

<style scoped>
button {
  width: 100px;
  font-size: 20px;
  border: 0;
  margin: 0 auto;
  border-radius: 20px;
}
.sleep-box {
  width: 340px;
  margin: 0 auto;
  padding: 18px;
  background: #dfdede;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group { display: flex; flex-direction: column; gap: 6px; }
.row { display: flex; gap: 8px; }

input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  outline: none;
}
input:focus { border-color: #7a9cff; box-shadow: 0 0 6px rgba(122,156,255,0.18); }

.result-row { display: flex; justify-content: space-between; font-size: 14px; color: #444 }

.progress-wrap { display: flex; align-items: center; gap: 10px; }
.progress { flex: 1; height: 10px; background: #f0f0f0; border-radius: 999px; overflow: hidden; }
.bar { height: 100%; border-radius: 999px; transition: width 300ms ease; background: linear-gradient(90deg, #7a9cff, #4a6bff); }
.percent { width: 80px; text-align: right; font-weight: 600; }
</style>
