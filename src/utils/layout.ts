/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-29 11:40:10
 * @LastEditTime: 2022-05-26 10:26:11
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\layout.ts
 */

import { store, pinia } from '@src/store'

/**
 * 切换全局布局显示参数
 * @param {*} layoutOpts
 */
export function toggleGlobalLayout(layoutOpts) {
  store.system.useLayoutStore(pinia).toggleGlobalLayout(layoutOpts)
}
/**
 * 切换一张图（onemap）页面布局显示参数
 * @param {*} layoutOpts
 */
export function toggleIndexPageLayout(layoutOpts) {
  store.system.useLayoutStore(pinia).toggleGlobalLayout(layoutOpts)
}
