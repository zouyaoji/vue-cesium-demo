/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-25 14:53:30
 * @LastEditTime: 2022-09-19 23:24:38
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\i18n\index.ts
 */
import zhCN from './zh-CN'
import enUS from './en-US'
import { getLocalStorage } from '@utils/web-storage'
import { createI18n } from 'vue-i18n'

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}
const locale = getLocalStorage('locale') || 'zh-CN'

export const i18n = createI18n({
  legacy: false,
  locale: locale as string,
  fallbackLocale: 'zh-CN',
  globalInjection: true,
  messages
})
