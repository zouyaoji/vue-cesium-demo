/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-22 10:39:03
 * @LastEditTime: 2022-01-05 11:26:29
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\viewer\overlay.ts
 */
export default {
  namespaced: true,
  state: {
    mouseOverNameOpts: {
      position: [117.186419, 45.66446, 20],
      show: false,
      text: '',
      pixelOffset: [0, 0]
    }
  },
  mutations: {
    /**
     * 设置名称气泡位置和显示状态以及文本内容
     * @param {Object} state
     * @param {Object} param1
     */
    setMouseOverlayLabel(state, { position, show, text, pixelOffset }) {
      state.mouseOverNameOpts.position = position
      state.mouseOverNameOpts.show = show
      state.mouseOverNameOpts.text = text
      state.mouseOverNameOpts.pixelOffset = pixelOffset
    }
  }
}
