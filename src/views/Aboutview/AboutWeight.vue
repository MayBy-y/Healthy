<template>
    <div class="menstrual-container">
        <menstrual-input />
         <div class="left">
        <div class="calendar-container">
     
    <!-- 顶部标题 -->
    <div class="top-bar">
      <button @click="prevMonth">‹</button>
      <h1>{{ year }}年{{ month + 1 }}月</h1>
      <button @click="nextMonth">›</button>
    </div>

    <!-- 星期行 -->
    <div class="week-row">
      <span v-for="w in weekLabels" :key="w">{{ w }}</span>
    </div>

    <!-- 日历网格 -->
    <div class="grid">
      <div
        v-for="(day, index) in days"
        :key="index"
        class="day"
        :class="{
          today: day.isToday,
          period: day.isPeriod,
          ovulation: day.isOvulation,
          nextPeriod: day.nextPeriod
        }"
      >
        <span>{{isNaN(day.date.getDate())? '' : day.date.getDate() }}</span>
      </div>
    </div>
    <div class="color">
        <div class="stay"><div></div><span>经期</span></div>
    <div class="nextStay"><div></div><span>排卵期</span></div>
    <div class="leave"><div></div><span>预测经期</span></div>
    </div>
    
  </div>
  <div class="menstrual-show">
      <div class="intime" v-if="activeTab === false">
        <div class="headof">
            <div class="smallAction">
                <span>经期</span>
                <div>第<h2>{{ periodIndex }}</h2>天</div>
            </div>
            <div class="smallAction">
                <span>周期</span>
                <div>共<h2>{{cycle}}</h2>天</div>
            </div>
        </div>
        <div class="bodyof">坚持每月记录经期，包括月经开始时间、结束时间、流量、痛经、身体症状等，可以帮您更好的了解自己的经期模式</div>
      </div>
      <div class="outof" v-if="activeTab === true"><span>月经周期的长短取决于卵巢周期的长短，一般为28-32天，如果仅偶尔1-2次月经延期，且无其他伴随症状，则不属于月经病范畴。</span></div> 
    </div>
    </div>
    <men-ai />
</div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import menstrualInput from "./menstrualInput.vue";
import MenAi from "./MenAi.vue";
import { getMen } from "@/api/menstrual";
const periodList = ref<any[]>([])
const lastPeriod = ref(""); 
const cycle = ref(28);
const duration = ref(5);
//在页面加载前调用
onMounted(async () => {
  try {
    const res = await getMen();
    const list = res?.data?.data || [];
    if (!Array.isArray(list) || list.length === 0) {
      console.log("无经期记录");
      return;
    }
    periodList.value = list;
    // 最新一条
    const latest = list[0]; 
    lastPeriod.value = toYMD(latest.startDate);
    duration.value = latest.leaveTime;
    cycle.value = latest.stayTime;
    console.log('lastPeriod', lastPeriod.value);
    
  } catch (e) {
    console.error("获取失败", e);
  }
});


// periodDates: 返回 YYYY-MM-DD 字符串数组，表示经期每一天
const periodDates = computed(() => {
    const result: string[] = [];
  periodList.value.forEach(p => {
    const start = ymdToDate(toYMD(p.startDate));
    if (!start) return;
   
    for (let i = 0; i < p.leaveTime; i++) {
      const d = addDaysDate(start, i);
      result.push(toYMD(d));
    }
  });
  return result;
});
//显示下次月经的预测时间
const nextPeriodTime = computed(() => {
  const r : string[] = []
  const nextPeriodDate = addDaysDate(ymdToDate(lastPeriod.value) || new Date('2025-12-09'),cycle.value)
  for(let i = 0;i<duration.value;i++){
     const d = addDaysDate(nextPeriodDate,i)
     r.push(toYMD(d))
  }
  console.log('下一次',r);
  return r
})

const isToday = computed(() => {
  const todayDate = toYMD(new Date())
  return periodDates.value.includes(todayDate)
})
const activeTab =  computed(() => !isToday.value);
//显示经期第几天
const periodIndex = computed(()=> {
  const todayDate = toYMD(new Date())
  const index = periodDates.value.indexOf(todayDate)
  return index >=0 ? index + 1 : 0
})

//转换日期格式
function toYMD(input: string | Date | null | undefined): string {
  if (!input && input !== '') return "";
  const s = String(input);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(input as any);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0] || '';
}

