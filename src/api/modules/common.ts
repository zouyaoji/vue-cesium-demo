/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-07-04 16:59:07
 * @LastEditTime: 2022-07-21 21:39:37
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\api\modules\common.ts
 */
import qs from 'qs'
const baseURL = import.meta.env.MODE === 'development' ? '/' : import.meta.env.VITE_VUE_APP_API
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * 获取静态资源（JSON）等
   * @param {*} fetchStr
   * @returns
   */
  getStaticData(fetchStr, baseURL?) {
    baseURL = baseURL || import.meta.env.BASE_URL
    const res = request({
      baseURL,
      url: fetchStr,
      method: 'get'
    })
    return res.then(data => {
      return {
        code: 0,
        data: data,
        msg: 'success'
      }
    })
  },
  /**
   * 百度 api 解析地址
   * @param query
   * @returns
   */
  inverseGeocode(query) {
    return request({
      baseURL: import.meta.env.BASE_URL,
      url: '/reverse_geocoding/v3',
      method: 'get',
      params: query
    })
  },
  getLocationList(query) {
    return request({
      baseURL: import.meta.env.BASE_URL,
      url: '/v3/place/text',
      method: 'get',
      params: query
    })
  }
})
