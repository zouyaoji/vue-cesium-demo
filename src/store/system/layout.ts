/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-13 16:40:38
 * @LastEditTime: 2022-08-06 21:59:30
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\system\layout.ts
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import { isBoolean } from 'lodash'
import { isPlainObject } from 'vue-cesium/es/utils/util'

export type GlobalLayoutOpts = {
  header?: boolean
  leftDrawerMini?: boolean
  content?: boolean
  footer?: boolean
  layerManager?: boolean
  navigation?: boolean
  featureInfo?: boolean
  videoPlayer?: boolean
}
// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useLayoutStore = defineStore('layout', {
  // a function that returns a fresh state
  state: () => ({
    global: {
      header: false,
      leftDrawerMini: true,
      content: false,
      footer: false,
      layerManager: false,
      navigation: false,
      featureInfo: false,
      videoPlayer: false
    },
    /**
     * index 页面布局参数
     */
    dynamicRender: {
      datasource: {
        workBench: false
      }
    }
  }),
  // optional getters
  getters: {},
  // optional actions
  actions: {
    /**
     * 切换全局布局
     * @param {*} state
     * @param {*} layoutOpts
     */
    toggleGlobalLayout(layoutOpts: GlobalLayoutOpts) {
      const optsArray = Object.keys(layoutOpts)
      optsArray.forEach(opt => {
        isBoolean(layoutOpts[opt]) && (this.global[opt] = layoutOpts[opt])
      })
    },
    /**
     * 切换 DynamicRender 页面布局
     * @param {*} state
     * @param {*} layoutOpts
     */
    toggleDynamicRenderPageLayout(layoutOpts) {
      const fn = (opts, layout) => {
        const optsArray = Object.keys(opts)
        optsArray.forEach(opt => {
          if (isPlainObject(opts[opt])) {
            fn(opts[opt], layout[opt])
          } else {
            isBoolean(opts[opt]) && (layout[opt] = opts[opt])
          }
        })
      }

      fn(layoutOpts, this.dynamicRender)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLayoutStore, import.meta.hot))
}
