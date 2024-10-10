<template>
  <el-row class="device-manager-and-installer" :gutter="20">
    <el-col :span="24">
      <h1 class="text-2xl font-bold mb-4">设备管理与应用安装</h1>
    </el-col>

    <el-col :span="24">
      <!-- 设备管理器 -->
      <DeviceManager @device-selected="handleDeviceSelected" />
    </el-col>


    <el-col :span="24" class="mt-4">
      <!-- 设备信息 -->
      <DeviceInfo :deviceId="selectedDeviceId" />
    </el-col>

    <el-col :span="24" class="mt-4">
      <!-- 应用安装器 -->
      <AppInstaller :deviceId="selectedDeviceId" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DeviceManager from '@renderer/components/DeviceManager.vue'
import DeviceInfo from '@renderer/components/DeviceInfo.vue'
import AppInstaller from '@renderer/components/AppInstaller.vue'

const selectedDeviceId = ref('')

const handleDeviceSelected = (deviceId: string) => {
  selectedDeviceId.value = deviceId
}
</script>

<style scoped>
.device-manager-and-installer {
  padding: 20px;
}
</style>
