/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-08-26 17:00:10
 * @LastEditTime: 2022-06-14 09:29:46
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\index.ts
 */
import { createPinia } from 'pinia'
import { systemStore } from './system/index'
import { viewerStore } from './viewer/index'

export const pinia = createPinia()

/**
 * 项目全局 store。
 * 组件内使用不需要传 pinia，组件外使用需要传 pinia。
 */
export const store = {
  system: {
    ...systemStore
  },
  viewer: {
    ...viewerStore
  }
}
