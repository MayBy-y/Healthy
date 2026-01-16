<template>
  <div class="sleep-form">
    <h2 class="form-title">录入睡眠数据</h2>

    <form @submit.prevent="submitSleep" class="form">
      <div class="form-group">
        <label for="sleepStart">入睡时间</label>
        <input
          type="datetime-local"
          id="sleepStart"
          v-model="sleepStart"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="sleepEnd">醒来时间</label>
        <input
          type="datetime-local"
          id="sleepEnd"
          v-model="sleepEnd"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="deepSleepDuration">深度睡眠（小时）</label>
        <input
          type="number"
          id="deepSleepDuration"
          v-model="deepSleepDuration"
          step="0.1"
          min="0"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="lightSleepDuration">浅睡眠（小时）</label>
        <input
          type="number"
          id="lightSleepDuration"
          v-model="lightSleepDuration"
          step="0.1"
          min="0"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="awakeDuration">清醒次数</label>
        <input
          type="number"
          id="awakeDuration"
          v-model="awakeDuration"
          step="0.1"
          min="0"
          class="form-input"
          required
        />
      </div>

      <button type="submit" class="submit-btn">提交</button>
      <span>      建议佩戴健康手表录入睡眠时间更为准确</span>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
const form = ref({
})
const sleepStart = ref('')
const sleepEnd = ref('')
const deepSleepDuration = ref(0)
const lightSleepDuration = ref(0)
const awakeDuration = ref(0)
const token = localStorage.getItem("token")
const submitSleep = async () => {
  try {
    const date = sleepStart.value.split('T')[0]

    const res = await axios.post('http://localhost:3000/api/deepsleep/deeply', {
      date,
      sleepStart: sleepStart.value,
      sleepEnd: sleepEnd.value,
      deepSleepDuration: deepSleepDuration.value,
      lightSleepDuration: lightSleepDuration.value,
      awakeDuration: awakeDuration.value,
    },{
            headers: {
                Authorization: token
            }
        }
  )
   if (res.data?.code === 200) {
  sleepStart.value =''
  sleepEnd.value= ''
  deepSleepDuration.value = 0
  lightSleepDuration.value = 0
  awakeDuration.value = 0
   }
  } catch (err) {
    alert('提交失败')
    console.error(err)
  }
}
</script>

<style scoped>
.form span{
  font-size: 12px;
  color: #555;
  padding-left: 65px;
  padding-top: 10px;
}
.sleep-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
}

.form {
  width: 384px;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-size: 1rem;
  color: #555;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #3498db;
}

.submit-btn {
  padding: 12px;
  background-color: #ebb4f3;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.submit-btn:active {
  background-color: #1f6f99;
}
</style>
