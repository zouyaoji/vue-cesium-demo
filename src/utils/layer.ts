/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-17 12:11:09
 * @LastEditTime: 2022-05-26 10:23:51
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\layer.ts
 */

import { store, pinia } from '@src/store'

/**
 * 切换图层显示状态
 * @param {string|Aarry<string>} names 图层名
 * @param {boolean} show 是否显示
 */
export function toggleLayerVisible(names, show) {
  store.viewer.useLayerStore(pinia).toggle({ names, show })
}

/**
 * 加载默认需要显示的图层。
 * @param {*} logined 是否登录
 */
export function loadDefaultLayers(logined?) {
  store.viewer.useLayerStore(pinia).loadDefaultLayers(logined)
}
