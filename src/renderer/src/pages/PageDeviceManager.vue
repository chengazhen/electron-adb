<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 flex items-center">
      <el-icon class="mr-2"><Monitor /></el-icon>
      选择设备
    </h1>
    <el-button
      v-for="device in devices"
      :key="device.id"
      class="device-button w-full mb-2 h-13"
      @click="selectDevice(device.id)"
    >
      {{ device.id }}
    </el-button>
  </div>
  <el-button class="usb-debug-guide-btn" type="info" @click="goToUsbDebugGuide">
    如何开启USB调试模式？
  </el-button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useDeviceStore } from '../stores/deviceStore'
import { handleResponse } from '../utils/responseHandler'
import { useRouter } from 'vue-router'
import { Monitor } from '@element-plus/icons-vue'
const router = useRouter()
const deviceStore = useDeviceStore()

const devices = ref<{ type: string; id: string }[]>([])

const emit = defineEmits(['device-selected'])

const getDevices = async () => {
  const result = await handleResponse(
    window.api.listDevices(),
    '设备列表已更新',
    '获取设备列表失败'
  )
  devices.value = result || []
}

const selectDevice = (deviceId: string) => {
  deviceStore.setConnectedUsbDevice(deviceId)
  emit('device-selected', deviceId)
  router.push(`/`)
}

const goToUsbDebugGuide = () => {
  router.push('/usb-debug-guide')
}

onMounted(getDevices)
</script>

<style scoped>
.usb-debug-guide-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
