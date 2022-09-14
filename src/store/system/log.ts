/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-13 16:42:41
 * @LastEditTime: 2022-09-15 01:05:55
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\system\log.ts
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { get } from 'lodash'
import { webStorage } from '@src/utils'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useLogStore = defineStore('log', {
  // a function that returns a fresh state
  state: () => ({
    // 错误日志
    // + 日志条目的属性
    //   - message 必须 日志信息
    //   - type 非必须 类型 success | warning | info(默认) | danger
    //   - time 必须 日志记录时间
    //   - meta 非必须 其它携带信息
    log: []
  }),
  // optional getters
  getters: {
    /**
     * @description 返回现存 log (all) 的条数
     * @param {*} state vuex state
     */
    length(state) {
      return state.log.length
    },
    /**
     * @description 返回现存 log (error) 的条数
     * @param {*} state vuex state
     */
    lengthError(state) {
      return state.log.filter(log => log.type === 'danger').length
    }
  },
  // optional actions
  actions: {
    /**
     * @description 添加一个日志
     * @param {Object} context
     * @param {String} param message {String} 信息
     * @param {String} param type {String} 类型
     * @param {Object} payload meta {Object} 附带的信息
     */
    push({ message, type = 'info', meta }) {
      this.log.push({
        message,
        type,
        time: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
        meta: {
          // 当前用户信息
          // user: rootState.system.user.info,
          // 当前用户的 uuid
          uuid: webStorage.getLocalStorage('uuid'),
          // 当前的 token
          token: webStorage.getLocalStorage('token'),
          // 当前地址
          url: get(window, 'location.href', ''),
          // 用户设置
          ...meta
        }
      })
    },
    clean() {
      // store 赋值
      this.log = []
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLogStore, import.meta.hot))
}
