/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-13 16:40:38
 * @LastEditTime: 2022-06-01 16:46:05
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\system\layout.ts
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import { isBoolean } from 'lodash'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useLayoutStore = defineStore('layout', {
  // a function that returns a fresh state
  state: () => ({
    global: {
      header: false,
      content: false,
      footer: false,
      layerManager: false,
      navigation: false,
      featureInfo: false
    },
    /**
     * index 页面布局参数
     */
    index: {
      workBench: false
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
    toggleGlobalLayout(layoutOpts) {
      const optsArray = Object.keys(layoutOpts)
      optsArray.forEach(opt => {
        isBoolean(layoutOpts[opt]) && (this.global[opt] = layoutOpts[opt])
      })
    },
    /**
     * 切换 Index 页面布局
     * @param {*} state
     * @param {*} layoutOpts
     */
    toggleIndexPageLayout(layoutOpts) {
      const optsArray = Object.keys(layoutOpts)
      optsArray.forEach(opt => {
        isBoolean(layoutOpts[opt]) && (this.index[opt] = layoutOpts[opt])
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLayoutStore, import.meta.hot))
}
