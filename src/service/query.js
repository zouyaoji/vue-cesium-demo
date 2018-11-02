import request from '@/libs/request'

// query = {
//   buildingNo: '', // required
//   unitNo: '',
//   layerNo: ''
// }
export function getLayers (query) {
  return request({
    url: '/building/layers',
    method: 'get',
    params: query
  })
}
export function getHousesOfLayer (query) {
  return request({
    url: '/building/layers/house',
    method: 'get',
    params: query
  })
}

export function getUsersOfHouse (query) {
  return request({
    url: '/order-management/orderlist',
    method: 'get',
    params: query
  })
}

export function getHouseText (query) {
  return request({
    url: '/0easyDSold/api/building/findrooms',
    method: 'get',
    params: query
  })
}
