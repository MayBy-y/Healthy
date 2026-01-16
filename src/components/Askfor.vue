<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
<template >
   <div class="searchFor">
    <input type="text" class="search" placeholder="每日一问">
    <button>
  <Icon icon="mdi:magnify" class="icon" style="font-size: 24px;" />
</button>
   </div>
</template>
<style scoped>
   .search {
      display: flex;
      width: 307px;
      height: 29px;
      line-height: 16px;
      background-color: #fff;
      border: 0;
      outline: 0;
   }
   .search::placeholder {
    color: rgb(227, 227, 227);
    font-size: 14px;
   }
   button {
    height: 29px;
    width: 29px;
    border: 0;
    background-color:rgb(246, 203, 246);
   }
   .icon {
     margin-top: 2px;
     padding-right: 3px;
     color: #fff;
   }
</style>