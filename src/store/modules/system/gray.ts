/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-02 11:23:46
 * @LastEditTime: 2021-12-14 16:52:52
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\system\gray.js
 */
export default {
  namespaced: true,
  state: {
    // 灰度
    active: false
  },
  mutations: {
    /**
     * @description 切换灰度状态
     * @param {Object} state state
     */
    toggle(state) {
      state.active = !state.active
    },
    /**
     * @description 设置灰度模式
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set(state, active) {
      state.active = active
    }
  }
}
