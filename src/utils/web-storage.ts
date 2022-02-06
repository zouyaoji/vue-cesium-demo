/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-02 11:29:14
 * @LastEditTime: 2022-01-10 16:47:59
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\web-storage.ts
 */
import { LocalStorage, SessionStorage } from 'quasar'
const webStoragePrefix = import.meta.env.VITE_VUE_APP_PREFIX

export function setLocalStorage(key = 'default', value = '') {
  LocalStorage.set(`${webStoragePrefix}-${__APP_VERSION__}-${key}`, value)
}

export function getLocalStorage(key = 'default') {
  return LocalStorage.getItem(`${webStoragePrefix}-${__APP_VERSION__}-${key}`)
}

export function getAllLocalStorage() {
  LocalStorage.getAll()
}

export function removeLocalStorage(key = 'default') {
  LocalStorage.remove(`${webStoragePrefix}-${__APP_VERSION__}-${key}`)
}
