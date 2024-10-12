import { createRouter, createWebHashHistory } from 'vue-router'
import DeviceManagerAndInstaller from './pages/DeviceManagerAndInstaller.vue'
import UsbDebugGuide from './pages/UsbDebugGuide.vue'

const routes = [
  { path: '/', component: DeviceManagerAndInstaller },
  { path: '/usb-debug-guide', component: UsbDebugGuide }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
