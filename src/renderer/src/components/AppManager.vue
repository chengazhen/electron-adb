<template>
  <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 应用管理 </span>
    </template>
  </el-page-header>

  <el-card>
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">应用管理</span>
        <el-button type="primary" @click="getInstalledApps">刷新应用列表</el-button>
      </div>
    </template>
    <div v-if="loading" class="text-center py-4"></div>
    <div v-else class="app-list-container" style="height: 400px">
      <el-scrollbar>
        <div v-for="app in paginatedApps" :key="app.packageName">
          <AppItem
            :app="app"
            :package-name="app.packageName"
            :device-id="deviceId"
            @uninstall="handleUninstall"
          />
        </div>
        <div v-if="hasMoreApps" class="text-center py-4">
          <el-button @click="loadMoreApps">加载更多</el-button>
        </div>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import AppItem from './AppItem.vue'
import { ElScrollbar, ElPageHeader } from 'element-plus'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const props = defineProps<{
  deviceId: string
}>()

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
  try {
    const apps = await window.api.getInstalledApps(props.deviceId)
    installedApps.value = apps.map((item) => ({ packageName: item }))
    currentPage.value = 1
    ElMessage.success('应用列表已更新')
  } catch (error) {
    ElMessage.error('获取应用列表失败')
  } finally {
    loading.value = false
  }
}

const handleUninstall = (packageName: string) => {
  window.api.uninstallApp(props.deviceId, packageName)
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
