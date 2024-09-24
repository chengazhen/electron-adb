<template>
  <el-card>
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">应用管理</span>
        <el-button type="primary" @click="getInstalledApps">刷新应用列表</el-button>
      </div>
    </template>
    <div v-if="loading" class="text-center py-4">
      <el-spinner></el-spinner>
    </div>
    <div v-else class="app-list-container" style="height: 400px;">
      <VirtList
        item-key="packageName"
        class="scroller"
        :list="installedApps"
        :minSize="20"
      >
        <template #default="{ itemData }">
          <AppItem
            :app="itemData"
            :packageName="itemData.packageName"
            :deviceId="deviceId"
            @uninstall="handleUninstall"
          />
        </template>
      </VirtList>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AppItem from './AppItem.vue'
import { VirtList } from 'vue-virt-list';

const props = defineProps<{
  deviceId: string
}>()

const installedApps = ref<{ packageName: string }[]>([])
const loading = ref(false)

const getInstalledApps = async () => {
  loading.value = true
  try {
    const apps = await window.api.getInstalledApps(props.deviceId)
    installedApps.value = apps.map(item => ({ packageName: item }))
    console.log(installedApps.value)
    ElMessage.success('应用列表已更新')
  } catch (error) {
    ElMessage.error('获取应用列表失败')
  } finally {
    loading.value = false
  }
}

const handleUninstall = (packageName: string) => {
  installedApps.value = installedApps.value.filter(app => app.packageName !== packageName)
}

onMounted(getInstalledApps)
</script>

<style scoped>
.app-list-container {
  overflow: hidden;
}

.scroller {
  height: 100%;
}
</style>