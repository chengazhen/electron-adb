<template>
  <el-card class="app-item mb-4">
    <el-skeleton v-if="loading" :rows="2" animated />
    <div v-else class="flex items-center justify-between">
      <div class="flex items-center">
        <el-avatar :size="50" :src="icon || defaultIcon"></el-avatar>
        <div class="ml-4">
          <h3 class="text-lg font-semibold">{{ name || packageName }}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-500">
            <p>包名：{{ packageName }}</p>
            <p>版本: {{ appInfo.version }}</p>
            <p>安装时间: {{ appInfo.firstInstallTime }}</p>
            <p>更新时间: {{ appInfo.lastUpdateTime }}</p>
          </div>
        </div>
      </div>
      <div>
        <el-popconfirm
          title="确定要卸载此应用吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="uninstallApp"
        >
          <template #reference>
            <el-button type="danger" size="small" :loading="uninstallLoading">卸载</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import defaultIcon from '@renderer/assets/electron.svg'
import { useDeviceStore } from '../stores/deviceStore'
import { handleResponse } from '../utils/responseHandler'

const deviceStore = useDeviceStore()

const props = defineProps<{
  packageName: string
}>()

// const emit = defineEmits(['uninstall'])

const appInfo = ref<{
  name: string
  version: string
  firstInstallTime: string
  lastUpdateTime: string
}>({ name: '', version: '', firstInstallTime: '', lastUpdateTime: '' })

async function getAppInfo() {
  if (!deviceStore.connectedDevice) {
    return
  }
  const info = await handleResponse(
    window.api.getAppInfo(deviceStore.connectedDevice, props.packageName),
    '',
    '获取应用信息失败'
  )
  if (info) {
    appInfo.value = info
    console.log(appInfo.value)
  }
}

const icon = ref('')
const name = ref('')
const loading = ref(false)
async function getAppIcon() {
  loading.value = true
  const data = await handleResponse(
    window.api.getApkIcon(deviceStore.connectedDevice, props.packageName),
    '',
    '获取应用图标失败'
  )
  console.log(data)
  if (data) {
    icon.value = `data:image/png;base64,${data.icon}`
    name.value = data.name
  }
  loading.value = false
}

const uninstallLoading = ref(false)
const uninstallApp = async () => {
  uninstallLoading.value = true
  await handleResponse(
    window.api.uninstallApp(deviceStore.connectedDevice, props.packageName),
    '卸载应用成功',
    '卸载应用失败'
  )
  uninstallLoading.value = false
}

onMounted(getAppInfo)
onMounted(getAppIcon)
</script>
