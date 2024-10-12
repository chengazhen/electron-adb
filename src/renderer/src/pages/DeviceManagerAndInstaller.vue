<template>
  <div class="device-manager-and-installer">
    <!-- 主要内容区 -->
    <el-scrollbar>
      <div class="main-content">
        <!-- 左侧功能按钮 -->
        <div class="left-buttons">
          <div class="flex flex-col space-y-4">
            <router-link
              to="/device-manager"
              exact
              class="bg-white bg-opacity-50 rounded-full py-2 px-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-base font-medium flex items-center"
              active-class="!bg-blue-500 !text-white"
            >
              <el-icon class="mr-1.5"><Switch /></el-icon>
              切换设备
            </router-link>
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
        <div class="center-display">
          <DeviceInfo />
        </div>

        <!-- 底部信息栏 -->
        <!-- <div class="bottom-info">
        <el-button type="primary">我真牛逼</el-button>
      </div> -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import DeviceInfo from '../components/DeviceInfo.vue'
import { InfoFilled, Management, Setting, Switch } from '@element-plus/icons-vue'
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
  padding: 20px;
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
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
</style>
