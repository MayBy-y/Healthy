<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="logo-pic">
    <img class="logo" src="/hello.jpg">
    <h1 class="green">{{ msg }}</h1>
    <!-- <h3>
      You’ve created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3> -->
  </div>
</template>

<style scoped>
.logo-pic {
  display: flex;
  align-items: center;
  height: 66px;
  /* background-color: red; */
}
.logo {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  margin-left: 20px;
}
h1 {
  font-weight: 400;
  font-size: 1.5rem;
  position: relative;
  margin-left: 6px;
  color: #f5e0f4;
}

h3 {
  font-size: 1.2rem;
}

.logo-pic h1  {
  text-align: left;
}
.logo-pic h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
