<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-20 16:15:37
 * @LastEditTime: 2024-01-26 14:57:11
 * @LastEditors: zouyaoji 370681295@qq.com
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\Index.vue
-->
<template>
  <q-toolbar class="main-header">
    <!-- <q-btn v-if="asideMenus.length" flat round dense icon="menu" class="q-mr-sm" @click="onToggleLeftDrawer" /> -->
    <q-avatar class="cursor-pointer" @click="onToggleLeftDrawer">
      <img src="https://zouyaoji.top/vue-cesium/favicon.png" />
    </q-avatar>

    <q-toolbar-title :shrink="true" style="width: 280px; font-weight: bold; text-align: left">{{
      title
    }}</q-toolbar-title>
    <div class="menu-container">
      <q-tabs
        v-model:model-value="selectedTab"
        align="left"
        indicator-color="cyan-13"
        @update:model-value.once="onUpdateSelectedTab"
      >
        <q-route-tab
          v-for="(menu, index) in headerMenus"
          :key="index"
          :name="menu.name"
          :to="menu.path"
          exact
          :label="$t(menu.title)"
          content-class="menu-tab"
          active-class="menu-active"
        />
      </q-tabs>
    </div>
    <q-space></q-space>
    <div v-if="headerMenus.length" class="right-btn">
      <vc-geocoder></vc-geocoder>
      <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="isDevelopment" -->
      <!-- <header-log v-if="isDevelopment" /> -->
      <header-layer></header-layer>
      <header-log />
      <header-fullscreen />
      <header-theme />
      <header-locale />
      <header-user />
      <q-btn size="md" flat round color="#fff" @click="onNavigation">
        <q-icon name="fa fa-github"></q-icon>
      </q-btn>
    </div>
  </q-toolbar>
</template>
<script setup lang="ts">
import HeaderLog from './log/Index.vue'
import HeaderFullscreen from './fullscreen/Index.vue'
import HeaderTheme from './theme/Index.vue'
import HeaderUser from './user/Index.vue'
import HeaderLocale from './locale/Index.vue'
import HeaderLayer from './layer/Index.vue'
import { openURL } from 'quasar'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { store } from '@src/store'
import { ThemeOptions } from '@src/types/theme'
import { storeToRefs } from 'pinia'
import useTimeout from 'quasar/src/composables/private/use-timeout'
import VcGeocoder from '@src/components/vc-geocoder/Index.vue'

defineOptions({
  name: 'MainHeader'
})

const $route = useRoute()
const searchActive = ref(false)
const selectedTab = ref('')
const { registerTimeout } = useTimeout()
const delay = ref(100)
const menuStore = store.system.useMenuStore()
const layoutStore = store.system.useLayoutStore()
const { global: globalLayout } = storeToRefs(layoutStore)

const title = computed(() => {
  return import.meta.env.VITE_VUE_APP_TITLE
})

const headerMenus = computed(() => {
  const header = menuStore.header
  return header.length ? header[0].children : []
})

const isDevelopment = computed(() => {
  return import.meta.env.MODE === 'development'
})

const asideMenus = computed(() => {
  return menuStore.aside
})

const theme = computed<ThemeOptions>(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})

watch(
  () => $route.matched,
  val => {
    registerTimeout(() => {
      if (val.length > 1) {
        const moduleName = val[1].path.substring(1, val[1].path.length)
        moduleName && (selectedTab.value = moduleName)
      } else {
        selectedTab.value = 'index'
      }
    }, delay.value)
  },
  {
    immediate: true
  }
)

onMounted(() => {
  delay.value = 5
})

const onNavigation = () => {
  openURL('https://github.com/zouyaoji/vue-cesium-demo')
}

const onToggleLeftDrawer = () => {
  layoutStore.toggleGlobalLayout({
    leftDrawerMini: !globalLayout.value.leftDrawerMini
  })
}

const onUpdateSelectedTab = e => {
  if (e === null && $route.matched.length > 1) {
    selectedTab.value = $route.matched[1].path.substring(1, $route.matched[1].path.length)
  } else {
    selectedTab.value = e
  }
}
</script>

<style lang="scss" scoped>
.main-header {
  position: relative;
  display: flex;
  // width: 100vw;
  height: 100%;
  justify-content: space-between;
  pointer-events: all;

  .menu-container {
    // width: 80%;
    // margin: 0 auto;
    // padding-left: 150px;
    height: 50px;
    color: #ddd;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    position: relative;
  }

  .right-btn {
    line-height: 42px;
    height: 42px;
    display: flex;
    align-items: center;

    button {
      margin: 0 5px 0 0;
    }

    .geocoder {
      margin: 0 5px 0 0;
    }

    :v-deep(.vc-geocoder) {
      margin: 0 5px 0 0 !important;
    }
  }
}
</style>
