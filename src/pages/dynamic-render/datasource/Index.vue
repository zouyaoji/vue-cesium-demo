<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-06-14 11:08:07
 * @LastEditTime: 2022-07-21 18:47:10
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\datasource\Index.vue
-->
<template>
  <div class="page-dynamic-render-datasource absolute z-top">
    <work-bench></work-bench>
  </div>
</template>

<script lang="ts" setup>
import WorkBench from './work-bench/Index.vue'
import { onMounted } from 'vue'
import { store } from '@src/store'

const { loadDefaultLayers } = store.viewer.useLayerStore()

onMounted(() => {
  loadDefaultLayers(true)
})
</script>
