<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-06-01 15:30:50
 * @LastEditTime: 2022-06-01 16:30:45
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\layer\Index.vue
-->
<template>
  <q-btn size="md" flat round color="#fff" icon="layers" @click="onLayerManagerToggle">
    <q-tooltip>图层管理</q-tooltip>
  </q-btn>
</template>

<script lang="ts" setup>
import { store } from '@src/store'
import { layout } from '@src/utils'
import { computed } from 'vue'

const onLayerManagerToggle = () => {
  layout.toggleGlobalLayout({
    layerManager: !store.system.useLayoutStore().global.layerManager
  })
}
</script>
