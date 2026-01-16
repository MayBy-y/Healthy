<script setup lang="ts">
import Header from '../components/Header.vue'
import IndexPlay from './home/IndexPlay.vue';
import heathyList from './home/HeathyList.vue';
// import TheWelcome from '../components/TheWelcome.vue'
const items = [
  {title:'运动记录',process:'1 公里跑步',begin:'开始运动',color:'#faebce',id:'run'},
   {title:'睡眠',process:'舒眠减压 监测睡眠',begin:'手动输入',color:'#fce9ff',id:'sleep'},
    {title:'体重管理',process:'体成分测量 饮食管理',begin:'编辑目标',color:'#c8f6e9',id:'eat'},
     {title:'情绪健康',process:'情绪管理 减压放松',begin:'放松一下',color:'#c8ebf6',id:'mood'},
]
</script>

<template>
    <Header/>
    <IndexPlay/>
    <heathyList />
</template>
<style>
    main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      /* background-color: #fff; */
    }
</style>
