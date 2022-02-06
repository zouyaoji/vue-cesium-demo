import { isBoolean } from 'lodash'

/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-23 16:41:25
 * @LastEditTime: 2022-02-06 21:39:16
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\system\layout.ts
 */
export default {
  namespaced: true,
  state: {
    /**
     * 全局布局参数
     */
    global: {
      header: false,
      content: false,
      footer: false,
      layerManager: false
    },
    /**
     * index 页面布局参数
     */
    index: {
      workBench: false
    }
  },
  mutations: {
    /**
     * 切换全局布局
     * @param {*} state
     * @param {*} layoutOpts
     */
    toggleGlobalLayout(state, layoutOpts) {
      const optsArray = Object.keys(layoutOpts)
      optsArray.forEach(opt => {
        isBoolean(layoutOpts[opt]) && (state.global[opt] = layoutOpts[opt])
      })
    },
    /**
     * 切换 Index 页面布局
     * @param {*} state
     * @param {*} layoutOpts
     */
    toggleIndexPageLayout(state, layoutOpts) {
      const optsArray = Object.keys(layoutOpts)
      optsArray.forEach(opt => {
        isBoolean(layoutOpts[opt]) && (state.index[opt] = layoutOpts[opt])
      })
    }
  }
}
