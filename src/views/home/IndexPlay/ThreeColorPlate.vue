<script setup lang="ts">
interface Item {
  icon: string
  title: string
  value: string | number
  unit?: string
}

interface Props {
  items: Item[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="three">
  <div class="grid gap-4 grid-cols-3 three-plate">
    <div class="three-head">
            <button @click="$emit('prev')"></button>
        </div>
    <div
      v-for="item in props.items"
      :key="item.title"
      class="card"
    >
      <div class="icon">{{ item.icon }}</div>
      <div class="title">{{ item.title }}</div>
      <div class="value">
        {{ item.value }}
        <span v-if="item.unit">{{ item.unit }}</span>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.three {
    width: 1000px;
    height: 600px;
    margin: 80px auto;
    /* background-color: #fff; */
    /* border: solid 1px #dbd8d8; */
    border-radius: 27px;
    overflow: hidden;

}
.three-plate {
  width: 1000px;
}

.card {
  height: 186.666px;
  background: white;
  border-radius: 20px;
  padding: 18px 12px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: 0.25s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 22px rgba(0,0,0,0.15);
}

.icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
}

.value {
  margin-top: 6px;
  font-size: 20px;
  font-weight: bold;
  color: #222;
}

.value span {
  font-size: 14px;
  opacity: 0.7;
  margin-left: 2px;
}
 .three-head button {
    display: block;
    width: 53px;
    height: 40px;
    background-image: url('t1.png');
    background-size: 45px 33px;
    border: 0;
    margin-top: -4px;
    border:solid 4px  #f6f4f4;
    border-radius: 10px;
}
</style>
