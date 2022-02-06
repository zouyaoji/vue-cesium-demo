/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-06 09:30:33
 * @LastEditTime: 2021-12-14 16:53:15
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\system\transition.js
 */
// 设置文件
import setting from '@src/config/setting.js'

export default {
  namespaced: true,
  state: {
    // 是否开启页面过度动画
    active: setting.transition.active
  },
  actions: {
    /**
     * @description 设置开启状态
     * @param {Object} context
     * @param {Boolean} active 新的状态
     */
    async set({ state, dispatch }, active) {
      // store 赋值
      state.active = active
      // 持久化
      await dispatch(
        'system/db/set',
        {
          dbName: 'sys',
          path: 'transition.active',
          value: state.active,
          user: true
        },
        { root: true }
      )
    },
    /**
     * 从数据库读取页面过渡动画设置
     * @param {Object} context
     */
    async load({ state, dispatch }) {
      // store 赋值
      state.active = await dispatch(
        'system/db/get',
        {
          dbName: 'sys',
          path: 'transition.active',
          defaultValue: setting.transition.active,
          user: true
        },
        { root: true }
      )
    }
  }
}
