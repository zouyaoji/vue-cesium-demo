/*
 * @Author: tanghuang-liu 916650458@qq.com
 * @Date: 2022-05-13 16:27:22
 * @LastEditors: zouyaoji
 * @LastEditTime: 2022-05-25 21:56:53
 * @FilePath: \vue-cesium-demo\src\store\system\transition.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import setting from '@src/config/setting.js'
import { useDBStore } from './db'
export const useTransitionStore = defineStore('transition', {
  state: () => {
    return {
      // 是否开启页面过度动画
      active: setting.transition.active
    }
  },
  actions: {
    /**
     * @description 设置开启状态
     * @param {Object} context
     * @param {Boolean} active 新的状态
     */
    async set(active) {
      // store 赋值
      this.active = active
      // 持久化
      const dbStore = useDBStore()
      dbStore.set({
        dbName: 'sys',
        path: 'transition.active',
        value: String(this.active),
        user: true
      })
    },
    /**
     * 从数据库读取页面过渡动画设置
     * @param {Object} context
     */
    async load() {
      // store 赋值
      const dbStore = useDBStore()
      this.active = dbStore.get({
        dbName: 'sys',
        path: 'transition.active',
        defaultValue: String(setting.transition.active),
        user: true
      })
    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTransitionStore, import.meta.hot))
}
