/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-02 10:00:08
 * @LastEditTime: 2022-07-21 17:36:11
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\api\index.ts
 */

// import { assign, map } from 'lodash'
import faker from 'faker/locale/zh_CN'
import { service, request, serviceForMock, requestForMock, mock } from './service'
import * as tools from './tools'
import systemApi from './modules/system'
import commonApi from './modules/common'
import dynamicRenderApi from './modules/dynamic-render'

const params = { service, request, serviceForMock, requestForMock, mock, faker, tools }
/**
 * 系统、用户、菜单 api
 */
const system = systemApi(params)
const common = commonApi(params)
const dynamicRender = dynamicRenderApi(params)

export { system, common, dynamicRender }
