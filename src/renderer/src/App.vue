<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useDeviceStore } from './stores/deviceStore'

useDeviceStore()
</script>

<style>
/* 如果需要，可以在这里添加任何全局样式 */
</style>
