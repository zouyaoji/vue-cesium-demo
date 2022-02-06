/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-02 10:00:08
 * @LastEditTime: 2021-12-14 16:44:44
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\api\index.js
 */

// import { assign, map } from 'lodash'
import faker from 'faker/locale/zh_CN'
import { service, request, serviceForMock, requestForMock, mock } from './service'
import * as tools from './tools'
import systemApi from './modules/system'

const params = { service, request, serviceForMock, requestForMock, mock, faker, tools }
/**
 * 系统、用户、菜单 api
 */
const system = systemApi(params)

export { system }
