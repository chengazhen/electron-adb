<template>
  <div class="device-manager-and-installer">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1 class="text-2xl font-bold mb-4">设备管理与应用安装</h1>
      </el-col>

      <el-col :span="24">
        <!-- 设备管理器 -->
        <DeviceManager @device-selected="handleDeviceSelected" />
      </el-col>

      <el-col :span="24" class="mt-4">
        <!-- 设备信息 -->
        <DeviceInfo :device-id="selectedDeviceId" />
      </el-col>

      <el-col :span="24" class="mt-4">
        <!-- 应用安装器 -->
        <AppInstaller :device-id="selectedDeviceId" />
      </el-col>
    </el-row>

    <el-button class="usb-debug-guide-btn" @click="goToUsbDebugGuide">
      如何开启USB调试模式？
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DeviceManager from '@renderer/components/DeviceManager.vue'
import DeviceInfo from '@renderer/components/DeviceInfo.vue'
import AppInstaller from '@renderer/components/AppInstaller.vue'

const router = useRouter()
const selectedDeviceId = ref('')

const handleDeviceSelected = (deviceId: string) => {
  selectedDeviceId.value = deviceId
}

const goToUsbDebugGuide = () => {
  router.push('/usb-debug-guide')
}
</script>

<style scoped>
.device-manager-and-installer {
  padding: 20px;
}

.usb-debug-guide-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
