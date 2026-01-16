<template>
  <div class="login">
    <h2>登录</h2>

    <input 
    v-model="username" 
    placeholder="请输入用户名"
     />
    <input 
    v-model="password" 
    type="password" 
    placeholder="请输入密码"
    />

    <button @click="Login">登录</button>

    <p class="tip">
      还没有账号？
      <RouterLink to="/register">去注册</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const username = ref("");
const password = ref("");

const Login = async () => {
  if (!username.value || !password.value) {
    alert("请输入完整信息");
    return;
  }
  
  try {
    const res = await axios.post("http://localhost:3000/api/login", {
      username: username.value,
      password: password.value
    });

    if (res.data.code === 200) {
      // 保存 token 和用户信息
      userStore.setToken(res.data.token);
      userStore.setUser(res.data.userId);
      userStore.setUsername(res.data.username);
      
      // await userStore.fetchUserInfo();
      alert(res.data.msg);
      router.push("/");
    } else {
      alert(res.data.msg);
    }
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.msg || "登录失败");
  }
};

</script>



<style scoped>
.login {
  margin: 40px auto;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #fff;
   box-shadow: 0 6px 22px rgba(0,0,0,0.15);
  border-radius: 15px;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

button {
  padding: 10px;
  background: #f0c4f7;
  color: white;
  border: none;
  border-radius: 6px;
}

.tip {
  font-size: 14px;
}
</style>
