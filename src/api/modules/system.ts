/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-06 17:58:31
 * @LastEditTime: 2022-07-04 16:55:23
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\api\modules\system.ts
 */
import { find, assign } from 'lodash'
import qs from 'qs'
import faker from 'faker'
import * as webStorage from '@src/utils/web-storage'
import router from '@src/router'

export type Menu = {
  id: string
  component: string
  icon: string
  islock: boolean
  hidden: boolean
  name: string
  path: string
  permission: string
  sort: number
  title: string
  caption?: string
  type: number
  children?: Array<Menu>
}

const users = [
  { username: 'admin', password: 'admin', id: 'admin-uuid', name: 'Admin' },
  { username: 'editor', password: 'editor', id: 'editor-uuid', name: 'Editor' }
]

const menus: Array<Menu> = [
  {
    id: faker.datatype.uuid(),
    component: 'MainLayout',
    icon: 'cog',
    islock: false,
    hidden: false,
    name: 'layout',
    path: '/',
    permission: '',
    sort: 1000,
    title: 'VueCesiumDemo',
    type: 10,
    children: [
      {
        id: faker.datatype.uuid(),
        component: '/index',
        icon: 'cog',
        islock: false,
        hidden: false,
        name: 'index',
        path: '/index',
        permission: 'permission-index',
        sort: 1000,
        caption: '首页',
        title: 'message.header.index',
        type: 10,
        children: [
          {
            id: faker.datatype.uuid(),
            component: '',
            icon: 'eye',
            islock: false,
            hidden: false,
            name: 'left-panel',
            path: '',
            permission: 'permission-left-panel-view',
            sort: 100101,
            title: '查看左侧面板',
            type: 20
          }
        ]
      },
      {
        id: faker.datatype.uuid(),
        component: '/dynamic-overlay',
        icon: 'cog',
        islock: false,
        hidden: false,
        name: 'dynamic-overlay',
        path: '/dynamic-overlay',
        permission: 'permission-dynamic-overlay',
        sort: 1000,
        caption: '示例',
        title: 'message.header.dynamicOverlay',
        type: 10,
        children: [
          {
            id: faker.datatype.uuid(),
            component: '/dynamic-overlay/historical-track',
            icon: 'inbox',
            islock: false,
            hidden: false,
            name: 'historical-track',
            path: '/dynamic-overlay/historical-track',
            permission: 'permission-historical-track',
            sort: 1000,
            caption: 'dynamicOverlay',
            title: 'message.sideBar.dynamicOverlay.historicalTrack',
            type: 10
          }
        ]
      }
    ]
  }
]

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  login(data = {}) {
    if (import.meta.env.VITE_MOCK_ENABLED !== 'true') {
      return request({
        headers: {
          Authorization: 'Basic ---',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: '/auth/login',
        method: 'post',
        data: qs.stringify(data)
      })
    }
    // 模拟数据
    mock.onAny('/auth/login').reply(config => {
      const data = tools.parse(config.data)
      const user = find(users, {
        username: data.username,
        password: data.password
      })
      return user
        ? tools.responseSuccess(assign({}, user, { token: 'f5befe1a-962c-4cdd-bf45-77ce306dbbce' }))
        : tools.responseError({}, '账号或密码不正确')
    })
    // 接口请求
    return requestForMock({
      url: '/auth/login',
      method: 'post',
      data
    })
  },
  /**
   * 获取用户信息
   * @returns 返回用户信息
   */
  getUserInfo() {
    if (import.meta.env.VITE_MOCK_ENABLED !== 'true') {
      return request({
        url: '/user/info',
        method: 'get'
      })
    }
    // 模拟数据
    mock.onAny('/user/info').reply(config => {
      const uuid = webStorage.getLocalStorage('uuid')
      const user = find(users, {
        id: uuid
      })
      if (user) {
        return tools.responseSuccess(assign({}, user))
      } else {
        webStorage.removeLocalStorage('token')
        webStorage.removeLocalStorage('uuid')
        router.push('/login')
        return tools.responseError({}, '未授权, 请登录!')
      }
    })
    // 接口请求
    return requestForMock({
      url: '/user/info',
      method: 'post'
    })
  },
  /**
   * @description 获取有权限的菜单
   * @param {Object} data
   */
  getAccessibleMenus(data = {}) {
    if (import.meta.env.VITE_MOCK_ENABLED !== 'true') {
      return request({
        url: '/api/menu/accessible',
        method: 'post',
        data
      })
    }
    // 模拟数据
    mock.onAny('/api/menu/accessible').reply(config => {
      return tools.responseSuccess(menus)
    })
    // 接口请求
    return requestForMock({
      url: '/api/menu/accessible',
      method: 'post',
      data
    })
  }
})
