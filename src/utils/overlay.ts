/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-05 11:27:08
 * @LastEditTime: 2022-01-05 11:27:09
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\overlay.ts
 */
import store from '@src/store'

/**
 * 设置并显示鼠标移入对象的名称标签
 */
export function setMouseOverlayLabel(labelOpts) {
  store.commit('viewer/overlay/setMouseOverlayLabel', labelOpts)
}
/**
 * 移除名称标签
 */
export function clearMouseOverlayLabel() {
  store.commit('viewer/overlay/setMouseOverlayLabel', {
    position: undefined,
    show: false,
    text: undefined
  })
}
