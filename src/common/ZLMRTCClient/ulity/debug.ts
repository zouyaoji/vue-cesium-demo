/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-06 17:52:28
 * @LastEditTime: 2022-08-06 17:52:58
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\common\ZLMRTCClient\ulity\debug.ts
 */
let logger
let errorLogger

export function setLogger() {
  /*eslint-disable */
  logger = console.log
  errorLogger = console.error
  /*eslint-enable */
}

export function isEnable() {
  return logger != null
}

export function log(message, ...optionalParams) {
  if (logger) {
    logger(message, ...optionalParams)
  }
}
export function error(message, ...optionalParams) {
  if (errorLogger) {
    errorLogger(message, ...optionalParams)
  }
}
