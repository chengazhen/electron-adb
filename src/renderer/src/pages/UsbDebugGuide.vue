<template>
  <div class="usb-debug-guide">
    <el-page-header title="返回" @back="goBack">
      <template #content>
        <span style="color: #409eff">如何开启USB调试模式</span>
      </template>
    </el-page-header>
    <ol class="mt-4" type="1">
      <li>
        打开设备的设置应用
        <el-icon>
          <Setting />
        </el-icon>
      </li>
      <li>
        滚动到底部，点击"关于手机"
        <el-icon>
          <InfoFilled />
        </el-icon>
      </li>
      <li>
        找到"版本号"或"构建号"，连续点击7次
        <el-icon>
          <View />
        </el-icon>
      </li>
      <li>
        返回设置主页面，你会看到新的"开发者选项"
        <el-icon>
          <Tools />
        </el-icon>
      </li>
      <li>
        进入"开发者选项"，找到并启用"USB调试"
        <el-icon>
          <Connection />
        </el-icon>
      </li>
      <li>
        连接设备到电脑，在设备上允许USB调试<strong>(注意不能勾选"仅充电")</strong>
        <el-icon>
          <Link />
        </el-icon>
      </li>
    </ol>
    <p>
      注意：不同设备的具体步骤可能略有不同。如果遇到问题，请查阅您的设备说明书或制造商网站。(推荐去抖音搜索"如何开启USB调试"视频)
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Setting, InfoFilled, View, Tools, Connection, Link } from '@element-plus/icons-vue'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.usb-debug-guide {
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

ol {
  counter-reset: item;
}

li {
  margin-bottom: 15px;
  line-height: 1.5;
  display: flex;
  align-items: center;
}

ol li:before {
  content: counter(item) '. ';
  counter-increment: item;
}

.el-icon {
  margin-left: 10px;
  font-size: 24px;
}

p {
  font-style: italic;
  color: #666;
  margin-top: 20px;
}
</style>
