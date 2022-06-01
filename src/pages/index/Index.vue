<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-21 11:18:40
 * @LastEditTime: 2022-06-01 16:51:35
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\index\Index.vue
-->
<template>
  <div class="z-top absolute-center page-index"></div>
</template>
<script lang="ts" setup>
import { store } from '@src/store'
import { onMounted } from 'vue'
const { loadDefaultLayers } = store.viewer.useLayerStore()

onMounted(() => {
  loadDefaultLayers(true)
})
</script>
