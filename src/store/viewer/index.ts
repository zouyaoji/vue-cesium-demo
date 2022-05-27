/*
 * @Author: tanghuang-liu 916650458@qq.com
 * @Date: 2022-05-16 09:21:24
 * @LastEditors: zouyaoji
 * @LastEditTime: 2022-05-26 13:49:30
 * @FilePath: \vue-cesium-demo\src\store\viewer\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Pinia } from 'pinia'
import { useLayerStore } from './layer'
import { useOverlayStore } from './overlay'
import { useRenderStore } from './render'

// 组件内使用不需要传pinia，组件外使用需要传pinia
export const viewerStore = {
  useLayerStore: (pinia?: Pinia) => useLayerStore(pinia),
  useOverlayStore: (pinia?: Pinia) => useOverlayStore(pinia),
  useRenderStore: (pinia?: Pinia) => useRenderStore(pinia)
}
