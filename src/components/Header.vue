<script setup lang="ts">
import HelloWorld from './logo.vue'
import Navbar from './naver.vue' 
import Askfor from './Askfor.vue'
import Login from './Updowm.vue'
import Today from './Everyday.vue'
import { useUserStore } from '@/stores/user'
import UserInfo from './UserInfo.vue'
const useStore = useUserStore()
</script>
<template>
    <header>
      <div class="heads">
       <HelloWorld msg="策策健康" />
    <Navbar></Navbar>
        
      </div>
     <div class="hd-right">
       <Today></Today>
    <Login v-if="!useStore.isLogin"/>
    <UserInfo v-else/>
     </div>
    
    </header>
</template>
<style>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0px;
  left: 0;
  z-index: 1000; 
  /* background-color: red; */
  width: 100%;
  background-color: #fff;
  box-shadow: 0 6px 6px -5px rgba(0, 0, 0, 0.45);
}
.hd-right {
  display: flex;
  gap: 20px;
  margin-right: 20px;
}
.heads {
  height: 66px;
  display: flex;
  align-items: center;
}
.navbar a {
  color: #444;
  text-decoration: none;
  font-weight: 500;
}
.head-right {
   display: flex;
   align-items: center;
   /* position: absolute;
   right: 50px; */
}
.navbar a.router-link-active {
  color: #f4c6f1;
}
.searchFor {
  border: solid 2px rgb(246, 203, 246);
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  margin-left: 258px;
}
.login {
  margin-left: 50px;
}
.today {
    margin-left: 38px;
}
.today  li {
  font-size: 12px;
}

</style>