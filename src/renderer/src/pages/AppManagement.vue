<template>
  <div class="p-4 flex flex-col h-full">
    <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
      <template #content>
        <span class="text-large text-#409eff font-600 mr-3"> 应用管理 </span>
      </template>
      <template #extra>
        <el-button type="primary" @click="refreshApps">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button type="primary" @click="showInstaller">安装应用</el-button>
      </template>
    </el-page-header>

    <div class="flex-1 overflow-hidden p-4">
      <div v-if="loading" class="text-center py-4"></div>
      <div v-else class="app-list-container h-full">
        <el-scrollbar>
          <div v-for="app in paginatedApps" :key="app.packageName">
            <AppItem
              :is-third-party="app.isThirdParty"
              :package-name="app.packageName"
              :installer="app.installer"
              @uninstall="handleUninstall(app.packageName)"
            />
          </div>
          <div v-if="hasMoreApps" class="text-center py-4">
            <el-button @click="loadMoreApps">加载更多</el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <el-drawer v-model="drawerVisible" title="安装应用" direction="rtl" size="50%">
      <AppInstaller />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElDrawer } from 'element-plus'
import AppItem from '../components/AppItem.vue'
import AppInstaller from '../components/AppInstaller.vue'
import { ElScrollbar, ElPageHeader } from 'element-plus'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useDeviceStore } from '../stores/deviceStore'
import { handleResponse } from '../utils/responseHandler'
import { Refresh } from '@element-plus/icons-vue'
const deviceStore = useDeviceStore()

const installedApps = ref<
  {
    packageName: string
    installer: string
    isThirdParty: boolean
  }[]
>([])
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
      installedApps.value = apps
      console.log(installedApps.value)
      // .filter((item) => item.packageName.includes('wandoujia'))
      currentPage.value = 1
    }
  } catch (error) {
    ElMessage.error('获取应用列表失败')
  } finally {
    loading.value = false
  }
}

const handleUninstall = (packageName: string) => {
  handleResponse(
    window.api.uninstallApp(deviceStore.connectedDevice, packageName),
    '卸载应用成功',
    '卸载应用失败'
  )
}

const loadMoreApps = () => {
  currentPage.value++
}

const refreshApps = () => {
  getInstalledApps()
}

const router = useRouter()
const goBack = () => {
  router.back()
}

const drawerVisible = ref(false)

const showInstaller = () => {
  drawerVisible.value = true
}

onMounted(getInstalledApps)
</script>

<style scoped>
.app-list-container {
  overflow-y: auto;
}
</style>
