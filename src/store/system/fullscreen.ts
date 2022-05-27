/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-13 16:28:06
 * @LastEditTime: 2022-05-25 21:40:06
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\system\fullscreen.ts
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import screenfull from 'screenfull'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useFullscreenStore = defineStore('fullscreen', {
  // a function that returns a fresh state
  state: () => ({
    // 全屏激活
    active: false
  }),
  // optional getters
  getters: {
    //
  },
  // optional actions
  actions: {
    /**
     * @description 初始化监听
     */
    listen() {
      const that = this
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          if (!screenfull.isFullscreen) {
            that.active = false
          }
        })
      }
    },
    /**
     * @description 切换全屏
     */
    toggle() {
      if (screenfull.isFullscreen) {
        screenfull.exit()
        this.active = false
      } else {
        screenfull.request()
        this.active = true
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFullscreenStore, import.meta.hot))
}
