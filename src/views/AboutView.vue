<script setup lang="ts">
import { ref, onMounted ,computed} from "vue";
import { addSport, getSportList } from "../api/sport";
import * as echarts from "echarts/core";
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import Header from "@/components/Header.vue";
import AboutSport from "./Aboutview/AboutSport.vue";
import AboutSleep from "./Aboutview/AboutSleep.vue";
import AboutWeight from "./Aboutview/AboutWeight.vue";
import { use } from "echarts/core";
import { transform } from "typescript";
const activeTab = ref("sport")

//按钮划出
const expanded = ref(false)
const activeIndex = ref(0)
const arrowIndex = computed(() => (expanded.value ? 3 : 0))
const arrowStyle = computed(() => ({
  left: `${110 + arrowIndex.value * 116}px`   
}))

const buttons = ["sport", "sleep", "menstrual", "all"];
const buttonActive = (index:number) => {
   if(!expanded.value) {
    return {
      transform: "translateX(0px)",
      opacity: index === activeIndex.value ? 1 : 0,
    }
   }
   return {
    transform: `translateX(${index * 110}px)`,
    opacity: 1,
  };
}
const toggleExpand = () => {
  expanded.value = !expanded.value;
};
const handleClick = (index:number) => {
  console.log(buttons[index]);
  
  activeIndex.value = index;
  console.log(activeIndex.value);
  
  expanded.value = false; // 收回
};
</script>

<template>
  <Header />
  <main><div class="choose">
    <div class="row">
    <button v-for="(item,i) in buttons"
     :key="i"
     class="btn"
     
     :style="buttonActive(i)"
     @click=" activeTab = item ;handleClick(i)"
     :class="{show: i === activeIndex}"
    >{{ item }}</button>
    <button class="arrow" 
     :style="arrowStyle"
    @click="toggleExpand">
        ➤
      </button></div>
  </div>
  <AboutSport v-if="activeTab === 'sport'" />
  <AboutSleep v-if="activeTab === 'sleep'" />
  <AboutWeight v-if="activeTab === 'menstrual'" />
  <div class="picture"></div></main>
  
</template>

<style scoped>
.picture {
  position: fixed;
  top: 800px;
  right: 5px;
  width: 150px;
  height: 100px;
  background: url('../../public/hellokitty5.gif') no-repeat;
}
.choose {
  display: flex;
  align-items: center;
  position: absolute;
  top: 80px;
  left: 20px;
}
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
}
.btn{
   position: absolute;
  left: 0;
  top: 0;
   display: block;
   width: 100px;
   height: 50px;
   line-height: 30px;
   font-size: 20px;
   background-color: #f3d0f7;
   border: 0;
   border-radius: 10px;
   cursor: pointer;
   opacity: 0;
   color: #fff;
   margin-top: 5px;
   transform: translateX(0);
  transition: transform 0.4s ease, opacity 0.3s ease;
}
.btn.show {
  opacity: 1;
}
.choose button:hover {
  background-color: #fac6fe;
}
.arrow {
   position: absolute;
   top: 6px;

  width: 50px;
  height: 50px;
  font-size: 22px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #f3d0f7;
   transition: left 0.4s ease;
}
</style>
