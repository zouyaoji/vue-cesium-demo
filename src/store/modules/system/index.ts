/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-08-27 11:36:57
 * @LastEditTime: 2021-12-20 17:43:24
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\system\index.ts
 */
// Vite 支持使用特殊的 import.meta.glob 函数从文件系统导入多个模块：
const files = import.meta.globEager('./*.ts')

const modules = {}
for (const key in files) {
  modules[key.replace(/(\.\/|\.ts)/g, '')] = files[key].default
}
export default {
  namespaced: true,
  modules
}
