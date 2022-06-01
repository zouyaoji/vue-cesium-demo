<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:14:41
 * @LastEditTime: 2022-06-01 15:30:05
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\interaction\Index.vue
-->
<template>
  <div class="main-interaction">
    <!-- 图层管理面板 -->
    <div class="layer-manager-wrapper">
      <!-- <div v-if="navMenus.length" class="layer-switch cursor-pointer">
        <q-btn dense round size="10px" style="background: #fff; color: #3f4854" @click="onLayerManagerToggle">
          <q-icon name="layers"></q-icon>
        </q-btn>
      </div> -->
      <layer-manager />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@src/store'
import LayerManager from '@src/components/layer-manager/Index.vue'
import { layout } from '@src/utils'
import { ThemeOptions } from '@src/types/theme'

// state

// computed
const navMenus = computed(() => {
  const header = store.system.useMenuStore().header
  return header.length ? header[0].children : []
})

const theme = computed<ThemeOptions>(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})

const onLayerManagerToggle = () => {
  layout.toggleGlobalLayout({
    layerManager: !store.system.useLayoutStore().global.layerManager
  })
}
</script>

<style lang="scss" scoped>
.main-interaction {
  .layer-manager-wrapper {
    z-index: $z-fab - 20;
    position: relative;
    // right: 0;
    // bottom: 0;
    // top: 0;
    // pointer-events: none;
    // left: 5px;

    // & > div {
    //   pointer-events: auto;
    // }

    // 图层切换按钮
    .layer-switch {
      color: v-bind('theme.global.themeColor');
      z-index: $z-fab;
      position: absolute;
      top: 355px;
      right: 42px;
      .q-icon {
        font-size: 3em;
      }
    }
  }
}
</style>
