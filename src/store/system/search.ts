/*
 * @Author: tanghuang-liu 916650458@qq.com
 * @Date: 2022-05-13 17:06:55
 * @LastEditors: zouyaoji
 * @LastEditTime: 2022-05-26 10:22:54
 * @FilePath: \vue-cesium-demo\src\store\system\search.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import setting from '@src/config/setting.js'
import { acceptHMRUpdate, defineStore } from 'pinia'
export const useSearchStore = defineStore('search', {
  state: () => {
    return {
      // 搜索面板激活状态
      active: false,
      // 快捷键
      hotkey: {
        open: setting.hotkey.search.open,
        close: setting.hotkey.search.close
      },
      // 所有可以搜索的页面
      pool: []
    }
  },
  actions: {
    /**
     * @description 切换激活状态
     * @param {Object} state state
     */
    toggle() {
      this.active = !this.active
    },
    /**
     * @description 设置激活模式
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set(active: boolean) {
      this.active = active
    },
    /**
     * @description 初始化
     * @param {Object} state state
     * @param {Array} menu menu
     */
    init(menu) {
      const pool = []
      const push = function (menu, titlePrefix = []) {
        menu.forEach(m => {
          if (m.children) {
            push(m.children, [...titlePrefix, m.title])
          } else {
            pool.push({
              ...m,
              fullTitle: [...titlePrefix, m.title].join(' / ')
            })
          }
        })
      }
      push(menu)
      this.pool = pool
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
