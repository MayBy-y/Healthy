<template>
  <div class="register">
    <h2>注册</h2>

    <input v-model="username" placeholder="请输入用户名" />
    <div v-if="usernameerror" class="error-box">❌ {{ usernameerror }}</div>
    <input v-model="password" type="password" placeholder="请输入密码" />
    <div v-if="passworderror" class="error-box">❌ {{ passworderror}}</div>
    <button @click="register">注册</button>

    <p class="tip">
      已有账号？
      <RouterLink to="/login">去登录</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"
const router = useRouter();

const username = ref<string>("");
const password = ref<string>("");
const usernameerror = ref("")
const passworderror = ref("")
const check = () => {
  let chexhed = true

  usernameerror.value = ""
  passworderror.value = ""

  if (!username.value) {
    usernameerror.value = "用户名不能为空"
    chexhed = false
  } else if (username.value.length > 6) {
    usernameerror.value = "用户名长度不能超过 6 位"
    chexhed = false
  }
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
  if(!password.value) {
    passworderror.value = "密码不能为空"
    chexhed = false
  } else if(!passwordReg.test(password.value)) {
    passworderror.value = "密码必须包含大写字母、小写字母和数字"
     chexhed = false
  }
   return chexhed
}
const register = async() => {
  if(!check()) return
  try{
const res = await axios.post("http://localhost:3000/api/register", {
    username : username.value,
    password :password.value
  });

   console.log(res.data)
  router.push("/login");
  }catch(error:any){
   alert(error.response?.data?.msg || "注册失败");
  }
};
</script>

<style scoped>
.register {
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
  background: #adbfe9;
  color: white;
  border: none;
  border-radius: 6px;
}

.tip {
  font-size: 14px;
}
.error-box {
  font-size: 12px;
  color: #e74c3c;
  padding: 0 8px;
  border-radius: 6px;
}
</style>
