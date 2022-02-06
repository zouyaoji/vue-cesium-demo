<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 15:59:34
 * @LastEditTime: 2022-01-04 15:59:37
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
import { useStore } from 'vuex'
const $store = useStore()

const active = computed(() => {
  return $store.state.system.fullscreen.active
})

const toggle = () => {
  $store.dispatch('system/fullscreen/toggle', null, { root: true })
}
</script>
