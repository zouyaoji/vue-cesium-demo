/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-11-08 15:31:47
 * @LastEditTime: 2022-01-21 14:51:33
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \census-application-haiyan\src\composables\scroll\index.ts
 */

import { ref } from 'vue'

export default function () {
  const scrollAreaRef = ref(null)

  const contentStyle = {
    backgroundColor: 'rgba(0,0,0,0.02)',
    color: '#555'
  }

  const contentActiveStyle = {
    // backgroundColor: '#eee',
    // color: 'black'
    backgroundColor: 'rgba(0,0,0,0.02)',
    color: '#555'
  }

  const thumbStyle = {
    right: '2px',
    borderRadius: '3px',
    backgroundColor: '#EBB107',
    width: '3px',
    opacity: 0.6
  }

  const verticalPositionRef = ref(null)

  // methods
  const onScrollHandler = info => {
    verticalPositionRef.value = info.verticalPosition
  }
  const setScrollPosition = (axis, offset, duration) => {
    scrollAreaRef.value.setScrollPosition('vertical', 0, 300)
  }

  return {
    scrollAreaRef,
    verticalPositionRef,
    contentStyle,
    contentActiveStyle,
    thumbStyle,
    onScrollHandler,
    setScrollPosition
  }
}
