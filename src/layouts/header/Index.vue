<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-20 16:15:37
 * @LastEditTime: 2022-01-10 16:53:07
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
        <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="isDevelopment" -->
        <header-log v-if="isDevelopment" />
        <header-fullscreen />
        <header-theme />
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

import { reactive, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const searchActive = ref(false)
const $store = useStore()

const title = computed(() => {
  return import.meta.env.VITE_VUE_APP_TITLE
})

const navMenus = computed(() => {
  return $store.state.system.menu.header.length ? $store.state.system.menu.header[0].children : []
})

const isDevelopment = computed(() => {
  return import.meta.env.MODE === 'development'
})
</script>
