/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-08-27 13:18:50
 * @LastEditTime: 2022-02-06 21:41:19
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\config\setting.ts
 */
export default {
  // 注册的主题
  theme: {
    list: [
      {
        title: '经典',
        name: 'classic',
        preview: 'images/theme/classic/preview@2x.png'
      },
      {
        title: 'Element',
        name: 'element',
        preview: 'images/theme/element/preview@2x.png'
      }
    ]
  },
  // 侧边栏默认配置
  menu: {
    asideCollapse: false,
    asideTransition: true
  },
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  }
}
