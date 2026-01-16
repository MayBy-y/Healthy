<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import { useUserStore } from './stores/user';
import { onMounted } from 'vue';
import axios from 'axios'
const userStore = useUserStore();

onMounted(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token) userStore.setToken(token);
  if (userId) userStore.setUser(userId);
});

</script>

<template>
   <main>
 <!-- <Header></Header> -->
    <router-view />
   </main>
 
</template>

<style>
 body {
        cursor: url('../public/3.png'), auto;
    }

   main {
  display: flex;
  flex-direction: column;
  justify-content: center;  /* 竖直居中 */
  align-items: center;     
  min-height: 100vh;        /* 关键：确保容器高度为整个视口 */
  width: 100%;

   }
   #app {
     background-color: #f6f4f4 ;
     display: flex;
  flex-direction: column;
  justify-content: center;  /* 竖直居中 */
  align-items: center;     
  min-height: 100vh;  
  width: 100%;
   }
</style>
