<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-14 16:36:31
 * @LastEditTime: 2022-07-04 16:40:06
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\MainLayout.vue
-->
<template>
  <q-layout view="hHh Lpr fFf" class="main-layout" :class="{ 'gray-mode': grayActive }">
    <q-drawer
      v-if="asideMenus?.length"
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
      :mini="mini"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in asideMenus" :key="index">
            <q-item v-ripple clickable :active="menuItem.label === 'Outbox'" @click="$router.push(menuItem.path)">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ $t(menuItem.title) || menuItem.caption }}
              </q-item-section>
            </q-item>
            <q-separator v-if="menuItem.separator" :key="'sep' + index" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container class="no-padding">
      <q-page class="interaction-root">
        <!-- vc-viewer -->
        <main-viewer>
          <!-- header -->
          <header v-show="globalLayout.header" elevated reveal class="absolute text-h4 text-center">
            <main-header @logo-clicked="onLogoClicked" />
          </header>
          <!-- overylay-content / router-view -->
          <div v-if="globalLayout.content" class="content">
            <main-interaction />
            <router-view />
          </div>
          <!-- footer -->
        </main-viewer>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { get } from 'lodash'
import MainHeader from '@src/layouts/header/Index.vue'
import MainInteraction from '@src/components/interaction/Index.vue'
import MainViewer from '@src/components/viewer/Index.vue'
import { pinia } from '@src/store'
import { store } from '@src/store'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

const $route = useRoute()
const mini = ref(true)
// state
const globalLayout = storeToRefs(store.system.useLayoutStore()).global
const { active: grayActive } = storeToRefs(store.system.useGrayStore())
const menuStore = store.system.useMenuStore()
const menuList = [
  {
    icon: 'inbox',
    label: 'Inbox',
    separator: true
  },
  {
    icon: 'send',
    label: 'Outbox',
    separator: false
  },
  {
    icon: 'delete',
    label: 'Trash',
    separator: false
  }
]

const drawer = ref(false)

// computed
const headerMenus = computed(() => {
  const header = menuStore.header
  return header.length ? header[0].children : []
})

const asideMenus = computed(() => {
  return menuStore.aside
})

// watch
watch(
  () => $route.matched,
  val => {
    if (val.length > 1) {
      const side = headerMenus.value.filter(menu => menu.path === val[1].path)
      if (side.length) {
        const children = side[0].children.filter(v => v.type === 10)
        if (children.length) {
          menuStore.asideSet(children)
        } else {
          menuStore.asideSet([])
        }
      } else {
        menuStore.asideSet([])
      }
    }
  },
  {
    immediate: true
  }
)

// lifecyle
onMounted(() => {
  // 用户登录后从本地数据库加载一系列的设置
  store.system.useAccountStore().load()
  // 初始化全屏监听
  store.system.useFullscreenStore().listen()
  window.onunhandledrejection = error => {
    store.system.useLogStore(pinia).push({
      message: get(error, 'reason.message', 'Unknown error'),
      type: 'danger',
      meta: {
        error: get(error, 'reason'),
        trace: get(error, 'reason.stack')
      }
    })
  }
  window.onerror = (event, source, lineno, colno, error) => {
    store.system.useLogStore(pinia).push({
      message: get(error, 'message', 'Unknown error'),
      type: 'danger',
      meta: {
        error,
        trace: get(error, 'stack'),
        source: `${source}@${lineno}:${colno}`,
        event: event
      }
    })
  }
})

const onLogoClicked = () => {
  mini.value = !mini.value
}
</script>
<style lang="scss" scoped>
.main-layout {
  width: 100%;
  overflow: hidden;

  ::v-deep(.q-page-container) {
    padding-top: 70px;
  }
  ::v-deep(.q-drawer) {
    height: 350px;
    top: 120px;
    left: 12px;
  }
  &.gray-mode {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }

  header {
    height: 60px;
    line-height: 60px;
    position: absolute;
    z-index: 9;
    top: 10px;
    left: 10px;
    border-radius: 30px;
    pointer-events: none;
  }

  .interaction-root {
    height: 100vh;
    position: relative;
    flex-basis: 100%;
  }
}
</style>
