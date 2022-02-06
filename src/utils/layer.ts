/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-17 12:11:09
 * @LastEditTime: 2021-12-14 16:49:13
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\layer.js
 */

import store from '@src/store'

/**
 * 切换图层显示状态
 * @param {string|Aarry<string>} names 图层名
 * @param {boolean} show 是否显示
 */
export function toggleLayerVisible(names, show) {
  store.commit('viewer/layer/toggle', { names, show })
}

/**
 * 加载默认需要显示的图层。
 * @param {*} logined 是否登录
 */
export function loadDefaultLayers(logined) {
  store.dispatch('viewer/layer/loadDefaultLayers', logined)
}
