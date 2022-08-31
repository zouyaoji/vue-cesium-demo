/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-06 17:58:31
 * @LastEditTime: 2022-08-31 16:12:48
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\api\modules\system.ts
 */
import { v4 as uuidv4 } from 'uuid'
import { find, assign } from 'lodash'
import qs from 'qs'
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
  permission?: string
  sort: number
  title: string
  caption?: string
  type: number
  redirect?: string
  children?: Array<Menu>
}

const users = [
  { username: 'admin', password: 'admin', id: 'admin-uuid', name: 'Admin' },
  { username: 'editor', password: 'editor', id: 'editor-uuid', name: 'Editor' }
]

const menus: Array<Menu> = [
  {
    id: uuidv4(),
    component: 'MainLayout',
    icon: 'cog',
    islock: false,
    hidden: false,
    name: 'layout',
    path: '/',
    sort: 1000,
    title: 'VueCesiumDemo',
    type: 10,
    children: [
      {
        id: uuidv4(),
        component: '/index',
        icon: 'cog',
        islock: false,
        hidden: false,
        name: 'index',
        path: '/index',
        sort: 1000,
        caption: '首页',
        title: 'message.header.index',
        type: 10,
        children: [
          {
            id: uuidv4(),
            component: '',
            icon: 'eye',
            islock: false,
            hidden: false,
            name: 'left-panel',
            path: '',
            sort: 100101,
            title: '查看左侧面板',
            type: 20
          }
        ]
      },
      {
        id: uuidv4(),
        component: '/dynamic-render',
        icon: 'cog',
        islock: false,
        hidden: false,
        name: 'dynamic-render',
        path: '/dynamic-render',
        sort: 1000,
        caption: '动态渲染',
        title: 'message.header.dynamicRender',
        type: 10,
        redirect: '/dynamic-render/datasource',
        children: [
          {
            id: uuidv4(),
            component: '/dynamic-render/datasource',
            icon: 'storage',
            islock: false,
            hidden: false,
            name: 'datasource',
            path: '/dynamic-render/datasource',
            sort: 1000,
            caption: 'dynamicRender',
            title: 'message.sideBar.dynamicRender.datasource',
            type: 10
          },
          {
            id: uuidv4(),
            component: '/dynamic-render/historical-track',
            icon: 'route',
            islock: false,
            hidden: false,
            name: 'historical-track',
            path: '/dynamic-render/historical-track',
            sort: 1000,
            caption: 'dynamicRender',
            title: 'message.sideBar.dynamicRender.historicalTrack',
            type: 10
          }
        ]
      },
      {
        id: uuidv4(),
        component: '/expansion',
        icon: 'cog',
        islock: false,
        hidden: false,
        name: 'expansion',
        path: '/expansion',
        sort: 1000,
        caption: '扩展组件',
        title: 'message.header.expansion',
        type: 10,
        redirect: '/expansion/typhoon',
        children: [
          {
            id: uuidv4(),
            component: '/expansion/typhoon',
            icon: 'timeline',
            islock: false,
            hidden: false,
            name: 'typhoon',
            path: '/expansion/typhoon',
            sort: 1000,
            caption: '台风组件',
            title: 'message.sideBar.expansion.typhoon',
            type: 10
          }
        ]
      },
      {
        id: uuidv4(),
        component: '/other',
        icon: 'cog',
        islock: false,
        hidden: false,
        name: 'other',
        path: '/other',
        sort: 1000,
        caption: '其他测试',
        title: 'message.header.other',
        type: 10,
        redirect: '/other/tsx',
        children: [
          {
            id: uuidv4(),
            component: '/other/tsx',
            icon: 'bug_report',
            islock: false,
            hidden: false,
            name: 'tsx',
            path: '/other/tsx',
            sort: 1000,
            caption: 'TSX 渲染',
            title: 'message.sideBar.other.tsx',
            type: 10
          }
        ]
      }
    ]
  }
]

export default ({ service, request, serviceForMock, requestForMock, mock, tools }) => ({
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
