<template>
  <el-card v-if="deviceInfo" class="mt-5">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">设备信息</span>
        <div>
        <el-button @click="goToBatteryDetailsPage" type="primary" size="small" :disabled="!deviceId">查看电池详细信息</el-button>
        </div>
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
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router/dist/vue-router'

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

const deviceInfo = reactive<DeviceInfo>({
  model: '',
  androidVersion: '',
  serialNumber: '',
  batteryLevel: 0,
  screenResolution: ''
})

const fetchDeviceInfo = async () => {
  if (!props.deviceId) {
    return
  }
  try {
    // 假设我们有一个 API 来获取设备信息
    const info = await window.api.getDeviceInfo(props.deviceId)
    deviceInfo.model = info.model
    deviceInfo.androidVersion = info.androidVersion
    deviceInfo.serialNumber =info.serialNumber
    deviceInfo.batteryLevel = info.batteryInfo.level
    deviceInfo.screenResolution = info.screenResolution

    console.log(info)
  } catch (error) {
    console.error('获取设备信息失败', error)
    ElMessage.error('获取设备信息失败')
  }
}

watch(() => props.deviceId, fetchDeviceInfo, { immediate: true })

const router = useRouter()
const goToBatteryDetailsPage = () => {
  router.push(`/battery-details/${props.deviceId}`)
}
</script>
