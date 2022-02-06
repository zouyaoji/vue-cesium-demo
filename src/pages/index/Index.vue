<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-21 11:18:40
 * @LastEditTime: 2022-02-06 22:44:59
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\index\Index.vue
-->
<template>
  <div class="z-top absolute-center page-index"></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { layer } from '@src/utils'

onMounted(() => {
  layer.loadDefaultLayers(true)
})
</script>
