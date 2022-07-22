import { Menu } from '@src/api/modules/system'
import setting from '@src/config/setting.js'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useDBStore } from './db'
export const useMenuStore = defineStore('menu', {
  state: () => {
    return {
      // 顶栏菜单(所有顶部菜单)
      header: [] as Menu[],
      // 侧栏菜单
      aside: [],
      // 侧边栏收缩
      asideCollapse: setting.menu.asideCollapse,
      // 侧边栏折叠动画
      asideTransition: setting.menu.asideTransition,
      moduleHeader: []
    }
  },
  getters: {
    // header: state => {
    //   return state.header
    // }
  },
  actions: {
    /**
     * 设置侧边栏展开或者收缩
     * @param {Boolean} collapse is collapse
     */
    async asideCollapseSet(collapse) {
      // store 赋值
      this.asideCollapse = collapse
      // 持久化
      const dbStore = useDBStore()
      dbStore.set({
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: String(this.asideCollapse),
        user: true
      })
    },
    /**
     * 切换侧边栏展开和收缩
     */
    async asideCollapseToggle() {
      // store 赋值
      this.asideCollapse = !this.asideCollapse
      // 持久化
      const dbStore = useDBStore()
      dbStore.set({
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: String(this.asideCollapse),
        user: true
      })
    },
    /**
     * 设置侧边栏折叠动画
     * @param {Boolean} transition is transition
     */
    async asideTransitionSet(transition) {
      // store 赋值
      this.asideTransition = transition
      // 持久化
      const dbStore = useDBStore()
      dbStore.set({
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: String(this.asideTransition),
        user: true
      })
    },
    /**
     * 切换侧边栏折叠动画
     */
    async asideTransitionToggle() {
      // store 赋值
      this.asideTransition = !this.asideTransition
      // 持久化
      const dbStore = useDBStore()
      dbStore.set({
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: String(this.asideTransition),
        user: true
      })
    },
    /**
     * 持久化数据加载侧边栏设置
     */
    async asideLoad() {
      // store 赋值
      const dbStore = useDBStore()
      const menu = dbStore.get({
        dbName: 'sys',
        path: 'menu',
        defaultValue: String(setting.menu),
        user: true
      })
      // state.asideCollapse = menu.asideCollapse !== undefined ? menu.asideCollapse : setting.menu.asideCollapse
      // state.asideTransition = menu.asideTransition !== undefined ? menu.asideTransition : setting.menu.asideTransition
    },
    /**
     * @description 设置顶栏菜单
     * @param {Array} menu menu setting
     */
    headerSet(menu) {
      // store 赋值
      this.header = menu
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideSet(menu) {
      // store 赋值
      this.aside = menu
    },
    clear() {
      this.header = []
      this.aside = []
    },
    moduleHeaderSet(menu) {
      this.moduleHeader = menu
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
}
