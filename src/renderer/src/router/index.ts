import { createRouter, createWebHashHistory } from 'vue-router/dist/vue-router'
import { useDeviceStore } from '@renderer/stores/deviceStore'
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

const whiteList = ['/usb-debug-guide', '/device-manager']
router.beforeEach((to, _, next) => {
  console.log('to', to)

  if (whiteList.includes(to.path)) {
    next()
    return
  }

  const deviceStore = useDeviceStore()
  if (!deviceStore.connectedDevice) {
    next({ path: '/device-manager', replace: true })
  } else {
    next()
  }
})

export default router
