import '@/style/index.scss'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'virtual:uno.css'
import { createSSRApp } from 'vue'
import 'wot-design-uni/components/wd-toast/index.js'

import App from './App.vue'
import { prototypeInterceptor, requestInterceptor, routeInterceptor } from './interceptors'
import store from './store'
import QiunDataCharts from './components/QiunDataCharts.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)
  app.use(VueQueryPlugin)

  // 注册全局组件
  app.component('qiun-data-charts', QiunDataCharts)

  return {
    app,
  }
}
