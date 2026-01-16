import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
export const useUserStore = defineStore("user", () => {
    const token = ref<string | null>(localStorage.getItem("token"));
    const userId = ref<string | null>(localStorage.getItem("userId"));
    const username = ref<string | null>(localStorage.getItem("username"));
    const isLogin = ref(!!token.value);
    //保存token
    function setToken(t: string | null) {
        token.value = t;
        isLogin.value = !!t;
        if (t) localStorage.setItem("token", t);
        else localStorage.removeItem("token");
    }
    //保存用户id
    function setUser(id: string | null) {
        userId.value = id;
        if (id) localStorage.setItem("userId", id);
        else localStorage.removeItem("userId");
    }
    //保存用户昵称
    function setUsername(name: string | null) {
        username.value = name;
        if (name) localStorage.setItem("username", name);
        else localStorage.removeItem("username");
    }
    //退出登录状态
    function logout() {
        token.value = null;
        userId.value = null;
        username.value = null;
        isLogin.value = false;

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
    }
    //拉取当前登录用户信息
    async function fetchUserInfo() {
        const res = await axios.get("http://localhost:3000/api/info",
            { headers: { Authorization: `Bearer ${token.value}` } }
        )
        userId.value = res.data.user_id
        username.value = res.data.username
        localStorage.setItem("userId", res.data._id);
        localStorage.setItem("username", res.data.username);
    }
    //删除原用户的星系
    function resetUser() {
        token.value = null;
        userId.value = null;
        username.value = null;
        isLogin.value = false;
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
    }

    return { token, userId, username, isLogin, setToken, setUser, setUsername, logout, fetchUserInfo, resetUser };
});
