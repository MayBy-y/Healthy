<script setup lang="ts">
import { ref, onMounted,computed } from "vue";
import { addSport, getSportList } from "../../api/sport.ts";
import * as echarts from "echarts/core";
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import SportAi from "./SportAi.vue";
import { use } from "echarts/core";
use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]);
//盒子滑动
const container = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
interface SportItem {
  _id: string;
  date: string;
  type: string;
  duration: number;
  calories?: number;
  note?: string;
}
const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  startX.value = e.pageX - (container.value?.offsetLeft || 0)
  scrollLeft.value = container.value?.scrollLeft || 0
  e.preventDefault()
}

const dragging = (e :MouseEvent) => {
  if(!isDragging.value || !container.value) return 
  const x = e.pageX - container.value.offsetLeft;
  const speace = (x - startX.value) *1
  container.value.scrollLeft = scrollLeft.value - speace
   e.preventDefault()
}
const stopDrag = () => {
  isDragging.value = false;
}
//表单域
const form = ref({
  date: "",
  type: "",
  duration: "",
  calories: "",
  note: ""
});

const list = ref<SportItem[]>([]);
const loading = ref(false);
const error = ref("");

// 最近7天日期
const last7Days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return d.toISOString().slice(0, 10);
});

// 获取列表
const loadList = async () => {
  try {
    const res = await getSportList();
    list.value = Array.isArray(res.data.data) ? res.data.data : [];
    drawChart();
  } catch (err) {
    console.error("加载运动列表失败", err);
    list.value = [];
  }
};
// 提交表单
const submit = async () => {
  if (!form.value.date || !form.value.type || !form.value.duration) {
    error.value = "日期、运动类型、时长为必填";
    return;
  }

  error.value = "";
  loading.value = true;

  try {
    await addSport({
      date: form.value.date,
      type: form.value.type,
      duration: Number(form.value.duration),
      calories: form.value.calories ? Number(form.value.calories) : 0,
      note: form.value.note
    });

    form.value = { date: "", type: "", duration: "", calories: "", note: "" };
    await loadList();
  } finally {
    loading.value = false;
  }
};

// 绘制最近7天图表
const drawChart = () => {
  const map: Record<string, { duration: number; calories: number }> = {}

  // 初始化 map
  last7Days.forEach(date => {
    map[date] = { duration: 0, calories: 0 };
  });

  
  list.value.forEach(item => {
    const date = item.date
    if(!map[date]) {
      map[date] = {
        duration: item.duration,
        calories: item.calories || 0
      }
    }else {
      map[date]!.duration += item.duration;
      map[date]!.calories += item.calories || 0;
    }
  });

  const durationData = last7Days.map(date => map[date]?.duration ?? 0);
  const caloriesData = last7Days.map(date => map[date]?.calories ?? 0);

  const chartDom = document.getElementById("sportChart")!;
  const myChart = echarts.init(chartDom);

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['运动时长(分钟)', '消耗热量(kcal)'] },
    xAxis: { type: 'category', data: last7Days },
    yAxis: [{ type: 'value' }, { type: 'value' }],
    series: [
      { name: '运动时长(分钟)', type: 'line', data: durationData,lineStyle: { color: '#8fbef7' }, 
      itemStyle: { color: '#8fbef7' }  },
      { name: '消耗热量(kcal)', type: 'line', data: caloriesData, yAxisIndex: 1 ,lineStyle: { color: '#cd9ded' }, itemStyle: { color: '#cd9ded' }}
    ]
  };
  
  myChart.setOption(option);
   window.addEventListener("resize", () => {
    myChart.resize();
  }); 
};

onMounted(() => {
  loadList();
});
</script>
<template>
   <div class="sport-container" ref="container">
  <div class="row"
    @mousedown.self="startDrag"
    @mousemove.self="dragging"
    @mouseup.self="stopDrag"
    @mouseleave.self="stopDrag"
  >

    
<div class="picture">
    <h2>最近7天运动图表</h2>
    <div id="sportChart" style="width: 100%; height: 300px;"></div>

    <h2 class="second">运动列表</h2>
    <ul class="list">
      <li v-for="item in list.slice(0, 6)" :key="item._id" class="item-card" >
        <div class="card-header"><span>{{ item.date }}</span><h3>{{ item.type }}</h3></div>
        <div class="card-body"><span>{{ item.duration }} 分钟</span><span v-if="item.calories">  🔥{{ item.calories }} kcal</span></div>
        <p v-if="item.note" class="note">⭐{{ item.note }}</p>
      </li>
    </ul>
  </div>
  <div class="form-box">
      <h2>新增运动数据</h2>
      <div class="form-row"><label>日期</label><input type="date" v-model="form.date" /></div>
      <div class="form-row"><label>运动类型</label><input type="text" v-model="form.type" placeholder="跑步/骑行" /></div>
      <div class="form-row"><label>运动时长</label><input type="number" v-model="form.duration" placeholder="分钟" /></div>
      <div class="form-row"><label>消耗热量</label><input type="number" v-model="form.calories" placeholder="kcal(可选)" /></div>
      <div class="form-row"><label>备注</label><textarea v-model="form.note" placeholder="可选备注"></textarea></div>
      <button :disabled="loading" @click="submit">{{ loading ? '提交中...' : '新增运动' }}</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
    <div class="third"><SportAi /></div>
  
  </div>
</div>
  
</template>
<style scoped>
.second {
  margin-bottom: 20px;
}
.sport-container { 
  width: 100%;
  margin-top: 80px; 
  font-family:Segoe UI,sans-serif;
  overflow-x: auto;
  cursor: grab;
  scroll-behavior: smooth;
}
.sport-container:active {
  cursor: grabbing;
}
.row {
  width: 120%;
  height: 100%;
  margin-top: 80px; 
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.form-box { 
  /* margin-top: 100px;  */
  background:#fff; 
  padding:20px; 
  border-radius:10px; 
  box-shadow:0 4px 12px rgba(0,0,0,0.05); 
  margin-bottom:20px; 
}
.form-row { 
  display:flex; 
  flex-direction:column; 
  margin-bottom:10px; 
}
label { font-weight:600; margin-bottom:4px; }
input,textarea { padding:10px 5px; width: 507px; border:1px solid #ccc; border-radius:6px; font-size:14px; }
button { width:100%; padding:10px; border:none; border-radius:6px; background:#f1ccef; color:#fff; cursor:pointer; }
button:disabled { opacity:0.6; cursor:not-allowed; }
.list { 
  margin-left: 20px;
  height: 462px;
   list-style:none;
   padding:0; 
   width: 400px; 
   display: flex;
   flex-wrap: wrap;
   justify-content: space-around;
  }
.item-card { 
  width: 164px;
  background:#f9f9f9; 
  padding:12px; 
  margin-bottom:10px; 
  border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.05);
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
.card-header { display:flex;flex-direction: column; align-items: center; font-weight:600; margin-bottom:6px; }
.card-body { display:flex;gap: 6px; color:#555; }
.note { font-size:14px;
 margin:4px auto 0px;
  color:#6b6a6b;
  display: flex;
  align-items: center;
  }
.error { color:red; margin-top:6px; }
.picture {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#sportChart {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
}
</style>