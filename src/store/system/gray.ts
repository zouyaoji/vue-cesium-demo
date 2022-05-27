/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-13 16:29:44
 * @LastEditTime: 2022-05-25 21:40:09
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\system\gray.ts
 */
import { acceptHMRUpdate, defineStore } from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useGrayStore = defineStore('gray', {
  // a function that returns a fresh state
  state: () => ({
    // 灰度
    active: false
  }),
  // optional getters
  getters: {},
  // optional actions
  actions: {
    /**
     * @description 切换灰度状态
     */
    toggle() {
      this.active = !this.active
    },
    /**
     * @description 设置灰度模式
     * @param {Boolean} active active
     */
    set(active) {
      this.active = active
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGrayStore, import.meta.hot))
}
