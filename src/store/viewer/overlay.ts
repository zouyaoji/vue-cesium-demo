/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-25 19:53:45
 * @LastEditTime: 2022-06-01 16:56:36
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\viewer\overlay.ts
 */
import { defineStore, acceptHMRUpdate } from 'pinia'
export const useOverlayStore = defineStore('overlay', {
  // a function that returns a fresh state
  state: () => ({
    mouseOverNameOpts: {
      position: [117.186419, 45.66446, 20],
      show: false,
      text: '',
      pixelOffset: [0, 0]
    }
  }),
  // optional getters
  getters: {},
  // optional actions
  actions: {
    setMouseOverlayLabel({ position, show, text, pixelOffset }) {
      this.mouseOverNameOpts.position = position
      this.mouseOverNameOpts.show = show
      this.mouseOverNameOpts.text = text
      this.mouseOverNameOpts.pixelOffset = pixelOffset
    },
    clearMouseOverlayLabel() {
      this.mouseOverNameOpts.position = undefined
      this.mouseOverNameOpts.show = false
      this.mouseOverNameOpts.text = undefined
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOverlayStore, import.meta.hot))
}
