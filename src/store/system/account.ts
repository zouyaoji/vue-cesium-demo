/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-01 17:56:49
 * @LastEditTime: 2022-05-25 19:42:33
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\system\account.ts
 */
import { Notify, Dialog } from 'quasar'
import * as webStorage from '@src/utils/web-storage'
import router from '@src/router'
import * as api from '@src/api'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useUserStore } from './user'
import { usePermissionStore } from './permission'
import { useMenuStore } from './menu'
import { useGrayStore } from './gray'
import { useThemeStore } from './theme'
import { useTransitionStore } from './transition'
// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useAccountStore = defineStore('account', {
  // a function that returns a fresh state
  state: () => ({}),
  // optional getters
  getters: {},
  // optional actions
  actions: {
    /**
     * 登录
     * @param data
     * @param {Object} payload userName {String} 用户账号
     * @param {Object} payload password {String} 密码
     */
    async login(data) {
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 整个系统依赖这两个数据进行校验和存储
      const userInfo = (await api.system.login(data)).data
      webStorage.setLocalStorage('token', userInfo.token)
      webStorage.setLocalStorage('uuid', userInfo.id)
      const userStore = useUserStore()
      userStore.set({
        ...userInfo
      })
      // 用户登录后从持久化数据加载一系列的设置
      this.load()
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout({ confirm = false } = {}) {
      return new Promise((resolve, reject) => {
        /**
         * @description 注销
         */
        async function logout() {
          // 删除 storage
          webStorage.removeLocalStorage('token')
          webStorage.removeLocalStorage('uuid')
          // 清空 vuex 用户信息
          const userStore = useUserStore()
          userStore.set({})
          // 清空权限信息
          const permissionStore = usePermissionStore()
          permissionStore.clear()
          // 清空菜单信息
          const menuStore = useMenuStore()
          menuStore.clear()
          // 跳转路由
          router.push({ name: 'login' })
          resolve(true)
        }
        // 判断是否需要确认
        if (confirm) {
          const grayStore = useGrayStore()
          grayStore.set(true)
          Dialog.create({
            title: '注销用户',
            message: '确定要注销当前用户吗？',
            cancel: true
          })
            .onOk(() => {
              grayStore.set(false)
              logout()
            })
            .onCancel(() => {
              grayStore.set(false)
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
    async load() {
      // 加载用户名
      const userStore = useUserStore()
      userStore.load()
      // 加载主题
      const themeStore = useThemeStore()
      themeStore.load()
      // 加载页面过渡效果设置
      const transitionStore = useTransitionStore()
      transitionStore.load()
      // 持久化数据加载侧边栏配置
      const menuStore = useMenuStore()
      menuStore.asideLoad()
      // 持久化数据加载全局尺寸
      // await dispatch('system/size/load', null, { root: true })
      // 持久化数据加载颜色设置
      // await dispatch('system/color/load', null, { root: true })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot))
}
