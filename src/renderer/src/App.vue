<!-- src/App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { useDeviceStore } from './stores/deviceStore'

useDeviceStore()
</script>

<style>
#app {
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 如果需要，可以在这里添加任何全局样式 */
</style>
