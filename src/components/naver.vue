<script setup lang="ts">
</script>
<template>
  <nav class="navbar">
    <RouterLink class="nav-item" to="/">首页</RouterLink>
    <RouterLink class="nav-item" to="/about">总结</RouterLink>
    <RouterLink class="nav-item" to="/contact">问ai</RouterLink>
    <RouterLink class="nav-item" to="/chatview">论坛</RouterLink>
  </nav>
</template>

<style scoped>
.nav-item {
  color: rgb(70, 69, 70);
  font-weight: 400;
}

.navbar {
  margin-left: 50px;
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  background: #fff;
}
</style>
