<template>
    <div class="user-information">
        <span>{{ useStore.username}}</span>
        <button @click="handleLogout">退出登录</button>
    </div>
</template>
<style>
    .user-information span {
      font-size: 25px;
      color: rgb(209, 159, 205);
    }
    .user-information button {
        font-size: 12px;
        border-radius:5px;
        border: 1px solid #d2ced1;
        padding: 5px;
    }
    .user-information {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin-left: 25px;
    }
</style>
<script setup lang="ts">
import { useUserStore } from '@/stores/user';
const useStore = useUserStore()
function handleLogout(){
    useStore.logout()
    localStorage.removeItem("token")
}
</script>