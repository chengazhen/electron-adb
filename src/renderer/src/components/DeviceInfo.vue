<template>
  <el-card v-if="deviceInfo" class="mt-5">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">设备信息</span>
        <div>
          <el-button
            type="primary"
            size="small"
            :disabled="!deviceId"
            @click="goToBatteryDetailsPage"
            >查看电池详细信息</el-button
          >
          <el-button
            type="primary"
            size="small"
            :disabled="!deviceId"
            :loading="loading"
            @click="fetchDeviceInfo"
          >
            刷新
          </el-button>
        </div>
      </div>
    </template>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="制造商">{{ deviceInfo.manufacturer }}</el-descriptions-item>
      <el-descriptions-item label="设备型号">
        {{ deviceInfo.marketingName }} ({{ deviceInfo.model }})
      </el-descriptions-item>
      <el-descriptions-item label="Android 版本">{{
        deviceInfo.androidVersion
      }}</el-descriptions-item>
      <el-descriptions-item label="WiFi">
        {{ wifiStatus }}
      </el-descriptions-item>
      <el-descriptions-item label="储存使用">
        {{ deviceInfo.usedStorage }}B / {{ deviceInfo.totalStorage }}B
      </el-descriptions-item>
      <el-descriptions-item label="内存使用">
        {{ deviceInfo.usedMemoryGB }}GB / {{ deviceInfo.totalMemoryGB }}GB
      </el-descriptions-item>
      <el-descriptions-item label="电池电量"> {{ deviceInfo.batteryLevel }}% </el-descriptions-item>
      <el-descriptions-item label="屏幕尺寸">{{ deviceInfo.screenSize }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router/dist/vue-router'
import type { DeviceInfo } from '../../../preload/index.d'

const props = defineProps<{
  deviceId: string
}>()

type DeviceInfoWithoutBattery = Omit<DeviceInfo, 'batteryInfo'> & {
  batteryLevel: number
}

const deviceInfo = reactive<DeviceInfoWithoutBattery>({
  model: '',
  androidVersion: '',
  serialNumber: '',
  batteryLevel: 0,
  screenResolution: '',
  screenSize: '',
  manufacturer: '',
  totalStorage: '',
  usedStorage: '',
  availableStorage: '',
  marketingName: '',
  totalMemoryGB: '',
  availableMemoryGB: '',
  usedMemoryGB: '',
  isWifiEnabled: false,
  currentWifi: ''
})

const wifiStatus = computed(() => {
  if (deviceInfo.isWifiEnabled) {
    return deviceInfo.currentWifi ? deviceInfo.currentWifi : '未连接'
  }
  return '未开启'
})

const loading = ref(false)
const fetchDeviceInfo = async () => {
  if (!props.deviceId) {
    return
  }
  loading.value = true
  try {
    // 假设我们有一个 API 来获取设备信息
    const info = await window.api.getDeviceInfo(props.deviceId)
    deviceInfo.model = info.model
    deviceInfo.androidVersion = info.androidVersion
    deviceInfo.serialNumber = info.serialNumber
    deviceInfo.batteryLevel = info.batteryInfo.level
    deviceInfo.screenResolution = info.screenResolution
    deviceInfo.screenSize = info.screenSize
    deviceInfo.manufacturer = info.manufacturer
    deviceInfo.totalStorage = info.totalStorage
    deviceInfo.usedStorage = info.usedStorage
    deviceInfo.availableStorage = info.availableStorage
    deviceInfo.marketingName = info.marketingName
    deviceInfo.totalMemoryGB = info.totalMemoryGB
    deviceInfo.availableMemoryGB = info.availableMemoryGB
    deviceInfo.usedMemoryGB = info.usedMemoryGB
    deviceInfo.isWifiEnabled = info.isWifiEnabled
    deviceInfo.currentWifi = info.currentWifi
  } catch (error) {
    console.error('获取设备信息失败', error)
    ElMessage.error('获取设备信息失败')
  } finally {
    loading.value = false
  }
}

watch(() => props.deviceId, fetchDeviceInfo, { immediate: true })

const router = useRouter()
const goToBatteryDetailsPage = () => {
  router.push(`/battery-details/${props.deviceId}`)
}
</script>
