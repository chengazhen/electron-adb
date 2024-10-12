<template>
  <div class="p-4 flex flex-col h-full">
    <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
      <template #content>
        <span class="text-large text-#409eff font-600 mr-3"> 应用管理 </span>
      </template>
    </el-page-header>
    <div class="flex-1 overflow-hidden p-4">
      <div v-if="loading" class="text-center py-4"></div>
      <div v-else class="app-list-container h-full">
        <el-scrollbar>
          <div v-for="app in paginatedApps" :key="app.packageName">
            <AppItem :app="app" :package-name="app.packageName" @uninstall="handleUninstall" />
          </div>
          <div v-if="hasMoreApps" class="text-center py-4">
            <el-button @click="loadMoreApps">加载更多</el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import AppItem from '../components/AppItem.vue'
import { ElScrollbar, ElPageHeader } from 'element-plus'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useDeviceStore } from '../stores/deviceStore'
import { handleResponse } from '../utils/responseHandler'

const deviceStore = useDeviceStore()

const installedApps = ref<{ packageName: string }[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10

const paginatedApps = computed(() => {
  return installedApps.value.slice(0, currentPage.value * pageSize)
})

const hasMoreApps = computed(() => {
  return paginatedApps.value.length < installedApps.value.length
})

const getInstalledApps = async () => {
  loading.value = true
  if (!deviceStore.connectedDevice) {
    return
  }
  try {
    const apps = await handleResponse(window.api.getInstalledApps(deviceStore.connectedDevice))
    if (apps) {
      installedApps.value = apps.map((item) => ({ packageName: item }))
      // .filter((item) => item.packageName.includes('twitter'))
      currentPage.value = 1
    }
  } catch (error) {
    ElMessage.error('获取应用列表失败')
  } finally {
    loading.value = false
  }
}

const handleUninstall = (packageName: string) => {
  if (!deviceStore.connectedDevice) {
    return
  }
  window.api.uninstallApp(deviceStore.connectedDevice, packageName)
}

const loadMoreApps = () => {
  currentPage.value++
}

const router = useRouter()
const goBack = () => {
  router.back()
}

onMounted(getInstalledApps)
</script>

<style scoped>
.app-list-container {
  overflow-y: auto;
}
</style>
