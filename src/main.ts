/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-08 23:26:13
 * @LastEditTime: 2022-05-31 11:48:24
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\main.ts
 */
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { Quasar, Notify, Dialog, LocalStorage } from 'quasar'
import quasarLang from 'quasar/lang/zh-CN'
import VueCesium from 'vue-cesium'
// Import store and router instances
import { pinia } from '@store/index'
import router from '@router/index'
// Import VueCesium css
import 'vue-cesium/dist/index.css'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'

import '@src/assets/style/index.scss'

import messages from '@src/i18n'
import App from './App.vue'
import { getLocalStorage } from './utils/web-storage'

const locale = getLocalStorage('locale')
const i18n = createI18n({
  legacy: false,
  locale: locale as string,
  fallbackLocale: 'zh-CN',
  globalInjection: true,
  messages
})

const app = createApp(App)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    LocalStorage
  }, // import Quasar plugins and add here
  lang: quasarLang
})
app.use(i18n)
app.use(VueCesium)
app.use(pinia)
app.use(router)
app.mount('#app')
