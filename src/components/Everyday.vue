<script setup lang="ts">
import {ref,onMounted} from 'vue'
import { TodayAnalze } from '@/api/sleep';
import { todayAnalyze } from '@/api/sport';
import { TodayMood } from '@/api/mood';
import { TodayWeight } from '@/api/weight';
const tips = [
  '暂未传入数据',
  '暂未传入数据',
  '暂未传入数据',
  '暂未传入数据'
]
onMounted(async()=> {
   const sleepres = await TodayAnalze()
   const sportres = await todayAnalyze()
   const moodres = await TodayMood()
   const weightres = await TodayWeight()
   if(sleepres.data.summary) {
    tips[0] = sleepres.data.summary
   }
   if(sportres) {
    tips[1] = sportres.data.summary
   }
    if(weightres) {
    tips[2] = weightres.data.summary
   }
   if(moodres) {
    tips[3] = moodres.data.summary
   }
})
const activeTab = ref<number | null>(null)
  console.log('2',tips);
</script>
<template>
    <ul class="today">
       <li
       v-for="(item,index) in tips"
       :key="index"
       @mouseenter="activeTab = index"
       @mouseleave="activeTab = null"
       >
      <span>
        {{  ['😪','💪','🥗','🥰'][index] }}
      </span>
      <span>
      {{
        ['睡眠时长', '运动步数', '体重情况', '情绪健康'][index]
      }}
    </span>
    <div
    class="oneWord"
    v-if="activeTab === index"
    >
  {{ item }}</div>
      </li>
    </ul>
</template>
<style scoped>
  ul {
    display: flex;
    list-style: none;
    gap: 16px;
  }
  ul li {
    position: relative;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  ul li span {
    font-size: 15px;
  }
  .oneWord {
  position: absolute;
  top: 100%;           
  left: 50%;
  margin-right: 60px;
  width: 200px;
  text-align: center;
  transform: translateX(-50%);
  margin-top: 5px;   
  background: #fefefe;
  color: #6d6d6d;
  box-shadow: 0 6px 22px rgba(0,0,0,0.15);
  font-size: 15px;
  padding: 6px 10px;
  border-radius: 6px;
  z-index: 10;
  transition: all .5s;
}
</style>