<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <div class="">
        <span class="min-w-[80px]">制造商：</span>
        <h1 class="text-2xl font-bold">{{ deviceInfo.manufacturer }}</h1>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="">
        <span class="min-w-[80px]">设备型号：</span>
        <h1 class="text-2xl font-bold">{{ deviceInfo.marketingName }}</h1>
      </div>
    </el-col>

    <el-col :span="12" class="mt-5">
      <div class="">
        <span class="min-w-[100px]">WiFi：</span>
        <h1 class="text-2xl font-bold">{{ wifiStatus }}</h1>
      </div>
    </el-col>
    <el-col :span="12" class="mt-5">
      <div class="">
        <span class="min-w-[100px]">Android 版本：</span>
        <h1 class="text-2xl font-bold">{{ deviceInfo.androidVersion }}</h1>
      </div>
    </el-col>
    <el-col :span="12" class="mt-5">
      <div class="">
        <span class="min-w-[100px]">电池：</span>
        <h1 class="text-2xl font-bold">{{ deviceInfo.batteryLevel }}%</h1>
      </div>
    </el-col>
    <el-col :span="12" class="mt-5">
      <div class="">
        <span class="min-w-[100px]">屏幕尺寸：</span>
        <h1 class="text-2xl font-bold">{{ deviceInfo.screenSize }}</h1>
      </div>
    </el-col>
    <el-col :span="12" class="mt-5">
      <div class="">
        <span class="min-w-[100px]">内存使用：</span>
        <h1 class="text-2xl font-bold">
          {{ deviceInfo.usedMemoryGB }}GB/{{ deviceInfo.totalMemoryGB }}GB
        </h1>
      </div>
    </el-col>
    <el-col :span="12" class="mt-5">
      <div class="">
        <span class="min-w-[100px]">存储使用：</span>
        <h1 class="text-2xl font-bold">
          {{ deviceInfo.usedStorage }}B/{{ deviceInfo.totalStorage }}B
        </h1>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { DeviceInfo } from '../../../preload/index.d'
import { handleResponse } from '../utils/responseHandler'
import { useDeviceStore } from '../stores/deviceStore'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { GaugeChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'

use([CanvasRenderer, PieChart, GaugeChart, TitleComponent, TooltipComponent, LegendComponent])

const deviceStore = useDeviceStore()

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
  if (!deviceStore.connectedDevice) {
    return
  }
  loading.value = true
  const info = await handleResponse<DeviceInfo>(
    window.api.getDeviceInfo(deviceStore.connectedDevice),
    '设备信息已更新',
    '获取设备信息失败'
  )
  if (info) {
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
  }
  loading.value = false
}

watch(() => deviceStore.connectedDevice, fetchDeviceInfo)

onMounted(() => {
  fetchDeviceInfo()
})

const memoryUsage = computed(() => {
  const usedMemory = parseFloat(deviceInfo.usedMemoryGB)
  const totalMemory = parseFloat(deviceInfo.totalMemoryGB)
  return Number(((usedMemory / totalMemory) * 100).toFixed(2))
})

const storageUsage = computed(() => {
  const usedStorage = parseFloat(deviceInfo.usedStorage)
  const totalStorage = parseFloat(deviceInfo.totalStorage)
  return Number(((usedStorage / totalStorage) * 100).toFixed(2))
})
</script>

<style scoped>
.chart {
  height: 300px;
  width: 100%;
}

.custom-progress :deep(.el-progress__text) {
  color: #ffffff; /* 将文本颜色设置为白色 */
}
</style>
