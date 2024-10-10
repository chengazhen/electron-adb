<template>
  <el-card>
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">应用安装</span>
      </div>
    </template>
    <el-upload
      class="upload-demo"
      action="#"
      :on-change="handleApkSelect"
      :auto-upload="false"
      :show-file-list="false"
    >
      <el-button type="primary">选择 APK 文件</el-button>
    </el-upload>
    <div v-if="selectedApk" class="mt-3">已选择: {{ selectedApk }}</div>
    <div class="mt-5 w-full">
      <el-button-group class="w-full">
        <el-button
          type="primary"
          @click="installSelectedApp"
          :loading="installing"
          :disabled="!deviceId || !selectedApk"
          class="w-1/2"
        >
          {{ installing ? '安装中...' : '安装应用' }}
        </el-button>
        <el-button type="danger" @click="uninstallApp" :disabled="true" class="w-1/2">
          应用管理
        </el-button>
      </el-button-group>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router/dist/vue-router'
import { useDeviceStore } from '../stores/deviceStore'
const router = useRouter()
const deviceStore = useDeviceStore()


const deviceId = computed(() => deviceStore.connectedDevice)
const selectedApk = ref('')

const handleApkSelect = (file) => {
  selectedApk.value = file.raw.path
  return false // Prevent auto-upload
}

const installing = ref(false)
const installSelectedApp = async () => {
  if (!selectedApk.value) {
    ElMessage.warning('请先选择APK文件')
    return
  }
  if (!deviceId.value) {
    ElMessage.warning('请先选择设备')
    return
  }
  // Check if the selected file is an APK
  if (!selectedApk.value.toLowerCase().endsWith('.apk')) {
    ElMessage.warning('请选择有效的APK文件')
    return
  }
  installing.value = true
  try {
    await window.api.installApp(selectedApk.value, deviceId.value)
    ElMessage.success('应用安装成功')
    selectedApk.value = '' // Reset selected file after installation
  } catch (error) {
    ElMessage.error('应用安装失败')
  }
  installing.value = false
}

const uninstallApp = async () => {
  router.push('/app-management')
  // if (!props.deviceId) {
  //   ElMessage.warning('请先选择设备')
  //   return
  // }
  // try {
  //   await window.api.uninstallApp(props.deviceId)
  //   ElMessage.success('应用卸载成功')
  // } catch (error) {
  //   ElMessage.error('应用卸载失败')
  // }
}
</script>
