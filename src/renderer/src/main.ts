import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'virtual:uno.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
