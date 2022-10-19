<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-06-14 11:08:07
 * @LastEditTime: 2022-09-20 11:08:48
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\recursive-list\Index.vue
-->
<template>
  <div class="page-dynamic-render-recursive-list absolute z-fab">
    <work-bench></work-bench>
  </div>
</template>

<script lang="ts" setup>
import WorkBench from './work-bench/Index.vue'
import { onMounted } from 'vue'
import { store } from '@src/store'

defineOptions({
  name: 'VcDemoDynamicRenderRecursiveList'
})

const { loadDefaultLayers } = store.viewer.useLayerStore()

onMounted(() => {
  loadDefaultLayers(true)
})
</script>
