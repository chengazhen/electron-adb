<template>
  <div class="p-4 flex flex-col h-full">
    <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
      <template #content>
        <span class="text-large text-#409eff font-600 mr-3"> 终端 </span>
      </template>
    </el-page-header>

    <div class="mt-4 bg-#1e1e1e rounded-lg overflow-hidden flex-1">
      <vue-web-terminal :show-header="false" context="shell" @exec-cmd="onExec" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import VueWebTerminal from 'vue-web-terminal'

const router = useRouter()

const onExec = (
  commandKey: string,
  command: string,
  success: (message: string) => void,
  failed: (message: string) => void,
  name: string
) => {
  success('xxxx')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style>
.vue-web-terminal {
  background-color: #1e1e1e;
  font-family: monospace;
}
</style>
