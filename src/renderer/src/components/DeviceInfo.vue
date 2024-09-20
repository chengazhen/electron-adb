<template>
  <el-card v-if="deviceInfo" class="mt-5">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">设备信息</span>
      </div>
    </template>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="设备型号">{{ deviceInfo.model }}</el-descriptions-item>
      <el-descriptions-item label="Android 版本">{{
        deviceInfo.androidVersion
      }}</el-descriptions-item>
      <el-descriptions-item label="序列号">{{ deviceInfo.serialNumber }}</el-descriptions-item>
      <el-descriptions-item label="电池电量">{{ deviceInfo.batteryLevel }}%</el-descriptions-item>
      <el-descriptions-item label="屏幕分辨率">{{
        deviceInfo.screenResolution
      }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  deviceId: string
}>()

interface DeviceInfo {
  model: string
  androidVersion: string
  serialNumber: string
  batteryLevel: number
  screenResolution: string
}

const deviceInfo = ref<DeviceInfo | null>(null)

const fetchDeviceInfo = async () => {
  if (!props.deviceId) {
    deviceInfo.value = null
    return
  }
  try {
    // 假设我们有一个 API 来获取设备信息
    const info = await window.api.getDeviceInfo(props.deviceId)
    deviceInfo.value = info
    console.log(info)
  } catch (error) {
    console.error('获取设备信息失败', error)
    ElMessage.error('获取设备信息失败')
    deviceInfo.value = null
  }
}

watch(() => props.deviceId, fetchDeviceInfo, { immediate: true })
</script>
