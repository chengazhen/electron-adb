<template>
  <div class="device-manager-and-installer">
    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧功能按钮 -->
      <div class="left-buttons">
        <div class="flex flex-col space-y-4">
          <router-link
            to="/"
            exact
            class="bg-white bg-opacity-50 rounded-full py-2 px-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-base font-medium flex items-center"
            active-class="!bg-blue-500 !text-white"
          >
            <el-icon class="mr-1.5">
              <InfoFilled />
            </el-icon>
            设备信息
          </router-link>
          <router-link
            to="/app-management"
            exact
            class="bg-white bg-opacity-50 rounded-full py-2 px-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-base font-medium flex items-center"
            active-class="!bg-blue-500 !text-white"
          >
            <el-icon class="mr-1.5">
              <Management />
            </el-icon>
            应用管理
          </router-link>
          <router-link
            to="/advanced-features"
            exact
            class="bg-white bg-opacity-50 rounded-full py-2 px-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-base font-medium flex items-center"
            active-class="!bg-blue-500 !text-white"
          >
            <el-icon class="mr-1.5">
              <Setting />
            </el-icon>
            高级功能
          </router-link>
        </div>
      </div>

      <!-- 中央展示区 -->
      <div class="center-display invisible">
        <DeviceInfo :device-id="deviceId" />
      </div>

      <!-- 底部信息栏 -->
      <!-- <div class="bottom-info">
        <el-button type="primary">我真牛逼</el-button>
      </div> -->
    </div>

    <el-button class="usb-debug-guide-btn" @click="goToUsbDebugGuide">
      如何开启USB调试模式？
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DeviceInfo from '../components/DeviceInfo.vue'
import { InfoFilled, Management, Setting } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const deviceId = ref('')
const router = useRouter()
const goToUsbDebugGuide = () => {
  router.push('/usb-debug-guide')
}
</script>

<style scoped>
.device-manager-and-installer {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
}

.time {
  color: white;
  font-size: 18px;
}

.main-content {
  flex: 1;
  display: flex;
  position: relative;
}

.left-buttons {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.function-btn {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.center-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.car-image {
  max-width: 80%;
  max-height: 60vh;
  object-fit: contain;
}

.pagination {
  margin-top: 20px;
}

.bottom-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.usb-debug-guide-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
