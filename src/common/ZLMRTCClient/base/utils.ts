/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-06 17:52:27
 * @LastEditTime: 2022-08-06 18:02:03
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\common\ZLMRTCClient\base\utils.ts
 */
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line require-jsdoc
export function isFirefox() {
  return window.navigator.userAgent.match('Firefox') !== null
}
// eslint-disable-next-line require-jsdoc
export function isChrome() {
  return window.navigator.userAgent.match('Chrome') !== null
}
// eslint-disable-next-line require-jsdoc
export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
}
// eslint-disable-next-line require-jsdoc
export function isEdge() {
  return window.navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) !== null
}
// eslint-disable-next-line require-jsdoc
export function createUuid() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
