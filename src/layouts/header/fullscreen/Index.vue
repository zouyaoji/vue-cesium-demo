<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 15:59:34
 * @LastEditTime: 2022-05-26 10:02:05
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\fullscreen\Index.vue
-->
<template>
  <q-btn :icon="active ? 'fullscreen_exit' : 'fullscreen'" size="md" flat round @click="toggle">
    <q-tooltip> {{ active ? '退出全屏' : '全屏' }} </q-tooltip>
  </q-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@src/store'

const active = computed(() => {
  return store.system.useFullscreenStore().active
})

const toggle = () => {
  store.system.useFullscreenStore().toggle()
}
</script>
