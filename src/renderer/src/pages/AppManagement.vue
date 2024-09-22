<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">应用管理</h1>
    <div class="grid grid-cols-1 gap-4">
      <DeviceManager @device-selected="handleDeviceSelected" />
      <AppManager v-if="selectedDevice" :deviceId="selectedDevice" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DeviceManager from '../components/DeviceManager.vue'
import AppManager from '../components/AppManager.vue'

const selectedDevice = ref('')


const handleDeviceSelected = (deviceId: string) => {
  selectedDevice.value = deviceId
}
</script>