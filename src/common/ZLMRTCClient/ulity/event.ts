/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-06 17:52:28
 * @LastEditTime: 2022-08-06 18:05:57
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\common\ZLMRTCClient\ulity\event.ts
 */
export default class Event {
  listener: any
  type: string
  constructor(type) {
    this.listener = {}
    this.type = type || ''
  }

  on(event, fn) {
    if (!this.listener[event]) {
      this.listener[event] = []
    }
    this.listener[event].push(fn)
    return true
  }

  off(event, fn) {
    if (this.listener[event]) {
      const index = this.listener[event].indexOf(fn)
      if (index > -1) {
        this.listener[event].splice(index, 1)
      }
      return true
    }
    return false
  }

  offAll() {
    this.listener = {}
  }

  dispatch(event, data?) {
    if (this.listener[event]) {
      this.listener[event].map(each => {
        each.apply(null, [data])
      })
      return true
    }
    return false
  }
}
