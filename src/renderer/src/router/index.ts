import { createRouter, createWebHashHistory } from 'vue-router/dist/vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@renderer/pages/DeviceManagerAndInstaller.vue')
  },
  {
    path: '/battery-details/:deviceId',
    name: 'BatteryDetails',
    component: () => import('@renderer/pages/BatteryDetails.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router