/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-05 11:27:08
 * @LastEditTime: 2022-05-26 13:50:06
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\overlay.ts
 */
import { store, pinia } from '@src/store'

/**
 * 设置并显示鼠标移入对象的名称标签
 */
export function setMouseOverlayLabel(labelOpts) {
  store.viewer.useOverlayStore().setMouseOverlayLabel(labelOpts)
}
/**
 * 移除名称标签
 */
export function clearMouseOverlayLabel() {
  store.viewer.useOverlayStore().setMouseOverlayLabel({
    position: undefined,
    show: false,
    text: undefined,
    pixelOffset: [0, 0]
  })
}
