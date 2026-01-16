<script setup lang="ts">
import Sleep from './HeathyTodo/Sleep.vue'
import Run from './HeathyTodo/run.vue'
import Weight from './HeathyTodo/weight.vue'
import Mood from './HeathyTodo/Mood.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

function getStepData(data: { target: number; actual: number; percent: number }) {
  console.log("收到步数数据：", data)
}

const showSleep = ref(false)
const showRun = ref(false)
const showWeight = ref(false)
const showMood = ref(false)

// 点击空白关闭
function handleClickOutside(e: MouseEvent) {
  const sleepBox = document.getElementById('sleep-box')
  if (sleepBox && !sleepBox.contains(e.target as Node)) showSleep.value = false

  const runBox = document.getElementById('run-box')
  if (runBox && !runBox.contains(e.target as Node)) showRun.value = false

  const weightBox = document.getElementById('weight-box')
  if (weightBox && !weightBox.contains(e.target as Node)) showWeight.value = false

  const moodBox = document.getElementById('mood-box')
  if (moodBox && !moodBox.contains(e.target as Node)) showMood.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 子组件关闭回调
function closeSleep() { showSleep.value = false }
function closeRun() { showRun.value = false }
function closeWeight() { showWeight.value = false }
function closeMood() { showMood.value = false }

</script>

<template>
  <section>
    <div class="card" style="background: #faebce" id="run">
      <h1>运动记录</h1>
      <span>1 公里跑步</span>
      <button class="begin"  @click.stop="showRun = true">开始运动</button>    
    </div>

    <div class="card" style="background: #fce9ff" id='sleep'>
      <h1>睡眠</h1>
      <span>舒眠减压 监测睡眠</span>
      <button @click.stop="showSleep = true" class="begin">手动输入</button>    
    </div>

    <div class="card" style="background: #c8f6e9" id='eat'>
      <h1>体重管理</h1>
      <span>体成分测量 饮食管理</span>
      <button class="begin" @click.stop="showWeight = true">编辑目标</button>    
    </div>

    <div class="card" style="background: #c8ebf6" id='mood'>
      <h1>情绪健康</h1>
      <span>情绪管理 减压放松</span>
      <button class="begin"  @click.stop="showMood = true">放松一下</button>    
    </div>
  </section>

  <!-- 子组件 -->
  <Sleep v-if="showSleep" id="sleep-box" @close="closeSleep" />
  <Run v-if="showRun" id="run-box" @close="closeRun" @step-change="getStepData" />
  <Weight v-if="showWeight" id="weight-box" @close="closeWeight" @step-change="getStepData" />
  <Mood v-if="showMood" id="mood-box" @close="closeMood" />
</template>

<style scoped>
  section {
    width: 1200px;
    margin: 0 auto;
    margin-bottom: 100px;
    display: flex;
    justify-content: space-between;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: #fff;
    border:solid 1px #e3e2df;
    width: 20%;
    height:223px;
    border-radius: 43px;
    padding: 20px;
  }
  .card span {
    color: #868584;
  }
  .card .begin {
    background-color: #fff;
    width: 78px;
    border-radius: 32px;
    line-height: 24px;
    text-align: center;
    border: 0;
  }
  .begin:hover {
    cursor: pointer;
  }
</style>