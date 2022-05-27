<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:14:41
 * @LastEditTime: 2022-05-26 09:50:42
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\interaction\Index.vue
-->
<template>
  <div class="main-interaction">
    <!-- 图层管理面板 -->
    <div class="layer-manager-wrapper">
      <div v-if="navMenus.length" class="layer-switch cursor-pointer">
        <q-btn dense round size="10px" style="background: #fff; color: #3f4854" @click="onLayerManagerToggle">
          <q-icon name="layers"></q-icon>
        </q-btn>
      </div>
      <layer-manager />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@src/store'
import LayerManager from '@src/components/layer-manager/Index.vue'
import { layout } from '@src/utils'

// state

// computed
const navMenus = computed(() => {
  const header = store.system.useMenuStore().header
  return header.length ? header[0].children : []
})

const onLayerManagerToggle = () => {
  layout.toggleGlobalLayout({
    layerManager: !store.system.useLayoutStore().global.layerManager
  })
}
</script>
