/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-20 17:13:01
 * @LastEditTime: 2021-12-29 17:27:39
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\typings\types.d.ts
 */

interface DatabaseInfo {
  dbName?: string
  path?: string
  user?: boolean
  validator?: () => boolean
  defaultValue?: string
}

export { DatabaseInfo }
