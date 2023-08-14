<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 15:59:34
 * @LastEditTime: 2023-08-15 00:30:45
 * @LastEditors: zouyaoji 370681295@qq.com
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\fullscreen\Index.vue
-->
<template>
  <q-btn :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" size="md" flat round @click="toggle">
    <q-tooltip> {{ $q.fullscreen.isActive ? '退出全屏' : '全屏' }} </q-tooltip>
  </q-btn>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
watch(
  () => $q.fullscreen.isActive,
  val => {
    console.log(val ? 'In fullscreen now' : 'Exited fullscreen')
  }
)
const toggle = () => {
  $q.fullscreen.toggle()
}
</script>
