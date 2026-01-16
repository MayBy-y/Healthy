<script setup lang="ts">
</script>
<template>
    <div class="login">
    <RouterLink to="/login" class="denglu">登录</RouterLink>
    <RouterLink to="/register"  class="zhuce">注册</RouterLink>
    </div>
</template>
<style>
.login {
    display: flex;
}
.denglu {
    display: block;
    width: 55px;
    height: 36px;
    text-align: center;
    background-color: rgb(246, 203, 246);
    border: 0;
    color: #fff;
    font-size: 19px;
    border-radius: 11px;
}
.zhuce {
    display: block;
    width: 55px;
    height: 36px;
    text-align: center;
    border: 0;
    background-color: #fff;
    color:rgb(246, 203, 246) ;
    font-size: 19px;
     border-radius: 11px;
    transition: all .3s;
    margin-left: 5px;
}
.zhuce:hover {
    background-color: #eeebeb;
}
</style>