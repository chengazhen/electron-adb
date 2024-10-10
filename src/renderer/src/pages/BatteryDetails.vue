<template>
  <div class="p-4">
    <el-page-header @back="goBack" title="返回" content="电池详情"> </el-page-header>

    <el-card v-if="batteryInfo" class="mt-5">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold">电池详情</span>
          <div>
            <el-button @click="fetchBatteryInfo" :loading="loading" size="small" class="mr-2"
              >刷新</el-button
            >
          </div>
        </div>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="电量">{{ batteryInfo.level }}%</el-descriptions-item>
        <el-descriptions-item label="充电状态">{{ getChargingStatus() }}</el-descriptions-item>
        <el-descriptions-item label="电池健康">{{ getBatteryHealth() }}</el-descriptions-item>
        <el-descriptions-item label="电压">{{ batteryInfo.voltage / 1000 }}V</el-descriptions-item>
        <el-descriptions-item label="温度"
          >{{ (batteryInfo.temperature / 10).toFixed(1) }}°C</el-descriptions-item
        >
        <el-descriptions-item label="技术">{{ batteryInfo.technology }}</el-descriptions-item>
        <el-descriptions-item label="最大充电电流"
          >{{ batteryInfo.maxChargingCurrent / 1000000 }}A</el-descriptions-item
        >
        <el-descriptions-item label="最大充电电压"
          >{{ batteryInfo.maxChargingVoltage / 1000000 }}V</el-descriptions-item
        >
        <!-- <el-descriptions-item label="最大充电次数">{{
          batteryInfo.maxChargingCurrent
        }}</el-descriptions-item>
        <el-descriptions-item label="充电次数">{{
          batteryInfo.chargeCounter
        }}</el-descriptions-item> -->
      </el-descriptions>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router/dist/vue-router'
import { useDeviceStore } from '../stores/deviceStore'

const deviceStore = useDeviceStore()

const props = defineProps<{
  deviceId: string
}>()

interface BatteryInfo {
  level: number
  acPowered: boolean
  usbPowered: boolean
  wirelessPowered: boolean
  maxChargingCurrent: number
  maxChargingVoltage: number
  chargeCounter: number
  status: number
  health: number
  present: boolean
  scale: number
  voltage: number
  temperature: number
  technology: string
}

const batteryInfo = ref<BatteryInfo | null>(null)
const loading = ref(false)

const fetchBatteryInfo = async () => {
  if (!deviceStore.connectedDevice) {
    batteryInfo.value = null
    return
  }
  loading.value = true
  try {
    const deviceInfo = await window.api.getDeviceInfo(deviceStore.connectedDevice)
    batteryInfo.value = deviceInfo.batteryInfo
  } catch (error) {
    console.error('获取电池信息失败', error)
    ElMessage.error('获取电池信息失败')
    batteryInfo.value = null
  } finally {
    loading.value = false
  }
}

const getChargingStatus = () => {
  if (!batteryInfo.value) return '未知'
  if (batteryInfo.value.acPowered) return '交流电充电中'
  if (batteryInfo.value.usbPowered) return 'USB充电中'
  if (batteryInfo.value.wirelessPowered) return '无线充电中'
  return '未充电'
}

const getBatteryHealth = () => {
  if (!batteryInfo.value) return '未知'
  const healthMap: { [key: number]: string } = {
    1: '未知',
    2: '良好',
    3: '过热',
    4: '损坏',
    5: '过压',
    6: '未校准',
    7: '冷却'
  }
  return healthMap[batteryInfo.value.health] || '未知'
}

watch(() => props.deviceId, fetchBatteryInfo, { immediate: true })

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>
