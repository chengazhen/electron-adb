<template>
  <el-card class="app-item mb-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <el-avatar :size="50" :src="icon || defaultIcon"></el-avatar>
        <div class="ml-4">
          <h3 class="text-lg font-semibold">{{ appInfo.name || packageName }}</h3>
          <p class="text-sm text-gray-500">{{ packageName }}</p>
          <p class="text-sm text-gray-500">版本: {{ appInfo.version }}</p>
          <p class="text-sm text-gray-500">安装时间: {{ appInfo.firstInstallTime }}</p>
          <p class="text-sm text-gray-500">更新时间: {{ appInfo.lastUpdateTime }}</p>
        </div>
      </div>
      <div>
        <el-button type="danger" size="small" @click="uninstallApp">卸载</el-button>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import defaultIcon from '@renderer/assets/electron.svg'

const props = defineProps<{
  packageName: string
  deviceId: string
}>()

const emit = defineEmits(['uninstall'])

const appInfo = ref<{ name: string, version: string, firstInstallTime: string, lastUpdateTime: string }>({ name: '', version: '', firstInstallTime: '', lastUpdateTime: '' })

async function getAppInfo() {
  try {
    const info = await window.api.getAppInfo(props.deviceId, props.packageName)
    appInfo.value = info
    console.log(appInfo.value)
  } catch (error) {
    ElMessage.error(`获取应用信息失败：${error}`)
  }
}

const icon = ref('')
async function getAppIcon() {
  try {
    const iconBase64 = await window.api.getApkIcon(props.deviceId, props.packageName)
    icon.value = `data:image/png;base64,${iconBase64}`
  } catch (error) {
    ElMessage.error('获取应用图标失败')
  }
}



const uninstallApp = async () => {
  // try {
  //   await window.api.uninstallApp(props.deviceId, props.packageName)
  //   ElMessage.success(`成功卸载应用：${appInfo.value.name || props.packageName}`)
  //   emit('uninstall', props.packageName)
  // } catch (error) {
  //   ElMessage.error(`卸载应用失败：${error}`)
  // }
}

onMounted(getAppInfo)
onMounted(getAppIcon)
</script>
