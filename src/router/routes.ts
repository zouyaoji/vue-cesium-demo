/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-08-26 17:00:10
 * @LastEditTime: 2022-09-06 11:38:55
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\router\routes.ts
 */
/**
 * 在布局内显示
 */
const frameIn = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@src/layouts/MainLayout.vue'),
    redirect: { path: import.meta.env.VITE_VUE_DEFAULT_PATH },
    children: [
      {
        name: 'login',
        path: '/login',
        component: () => import('@src/pages/system/Login.vue')
      }
    ]
  }
]
/**
 * 在布局之外显示
 */
const frameOut = [
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('@src/pages/system/Error404.vue')
  }
]

const test = [
  {
    name: 'test-on-demand',
    path: '/test-on-demand',
    meta: {
      title: 'ttt'
    },
    component: () => import('@src/pages/test/on-demand/Index.vue')
  }
]

export const frameInRoutes = frameIn

export default [...frameIn, ...test, ...frameOut]
