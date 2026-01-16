<script setup lang="ts">
import { ref ,onMounted} from 'vue'
import axios from 'axios';
import ThreeFront from './ThreeFront.vue';
import ThreeColorPlate from './ThreeColorPlate.vue';
import { getToday } from '@/api/sport';
import { TodaySleep } from '@/api/sleep';
import { Moods } from '@/api/mood';
const sportTime = ref< number | null>(null)
const sleepTime = ref< number | null>(null)
const myMood = ref< string | null>(null)
interface SportItem {
  _id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  note?: string;
}
const list:SportItem = {
  _id: '',
  date: '',
  type: '',
  duration: 0,
  calories: 0,
  note: '',
};
let  items = [
  { icon: '🏃‍♂️', title:'运动', value:0, unit: 'min' },
  { icon: '😴', title: '睡眠', value: 0, unit: 'h' },
  { icon: '😊', title: '心情', value: '...', unit: '' }
]
//获取运动数据
const loadList = async()=> {
  try{
      const res = await getToday()
      const sleepRes = await TodaySleep()
      const moodres = await Moods()
      console.log(moodres.data.data);
      
      if(res) {
         list.duration = res.data.data.duration
         list.calories = res.data.data.calories
         list.type = res.data.data.type
         items = [
  { icon: '🏃‍♂️', title: list ? `${list.type}` : '未知类型', value:list.calories, unit: 'min' },
  { icon: '😴', title: '睡眠', value: 7.2, unit: 'h' },
  { icon: '😊', title: '心情', value: 8, unit: '' }
]
      }
      if(sleepRes) {
         items = [
  { icon: '🏃‍♂️', title: list ? `${list.type}` : '未知类型', value:list.calories, unit: 'min' },
  { icon: '😴', title: '睡眠', value:Math.floor( sleepRes.data.data.actualHour +sleepRes.data.data.actualMin / 60 ), unit: 'h' },
  { icon: '😊', title: '心情', value: 8, unit: '' }
      ]
      }
      if(moodres) {
        items = [
       { icon: '🏃‍♂️', title: list ? `${list.type}` : '未知类型', value:list.calories, unit: 'min' },
  { icon: '😴', title: '睡眠', value:Math.floor( sleepRes.data.data.actualHour +sleepRes.data.data.actualMin / 60 ), unit: 'h' },
  { icon: '😊', title:moodres.data.data.IdealMood , value: moodres.data.data.mood, unit: '' }
        ]
      }
  }catch(error) {

  }
}
onMounted(()=> {
  loadList()
})
const currentPage = ref(1)

function nextPage() {
  currentPage.value = 2
}

function prevPage() {
  currentPage.value = 1
}
</script>

<template>
  <!-- 最简单的方案，不改变任何结构 -->
  <transition name="flip" mode="out-in">
    <ThreeFront v-if="currentPage === 1" @next="nextPage" />
    <ThreeColorPlate v-else :items="items" @prev="prevPage" />
  </transition>
</template>

<style scoped>
/* 翻页动画 */
.flip-enter-active,
.flip-leave-active {
  transition: all 0.6s ease;
}

.flip-enter-from {
  opacity: 0;
  transform: rotateY(90deg);
}

.flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg);
}
</style>