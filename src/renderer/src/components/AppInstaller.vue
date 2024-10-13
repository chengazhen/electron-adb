<template>
  <el-upload
    class="upload-demo"
    action="#"
    :on-change="handleApkSelect"
    :auto-upload="false"
    :show-file-list="false"
    drag
  >
    <el-button type="primary">选择 APK 文件</el-button>
  </el-upload>
  <div v-if="selectedApk" class="mt-3">已选择: {{ selectedApk }}</div>
  <div class="mt-5 w-full">
    <el-button
      type="primary"
      class="w-full"
      :loading="installing"
      :disabled="!deviceId || !selectedApk"
      @click="installSelectedApp"
    >
      {{ installing ? '安装中...' : '安装应用' }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDeviceStore } from '../stores/deviceStore'
import { handleResponse } from '../utils/responseHandler'

const deviceStore = useDeviceStore()

const deviceId = computed(() => deviceStore.connectedDevice)
const selectedApk = ref('')

const handleApkSelect = (file) => {
  console.log('file', file)
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
  const res = await handleResponse(
    window.api.installApp(selectedApk.value, deviceId.value),
    '安装应用成功',
    '应用安装失败'
  )
  if (res) {
    selectedApk.value = '' // Reset selected file after installation
  }

  installing.value = false
}
</script>
