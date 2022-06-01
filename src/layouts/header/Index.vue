<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-20 16:15:37
 * @LastEditTime: 2022-06-01 16:34:14
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\Index.vue
-->
<template>
  <div class="main-header" :style="{ opacity: searchActive ? 0.5 : 1 }">
    <div class="left">
      <div class="content">
        <div size="60px" class="logo-img float">
          <img src="https://zouyaoji.top/vue-cesium/favicon.png" />
        </div>
        <div class="title text-h4 float">
          <div>{{ title }}</div>
        </div>
        <div class="nav float">
          <q-tabs>
            <q-route-tab
              v-for="(menu, index) in navMenus"
              :key="index"
              :to="menu.path"
              exact
              :label="$t(menu.title)"
              active-class="menu-active"
            />
          </q-tabs>
        </div>
      </div>
    </div>
    <div class="right q-ml-sm q-mr-sm">
      <div v-if="navMenus.length" class="content">
        <q-btn size="md" flat round color="#fff" @click="onNavigation">
          <q-icon name="fa fa-github"></q-icon>
        </q-btn>
        <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="isDevelopment" -->
        <!-- <header-log v-if="isDevelopment" /> -->
        <header-layer></header-layer>
        <header-log />
        <header-fullscreen />
        <header-theme />
        <header-locale />
        <header-user />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderLog from './log/Index.vue'
import HeaderFullscreen from './fullscreen/Index.vue'
import HeaderTheme from './theme/Index.vue'
import HeaderUser from './user/Index.vue'
import HeaderLocale from './locale/Index.vue'
import HeaderLayer from './layer/Index.vue'
import { openURL } from 'quasar'

import { reactive, ref, computed, onMounted } from 'vue'
import { store } from '@src/store'
import { ThemeOptions } from '@src/types/theme'

const searchActive = ref(false)

const title = computed(() => {
  return import.meta.env.VITE_VUE_APP_TITLE
})

const navMenus = computed(() => {
  const header = store.system.useMenuStore().header
  return header.length ? header[0].children : []
})

const theme = computed<ThemeOptions>(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})

const onNavigation = () => {
  openURL('https://github.com/zouyaoji/vue-cesium-demo')
}
</script>

<style lang="scss" scoped>
.main-header {
  position: relative;
  display: flex;
  width: 100vw;
  height: 100%;
  justify-content: space-between;
  pointer-events: all;
  .left {
    background: v-bind('theme.header.themeHeaderBackgroundColor');
    border-radius: 30px;
    .content {
      // 头部左侧背景颜色
      // background: linear-gradient(180deg, rgba(239, 180, 8, 0) 0%, rgba(235, 177, 7, 0.62) 100%);
      background: v-bind('theme.header.themeHeaderContentBackgroundColor');
      border-radius: 30px;
      padding-right: 30px;
      transition: all 0.2s ease 0.2s;
      height: 100%;
      display: flex;
      .logo-img {
        background: v-bind('theme.header.themeHeaderLogoBackgroundColor');
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        img {
          width: 45px;
          height: 45px;
        }
      }
      .title {
        // 标题文字颜色
        color: v-bind('theme.header.themeHeaderTitleColor');
        font-family: ziticqtezhanti;
        padding: 10px 20px 10px 10px;
        font-style: oblique;
        width: 510px;
      }
      .nav {
        // 菜单文字颜色
        color: v-bind('theme.header.themeHeaderColor');
        padding: 6px 0;
        .q-tab__label {
          font-size: 14px;
        }
      }

      // 菜单选中项文字颜色
      .menu-active {
        color: v-bind('theme.global.themeColorActive');
        :deep(.q-tab__label) {
          font-size: 16px;
        }
      }
    }
  }
  .right {
    background: v-bind('theme.header.themeHeaderBackgroundColor');
    color: v-bind('theme.header.themeHeaderColor');
    position: relative;
    right: 10px;
    z-index: 9;
    border-radius: 30px;
    line-height: 60px;
    .content {
      // background: linear-gradient(180deg, rgba(239, 180, 8, 0) 0%, rgba(235, 177, 7, 0.62) 100%);
      // 头部右侧背景颜色
      background: v-bind('theme.header.themeHeaderContentBackgroundColor');
      border-radius: 30px;
    }
    .q-btn:before {
      box-shadow: none;
    }
  }
}
</style>
