/*
 * @Author: tanghuang-liu 916650458@qq.com
 * @Date: 2022-05-13 17:06:55
 * @LastEditors: zouyaoji
 * @LastEditTime: 2022-05-25 21:40:34
 * @FilePath: \vue-cesium-demo\src\store\system\theme.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import setting from '@src/config/setting.js'
let oldThemeName = ''
import { get } from 'lodash'
import { useDBStore } from './db'
export const useThemeStore = defineStore('theme', {
  state: () => {
    return {
      // 主题
      list: get(setting, 'theme.list', []),
      // 现在激活的主题 这应该是一个名字 不是对象
      activeName: get(setting, 'theme.list[0].name', 'h2o')
    }
  },
  getters: {
    /**
     * @description 返回当前的主题信息 不是一个名字 而是当前激活主题的所有数据
     * @param {Object} state state
     */
    activeSetting(state) {
      return state.list.find(theme => theme.name === state.activeName)
    }
  },
  actions: {
    /**
     * @description 将 vuex 中的主题应用到 dom
     * @param {Object} state state
     */
    dom() {
      const oldThemeClass = `theme-${oldThemeName}`
      const themeClass = `theme-${this.activeName}`
      if (document.body.className.includes(oldThemeClass)) {
        document.body.className = document.body.className.replace(oldThemeClass, themeClass)
      } else {
        document.body.className += ' ' + themeClass
      }
    },
    /**
     * @description 激活一个主题
     * @param {String} themeValue 需要激活的主题名称
     */
    async set(themeName) {
      oldThemeName = this.activeName
      // 检查这个主题在主题列表里是否存在
      this.activeName = this.list.find(e => e.name === themeName) ? themeName : this.list[0].name
      // 将 vuex 中的主题应用到 dom
      this.dom()
      // 持久化
      const dbStore = useDBStore()
      dbStore.set({
        dbName: 'sys',
        path: 'theme.activeName',
        value: this.activeName,
        user: true
      })
    },
    /**
     * @description 从持久化数据加载主题设置     * @param {Object} context
     */
    async load() {
      oldThemeName = this.activeName
      // store 赋值
      const dbStore = useDBStore()
      const activeName = dbStore.get({
        dbName: 'sys',
        path: 'theme.activeName',
        defaultValue: this.list[0].name,
        user: true
      })
      // 检查这个主题在主题列表里是否存在
      if (this.list.find(e => e.name === activeName)) {
        this.activeName = activeName
      } else {
        this.activeName = this.list[0].name
        // 持久化
        dbStore.set({
          dbName: 'sys',
          path: 'theme.activeName',
          value: this.activeName,
          user: true
        })
      }
      // 将 vuex 中的主题应用到 dom
      this.dom()
    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot))
}
