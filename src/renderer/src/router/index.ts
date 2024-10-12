import { createRouter, createWebHashHistory } from 'vue-router/dist/vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@renderer/pages/DeviceManagerAndInstaller.vue')
  },
  {
    path: '/device-manager',
    name: 'DeviceManager',
    component: () => import('@renderer/pages/PageDeviceManager.vue')
  },
  {
    path: '/battery-details/:deviceId',
    name: 'BatteryDetails',
    component: () => import('@renderer/pages/BatteryDetails.vue'),
    props: true
  },
  {
    path: '/app-management',
    name: 'AppManagement',
    component: () => import('@renderer/pages/AppManagement.vue')
  },
  {
    path: '/usb-debug-guide',
    name: 'UsbDebugGuide',
    component: () => import('@renderer/pages/UsbDebugGuide.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from)
  next()
})

export default router
