<template>
  <div class="About" 
    ref="container"
    @mousedown="startDrag"
    @mousemove="dragging"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
  > 
    <div class="aviod">
      <!-- 左侧列表和图表 -->
      <div class="left">
        <!-- 数据切换按钮 -->
        <div class="chart-controls">
          <button @click="() => switchData('target-actual')">目标/实际睡眠</button>
          <button @click="() => switchData('deep-light')">深/浅睡眠</button>
        </div>

        <!-- 图表容器 -->
        <div id="sleepChart" style="width: 400px; height: 400px;"></div>

        <!-- 睡眠列表 -->
        <ul class="list">
          <li v-for="item in list" :key="item.date" class="item-card">
            <div class="card-header"><span>{{ item.date || '' }}</span></div>
            <div class="card-body"><span>{{ item.target  || 0}} h</span></div>
            <div>😴{{ item.actual  || 0 }} h</div>
          </li>
        </ul>
      </div>

      <!-- 右侧输入组件 -->
      <div class="right"><SleepInput /></div>
      <div class="third"><SleepAi /></div>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSleeplist, getToday } from "../../api/sleep.ts";
import * as echarts from "echarts/core";
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import SleepInput from "./SleepInput.vue";
import SleepAi from "./SleepAi.vue";

import { use } from "echarts/core";
use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]);

// 拖拽滚动
const container = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  startX.value = e.pageX - (container.value?.offsetLeft || 0);
  scrollLeft.value = container.value?.scrollLeft || 0;
};
const dragging = (e: MouseEvent) => {
  if (!isDragging.value || !container.value) return;
  const x = e.pageX - container.value.offsetLeft;
  const move = (x - startX.value);
  container.value.scrollLeft = scrollLeft.value - move;
};
const stopDrag = () => { isDragging.value = false; };

// 数据类型切换
const dataType = ref<'target-actual' | 'deep-light'>('target-actual');

interface SleepItem {
  date: string;
  targetHour: number;
  targetMin: number;
  actualHour: number;
  actualMin: number;
  target?: number;
  actual?: number;
  deepHour?: number;
  deepMin?: number;
  lightHour?: number;
  lightMin?: number;
  deep?: number;
  light?: number;
}

const list = ref<SleepItem[]>([]);
const last7Days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return d.toISOString().slice(0, 10);
});

const map: Record<string, { target: number; actual: number; deep: number; light: number }> = {};
last7Days.forEach(date => {
  map[date] = { target: 0, actual: 0, deep: 0, light: 0 };
});

let myChart: echarts.ECharts;

// 切换数据类型
const switchData = (type: 'target-actual' | 'deep-light') => {
  dataType.value = type;
  updateChart();
};

// 更新图表
const updateChart = () => {
  const series = [];
  let legendData: string[] = [];

  // 填充 map
  last7Days.forEach(date => map[date] = { target: 0, actual: 0, deep: 0, light: 0 });
  list.value.forEach(item => {
    const date = item.date;
    if(!map[date]) map[date] = { target: 0, actual: 0, deep: 0, light: 0 };
    map[date].target += item.target || 0;
    map[date].actual += item.actual || 0;
    map[date].deep += item.deep || 0;
    map[date].light += item.light || 0;
  });

  if(dataType.value === 'target-actual') {
    legendData = ['目标睡眠时长(小时)', '实际睡眠时长(小时)'];
    const targetData = last7Days.map(date => map[date]?.target ?? 0);
    const actualData = last7Days.map(date => map[date]?.target ?? 0);
    series.push({ name: legendData[0], type: 'line', data: targetData, lineStyle: { color: '#8fbef7' }, itemStyle: { color: '#8fbef7' } });
    series.push({ name: legendData[1], type: 'line', data: actualData, lineStyle: { color: '#cd9ded' }, itemStyle: { color: '#cd9ded' } });
  } else {
    legendData = ['深睡时长(小时)', '浅睡时长(小时)'];
    const deepData = last7Days.map(date => map[date]?.deep ?? 0);
    const lightData = last7Days.map(date => map[date]?.deep ?? 0);
    series.push({ name: legendData[0], type: 'line', data: deepData, lineStyle: { color: '#4caf50' }, itemStyle: { color: '#4caf50' } });
    series.push({ name: legendData[1], type: 'line', data: lightData, lineStyle: { color: '#ff9800' }, itemStyle: { color: '#ff9800' } });
  }

  myChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: legendData },
    xAxis: { type: 'category', data: last7Days },
    yAxis: [{ type: 'value' }],
    series
  }, true);
};

// 加载列表数据
const loadList = async () => {
  try {
    const res = await getSleeplist();
    const anres = await getToday()
    list.value = Array.isArray(res.data.data) ? res.data.data : [];
    list.value.forEach(item => {
      item.target = Number((item.targetHour + item.targetMin/60).toFixed(1));
      item.actual = Number((item.actualHour + item.actualMin/60).toFixed(1));
      item.deep =  
      item.light = Number(((item.lightHour || 0) + (item.lightMin || 0)/60).toFixed(1));
    });
    drawChart();
  } catch(e) {
    console.error("加载睡眠列表失败", e);
    list.value = [];
  }
};

// 绘制图表
const drawChart = () => {
  const chartDom = document.getElementById("sleepChart")!;
  myChart = echarts.init(chartDom);
  updateChart();
  window.addEventListener("resize", () => {
    myChart.resize();
  });
};

onMounted(() => {
  loadList();
});
</script>

<style scoped>
.About {
  margin-top: 100px;
  padding-right: 50px;
  width: 100%;
  overflow-x: auto;
  cursor: grab;
  user-select: none;
  scroll-behavior: smooth;
}
.About:active { cursor: grabbing; }

.aviod {
  width: 115%;
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  align-items: center;
  margin-top: 100px;
  padding-right: 10px;
}

.list { 
  margin-left: 20px;
  height: 352px;
  list-style:none;
  padding:0; 
  width: 400px; 
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.item-card { 
  background:#f9f9f9; 
  padding:12px; 
  margin-bottom:10px; 
  border-radius:8px; 
  box-shadow:0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.item-card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

#sleepChart {
  width: 400px;
  height: 400px;
}

.chart-controls {
  margin-bottom: 10px;
}
.chart-controls button {
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
