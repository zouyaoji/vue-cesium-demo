<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-14 16:36:31
 * @LastEditTime: 2022-01-05 17:15:27
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
import { useStore } from 'vuex'
import { get } from 'lodash'
import MainHeader from '@src/layouts/header/Index.vue'
import MainInteraction from '@src/components/interaction/Index.vue'
import MainViewer from '@src/components/viewer/Index.vue'

import { layout } from '@src/utils'

// state
const $store = useStore()
const globalLayout = $store.state.system.layout.global

// computed
const grayActive = computed(() => {
  return $store.state.system.gray.active
})

// lifecyle
onMounted(() => {
  // 用户登录后从本地数据库加载一系列的设置
  $store.dispatch('system/account/load', null, { root: true })
  // 初始化全屏监听
  $store.dispatch('system/fullscreen/listen', null, { root: true })

  window.onunhandledrejection = error => {
    $store.dispatch('system/log/push', {
      message: get(error, 'reason.message', 'Unknown error'),
      type: 'danger',
      meta: {
        error: get(error, 'reason'),
        trace: get(error, 'reason.stack')
      }
    })
  }
  window.onerror = (event, source, lineno, colno, error) => {
    $store.dispatch('system/log/push', {
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