// 给一个 Date 对象加天，返回新的 Date（本地时间）
function addDaysDate(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function ymdToDate(ymd: string): Date | null {
  if (!ymd) return null;
  const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]), month = Number(m[2]) - 1, day = Number(m[3]);
  return new Date(year, month, day);
}


//计算排卵日
const ovulationDay = computed(() => {
  if (!lastPeriod.value) return "";
  const base = ymdToDate(lastPeriod.value);
  if (!base) return "";
  // 常用算法：排卵日 = 月经开始日 + (周期 - 14) 天
  const ovDayIdx = Number(cycle.value) - 14;
  const ovDate = addDaysDate(base, ovDayIdx);
  return toYMD(ovDate);
});

// ovulationDates: 排卵日前后各5天（合计 11 天）
const ovulationDates = computed(() => {
  const r: string[] = [];

  periodList.value.forEach(p => {
    const start = ymdToDate(toYMD(p.startDate));
    if (!start) return;

    const ovDayIdx = p.stayTime - 14;
    const ovDate = addDaysDate(start, ovDayIdx);

    for (let i = -5; i <= 5; i++) {
      const d = addDaysDate(ovDate, i);
      r.push(toYMD(d));
    }
  });

  return r;
});

// --- 月份视图（你的日历使用） ---
const today = new Date();
const year = ref(today.getFullYear());
const month = ref(today.getMonth());

const weekLabels = ["日", "一", "二", "三", "四", "五", "六"];

const days = computed(() => {
  const first = new Date(year.value, month.value, 1);
  const last = new Date(year.value, month.value + 1, 0);

  const result = [];
  const start = first.getDay();
  const total = last.getDate();

  for (let i = 0; i < start; i++) {
    result.push({
      date: new Date(NaN),
      isToday: false,
      isPeriod: false,
      isOvulation: false,
      nextPeriod:false,
    });
  }

  for (let i = 1; i <= total; i++) {
    const d = new Date(year.value, month.value, i);
    const key = toYMD(d);

    result.push({
      date: d,
      isToday: key === toYMD(today),
      isPeriod: periodDates.value.includes(key),
      isOvulation: ovulationDates.value.includes(key),
      nextPeriod: nextPeriodTime.value.includes(key)
    });
  }

  return result;
});


const prevMonth = () => {
  if (month.value === 0) {
    month.value = 11;
    year.value--;
  } else month.value--;
};

const nextMonth = () => {
  if (month.value === 11) {
    month.value = 0;
    year.value++;
  } else month.value++;
};
</script>

<style scoped>
.menstrual-container {
    display: flex;
    gap: 40px;
    align-items: center;
    margin-top: 100px;
}
.calendar-container {
  padding: 25px;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  background-color: #fff;
  border-radius: 20px;
  box-shadow:0 4px 12px rgba(0,0,0,0.05); 
}

.top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.top-bar button {
  background: #ffe6ec;
  border: none;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 20px;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #888;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 0 17px;
  font-size: 15px;
  color: #333;
  position: relative;
}

/* 今天 */
.day.today {
  border: 2px solid #ff8bab;
  border-radius: 10%;
  text-align: center;
  margin: 0;
  border-radius: 55%;
}

/* 经期粉色 */
.day.period {
  background: #ffd9e6;
}

/* 排卵期蓝色 */
.day.ovulation {
  background: #d7e8ff;
}
/* 下次经期预测 */
.day.nextPeriod {
 border: 2px dashed #f8afc8;
}
/* 空白日期隐藏文本 */
.day:has(span:empty) {
  background: transparent;
}
.stay,
.nextStay,
.leave {
  display: flex;
  align-items: center;
  gap: 5px;
}
.color {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
}
.stay div {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ffd9e6;
}
.nextStay div {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #d7e8ff;
}
.leave div {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f8afc8;
}
.menstrual-show {
   margin-top: 20px;
   background-color: #fff;
   border-radius: 10px;
    box-shadow:0 4px 12px rgba(0,0,0,0.05);
}
.outof {
    width: 437.5px;
    padding: 20px;
    font-size: 14px;
    color: #888;
}
.intime {
    width: 437.5px;
    padding: 20px;
}
.headof {
    
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.smallAction {
    text-align: center;
}
.smallAction div {
    display: flex;
    justify-content: center;
    gap: 5px;
    color: #333;
    align-items: baseline;
}
.smallAction div  {
    font-size: 20px;
}
.smallAction span {
    color: #888;
}
.bodyof {
    margin-top: 20px;
    color: #888;
    font-size: 14px;
}
</style>
