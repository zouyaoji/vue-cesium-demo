/*
 * @Author: tanghuang-liu 916650458@qq.com
 * @Date: 2022-05-16 09:21:24
 * @LastEditors: zouyaoji
 * @LastEditTime: 2022-05-26 10:39:44
 * @FilePath: \vue-cesium-demo\src\store\system\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Pinia } from 'pinia'
import { useAccountStore } from './account'
import { useDBStore } from './db'
import { useGrayStore } from './gray'
import { useLayoutStore } from './layout'
import { useLogStore } from './log'
import { useMenuStore } from './menu'
import { usePermissionStore } from './permission'
import { useSearchStore } from './search'
import { useThemeStore } from './theme'
import { useTransitionStore } from './transition'
import { useUserStore } from './user'

// 组件内使用不需要传pinia，组件外使用需要传pinia
export const systemStore = {
  useAccountStore: (pinia?: Pinia) => useAccountStore(pinia),
  useDBStore: (pinia?: Pinia) => useDBStore(pinia),
  useGrayStore: (pinia?: Pinia) => useGrayStore(pinia),
  useLayoutStore: (pinia?: Pinia) => useLayoutStore(pinia),
  useLogStore: (pinia?: Pinia) => useLogStore(pinia),
  useMenuStore: (pinia?: Pinia) => useMenuStore(pinia),
  usePermissionStore: (pinia?: Pinia) => usePermissionStore(pinia),
  useSearchStore: (pinia?: Pinia) => useSearchStore(pinia),
  useThemeStore: (pinia?: Pinia) => useThemeStore(pinia),
  useTransitionStore: (pinia?: Pinia) => useTransitionStore(pinia),
  useUserStore: (pinia?: Pinia) => useUserStore(pinia)
}
