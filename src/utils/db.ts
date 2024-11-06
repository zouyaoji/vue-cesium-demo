/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-08-27 11:49:24
 * @LastEditTime: 2024-11-06 17:18:53
 * @LastEditors: JohnRay
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\db.ts
 */

import { Low } from 'lowdb'
import type { Adapter } from 'lowdb'
import { LocalStorage } from 'lowdb/browser'
import { getProperty, setProperty } from 'dot-prop'
import * as webStorage from './web-storage'
import { cloneDeep } from 'lodash'

type Schema = {
  sys: object
  database:object
};

const webStoragePrefix = import.meta.env.VITE_VUE_APP_PREFIX
const adapter:LocalStorage<Schema> = new LocalStorage<Schema>(`${webStoragePrefix || 'VueCesiumDemo'}-${__APP_VERSION__}`)
const defaultData:Schema = { sys:{}, database: {} }
const db = new Low(adapter as unknown as Adapter<Schema>,defaultData)

export default db

/**
 * @description 检查路径是否存在 不存在的话初始化
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 路径
 * @param {Object} payload user {Boolean} 区分用户
 * @param {Object} payload validator {Function} 数据校验钩子 返回 true 表示验证通过
 * @param {Object} payload defaultValue {*} 初始化默认值
 * @returns {String} 可以直接使用的路径
 */
export function pathInit({
  dbName = 'database',
  path = '',
  user = true,
  validator = value => true,
  defaultValue = ''
}) {
  const uuid = webStorage.getLocalStorage('uuid') || 'ghost-uuid'
  const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
  const value = getProperty(db.data, currentPath)
  if (!(value !== undefined && validator(value))) {
    setProperty(db.data, currentPath, defaultValue)
    db.write()
  }
  return currentPath
}

/**
 * @description 将数据存储到指定位置 | 路径不存在会自动初始化
 * @description 效果类似于取值 dbName.path = value
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 存储路径
 * @param {Object} payload value {*} 需要存储的值
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function dbSet({ dbName = 'database', path = '', value = '', user = false }) {
  setProperty(db.data,
    pathInit({
      dbName,
      path,
      user
    }),
    value)
  db.write()
}

/**
 * @description 获取数据
 * @description 效果类似于取值 dbName.path || defaultValue
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 存储路径
 * @param {Object} payload defaultValue {*} 取值失败的默认值
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function dbGet({ dbName = 'database', path = '', defaultValue = '', user = false }) {
  return cloneDeep(
    getProperty(db.data,
        pathInit({
          dbName,
          path,
          user,
          defaultValue
        })
    )
  )
}

/**
 * @description 获取存储数据库对象
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function database({
  dbName = 'database',
  path = '',
  user = false,
  validator = () => true,
  defaultValue = ''
} = {}) {
  return getProperty( db.data, pathInit({
      dbName,
      path,
      user,
      validator,
      defaultValue
    })
  )
}
