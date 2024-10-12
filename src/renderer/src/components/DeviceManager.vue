<template>
  <el-card>
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">设备管理</span>
        <el-button type="primary" @click="getDevices">刷新设备列表</el-button>
      </div>
    </template>
    <el-select
      v-model="deviceId"
      placeholder="选择设备"
      class="w-full"
      @change="emitDeviceSelected(deviceId)"
    >
      <el-option v-for="device in devices" :key="device.id" :label="device.id" :value="device.id" />
    </el-select>
    <!-- <div class="mt-5 w-full">
      <el-button-group class="w-full">
        <el-button type="success" @click="connectDevice" :disabled="!deviceId" class="w-1/2"
          >连接设备</el-button
        >
        <el-button type="danger" @click="disconnectDevice" :disabled="!deviceId" class="w-1/2"
          >断开连接</el-button
        >
      </el-button-group>
    </div> -->
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useDeviceStore } from '../stores/deviceStore'
import { handleResponse } from '../utils/responseHandler'

const deviceStore = useDeviceStore()

const devices = ref<{ type: string; id: string }[]>([])
const deviceId = ref('')

const emit = defineEmits(['device-selected'])

const getDevices = async () => {
  const result = await handleResponse(
    window.api.listDevices(),
    '设备列表已更新',
    '获取设备列表失败'
  )
  if (result) {
    devices.value = result
    if (devices.value.length > 0) {
      deviceId.value = devices.value[0].id
      emitDeviceSelected(deviceId.value)
    } else {
      deviceId.value = ''
    }
  }
}

onMounted(getDevices)

function emitDeviceSelected(deviceId: string) {
  emit('device-selected', deviceId)
  deviceStore.setConnectedUsbDevice(deviceId)
}
</script>
