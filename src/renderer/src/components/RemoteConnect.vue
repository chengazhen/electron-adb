<template>
  <div class="remote-connect">
    <el-form :model="form" label-width="50px" @submit.prevent="handleConnect">
      <el-form-item label="IP">
        <el-input v-model="form.ip" placeholder="请输入设备IP地址" />
      </el-form-item>
      <el-form-item label="端口">
        <el-input v-model="form.port" placeholder="请输入端口号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">连接</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

const emit = defineEmits<{
  (event: 'connect', ip: string, port?: number): void
}>()

const form = ref({
  ip: '',
  port: 5555
})

const handleConnect = () => {
  emit('connect', form.value.ip, form.value.port)
}
</script>

<style scoped></style>
