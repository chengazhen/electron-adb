<!-- src/App.vue -->
<template>
  <el-container class="adb-tool h-screen">
    <el-header class="bg-blue-500 text-white leading-[60px]">
      <h1 class="text-2xl font-bold text-center leading-[60px]">ADB 工具</h1>
    </el-header>
    <el-main class="p-5">
      <el-row :gutter="20">
        <el-col :span="12">
          <DeviceManager @device-selected="onDeviceSelected" />
          <DeviceInfo :device-id="selectedDeviceId" />
        </el-col>
        <el-col :span="12">
          <AppInstaller :device-id="selectedDeviceId" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DeviceManager from './components/DeviceManager.vue'
import AppInstaller from './components/AppInstaller.vue'
import DeviceInfo from './components/DeviceInfo.vue'

const selectedDeviceId = ref('')

const onDeviceSelected = (deviceId: string) => {
  selectedDeviceId.value = deviceId
}
</script>

<style scoped>
.adb-tool {
  height: 100vh;
}

.el-header {
  background-color: #409eff;
  color: white;
  line-height: 60px;
}

.el-main {
  padding: 20px;
}
</style>
