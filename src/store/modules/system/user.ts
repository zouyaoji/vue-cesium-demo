/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-02 11:33:15
 * @LastEditTime: 2021-12-14 16:53:18
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\system\user.js
 */
export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {}
  },
  mutations: {
    /**
     * @description 设置用户数据
     * @param {Object} state state
     * @param {Object} info info
     */
    set(state, info) {
      state.info = info
    }
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set({ state, dispatch, commit }, info) {
      // store 赋值
      commit('set', info)
      // 持久化
      await dispatch(
        'system/db/set',
        {
          dbName: 'sys',
          path: 'user.info',
          value: info,
          user: true
        },
        { root: true }
      )
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load({ state, dispatch, commit }) {
      // store 赋值
      const info = await dispatch(
        'system/db/get',
        {
          dbName: 'sys',
          path: 'user.info',
          defaultValue: {},
          user: true
        },
        { root: true }
      )
      commit('set', info)
    }
  }
}
