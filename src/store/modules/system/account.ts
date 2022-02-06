/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-01 17:56:49
 * @LastEditTime: 2022-02-06 21:38:36
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\system\account.ts
 */
import { Notify, Dialog } from 'quasar'
import * as webStorage from '@src/utils/web-storage'
import router from '@src/router'
import * as api from '@src/api'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login({ dispatch }, data) {
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 整个系统依赖这两个数据进行校验和存储
      const userInfo = (await api.system.login(data)).data
      webStorage.setLocalStorage('token', userInfo.token)
      webStorage.setLocalStorage('uuid', userInfo.id)
      // 设置 vuex 用户信息
      await dispatch(
        'system/user/set',
        {
          ...userInfo
        },
        { root: true }
      )
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout({ commit, dispatch }, { confirm = false } = {}) {
      return new Promise((resolve, reject) => {
        /**
         * @description 注销
         */
        async function logout() {
          // 删除 storage
          webStorage.removeLocalStorage('token')
          webStorage.removeLocalStorage('uuid')
          // 清空 vuex 用户信息
          await dispatch('system/user/set', {}, { root: true })
          // 清空权限信息
          commit('system/permission/clear', true, { root: true })
          // 清空菜单信息
          commit('system/menu/clear', true, { root: true })
          // 跳转路由
          router.push({ name: 'login' })
          resolve(true)
        }
        // 判断是否需要确认
        if (confirm) {
          commit('system/gray/set', true, { root: true })
          Dialog.create({
            title: '注销用户',
            message: '确定要注销当前用户吗？',
            cancel: true
          })
            .onOk(() => {
              commit('system/gray/set', false, { root: true })
              logout()
            })
            .onCancel(() => {
              commit('system/gray/set', false, { root: true })
              Notify.create({
                message: '取消注销操作'
              })
              resolve(false)
            })
        } else {
          logout()
        }
      })
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load({ dispatch }) {
      // 加载用户名
      await dispatch('system/user/load', null, { root: true })
      // 加载主题
      await dispatch('system/theme/load', null, { root: true })
      // 加载页面过渡效果设置
      await dispatch('system/transition/load', null, { root: true })
      // 持久化数据加载侧边栏配置
      await dispatch('system/menu/asideLoad', null, { root: true })
      // 持久化数据加载全局尺寸
      // await dispatch('system/size/load', null, { root: true })
      // 持久化数据加载颜色设置
      // await dispatch('system/color/load', null, { root: true })
    }
  }
}
