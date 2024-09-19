<!-- src/App.vue -->
<template>
  <div>
    <h1>ADB 工具</h1>
    <div>
      <button @click="getDevices">获取设备列表</button>
    </div>
    <!-- 列表项 -->
    <div>
      <select v-model="deviceId">
        <option v-for="device in devices" :key="device.id" :value="device.id">{{ device.id }}</option>
      </select>
    </div>
    <div>
      <button @click="connectDevice">连接设备</button>
    </div>
    <div>
      <button @click="disconnectDevice">断开连接</button>
    </div>
    <div>
      <button @click="installApp">安装应用</button>
    </div>
    <div>
      <button @click="uninstallApp">卸载应用</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const devices = ref<{
  type: string
  id: string
}[]>([])
const deviceId = ref('')

const getDevices = async () => {
  devices.value = await window.api.listDevices()
}
getDevices()

const connectDevice = () => { }
const disconnectDevice = () => { }
const installApp = () => { }
const uninstallApp = () => { }
</script>