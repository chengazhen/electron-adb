<template>
  <el-scrollbar>
    <div class="p-4">
      <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
        <template #content>
          <span class="text-large text-#409eff font-600 mr-3"> 高级功能 </span>
        </template>
      </el-page-header>
      <el-card class="mb-4 mt-4">
        <template #header>
          <div class="card-header">
            <span>电源选项 </span>
          </div>
        </template>
        <el-button type="primary" :icon="Power" @click="shutdownDevice"> 关机 </el-button>
        <el-button type="warning" :icon="Refresh" :loading="rebootLoading" @click="rebootDevice">
          重启设备
        </el-button>
        <el-popconfirm
          title="确认重启至恢复模式?"
          confirm-button-text="确认"
          cancel-button-text="取消"
          @confirm="rebootToRecovery"
        >
          <template #reference>
            <el-button
              type="danger"
              disabled
              :icon="RefreshRight"
              :loading="rebootToRecoveryLoading"
            >
              重启至恢复模式
            </el-button>
          </template>
        </el-popconfirm>
      </el-card>

      <el-card>
        <template #header>
          <div class="card-header">
            <span>系统日志</span>
          </div>
        </template>
        <el-input
          v-model="systemLogs"
          type="textarea"
          :rows="10"
          readonly
          placeholder="系统日志将显示在这里..."
        />
        <div class="mt-2">
          <el-button type="primary" :loading="logsLoading" @click="fetchSystemLogs">
            获取日志
          </el-button>
          <el-button type="info" @click="clearLogs"> 清除日志 </el-button>
        </div>
      </el-card>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useDeviceStore } from '@renderer/stores/deviceStore'
import { handleResponse } from '@renderer/utils/responseHandler'
import { ElMessage } from 'element-plus'
import { Refresh, RefreshRight, ArrowLeft } from '@element-plus/icons-vue'
import Power from '@renderer/components/SvgIcon/Power.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const deviceStore = useDeviceStore()

const rebootLoading = ref(false)
const logsLoading = ref(false)

const systemLogs = ref('')

const rebootDevice = async () => {
  rebootLoading.value = true
  await handleResponse(
    window.api.rebootDevice(deviceStore.connectedDevice),
    '设备正在重启',
    '重启设备失败'
  )
  rebootLoading.value = false
}

const fetchSystemLogs = async () => {
  if (!deviceStore.connectedDevice) {
    ElMessage.error('没有连接的设备')
    return
  }

  logsLoading.value = true
  const logs = await handleResponse(
    window.api.getSystemLogs(deviceStore.connectedDevice),
    '系统日志已获取',
    '获取系统日志失败'
  )
  if (logs) {
    systemLogs.value = logs
  }
  logsLoading.value = false
}

const clearLogs = () => {
  systemLogs.value = ''
}

const shutdownLoading = ref(false)
const shutdownDevice = async () => {
  shutdownLoading.value = true
  await handleResponse(
    window.api.shutdownDevice(deviceStore.connectedDevice),
    '关机成功',
    '关机失败'
  )
  shutdownLoading.value = false
}

const rebootToRecoveryLoading = ref(false)
const rebootToRecovery = async () => {
  rebootToRecoveryLoading.value = true
  await handleResponse(
    window.api.rebootToRecovery(deviceStore.connectedDevice),
    '重启至恢复模式成功',
    '重启至恢复模式失败'
  )
  rebootToRecoveryLoading.value = false
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
