<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-09-06 11:07:31
 * @LastEditTime: 2022-09-06 11:37:50
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\test\on-demand\Index.vue
-->
<template>
  <vc-config-provider :cesium-path="vcConfig.cesiumPath">
    <vc-viewer></vc-viewer>
  </vc-config-provider>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { VcConfigProvider, VcViewer } from 'vue-cesium'

const vcConfig = reactive({
  cesiumPath: 'https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js'
})
</script>
