<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-14 16:36:31
 * @LastEditTime: 2022-05-31 13:58:49
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\MainLayout.vue
-->
<template>
  <q-layout view="lhh Lpr lFf" class="main-layout" :class="{ 'gray-mode': grayActive }">
    <q-page-container class="no-padding">
      <q-page class="interaction-root">
        <!-- vc-viewer -->
        <main-viewer>
          <!-- header -->
          <header v-show="globalLayout.header" elevated reveal class="absolute text-h4 text-center">
            <main-header />
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
import { computed, onMounted } from 'vue'
import { get } from 'lodash'
import MainHeader from '@src/layouts/header/Index.vue'
import MainInteraction from '@src/components/interaction/Index.vue'
import MainViewer from '@src/components/viewer/Index.vue'
import { pinia } from '@src/store'
import { store } from '@src/store'
import { layout } from '@src/utils'
import { storeToRefs } from 'pinia'

// state
const globalLayout = storeToRefs(store.system.useLayoutStore()).global
const { active: grayActive } = storeToRefs(store.system.useGrayStore())

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
</script>
<style lang="scss" scoped>
.main-layout {
  width: 100%;
  overflow: hidden;
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
