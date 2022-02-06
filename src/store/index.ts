/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-08-26 17:00:10
 * @LastEditTime: 2021-12-20 17:32:33
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\index.ts
 */
// import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import system from './modules/system'
import viewer from './modules/viewer'

const store = createStore({
  modules: {
    system,
    viewer
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  // strict: import.meta.env.MODE === 'development'
  strict: false
})

export default store
