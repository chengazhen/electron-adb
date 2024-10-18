<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold flex items-center">
        <el-icon class="mr-2">
          <Monitor />
        </el-icon>
        选择设备
      </h1>
      <div class="ml-auto">
        <el-button type="primary" @click="getDevices">
          <el-icon>
            <Refresh />
          </el-icon>
          <span>刷新列表</span>
        </el-button>
        <el-button type="primary" @click="showRemoteConnect">
          <el-icon>
            <Connection />
          </el-icon>
          远程连接
        </el-button>
      </div>
    </div>
    <template v-if="devices.length > 0">
      <el-button
        v-for="device in devices"
        :key="device.id"
        class="device-button w-full mb-2 h-13 !ml-0"
        @click="selectDevice(device.id)"
      >
        {{ device.id }}
      </el-button>
    </template>
    <el-empty v-else description="未检测到设备，请检查是否已连接设备并开启USB调试模式" />
  </div>
  <el-button class="usb-debug-guide-btn" type="info" @click="goToUsbDebugGuide">
    如何开启USB调试模式？
  </el-button>

  <el-drawer v-model="remoteConnectDrawerVisible" title="ADB远程连接" direction="rtl">
    <RemoteConnect @connect="handleRemoteConnect" />
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useDeviceStore } from '../stores/deviceStore'
import { handleResponse } from '../utils/responseHandler'
import { useRouter } from 'vue-router'
import { Monitor, Refresh, Connection } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import RemoteConnect from '../components/RemoteConnect.vue'

const router = useRouter()
const deviceStore = useDeviceStore()

const devices = ref<{ type: string; id: string }[]>([])

const getDevices = async () => {
  const result = await handleResponse(
    window.api.listDevices(),
    '设备列表已更新',
    '获取设备列表失败'
  )
  devices.value = result || []
}

const selectDevice = (deviceId: string) => {
  console.log('selectDevice', deviceId)
  deviceStore.setConnectedUsbDevice(deviceId)
  router.push(`/`)
}

const goToUsbDebugGuide = () => {
  router.push('/usb-debug-guide')
}

const remoteConnectDrawerVisible = ref(false)
const handleRemoteConnect = async (ip: string, port?: number) => {
  try {
    await handleResponse(window.api.connectToRemoteDevice(ip, port))
    ElMessage.success('远程连接成功')
    remoteConnectDrawerVisible.value = false
    await deviceStore.fetchDevices()
  } catch (error) {
    ElMessage.error('远程连接失败')
  }
}

const showRemoteConnect = () => {
  remoteConnectDrawerVisible.value = true
}
onMounted(getDevices)
</script>

<style scoped>
.usb-debug-guide-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
