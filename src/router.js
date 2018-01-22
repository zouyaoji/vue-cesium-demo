import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '@/../lang'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

let routes = [
  { path: '/', component: load('index') }
]

let showcase = {
  path: '/showcase',
  component: load('showcase/layout-showcase'),
  children: [
    {
      path: '',
      component: load('showcase/showcase'),
      meta: {
        title: 'SuperMap Showcase',
        hash: '/showcase',
        icon: 'layers',
        backRoute: '/'
      }
    }
  ]
}

function component (path, config) {
  return {
    path,
    meta: config,
    component: load('showcase/' + path)
  }
}

i18n.messages.zh.categories.forEach(item => {
  if (item.extract) {
    return
  }

  item.children.forEach(subItem => {
    let path = item.path + '/' + subItem.path

    if (!subItem.children) {
      showcase.children.push(component(path, subItem))
    }
  })
})

routes.push(showcase)
routes.push({ path: '*', component: load('common/404/Error404') })

const router = new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes
})

export default router
