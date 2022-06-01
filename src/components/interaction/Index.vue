<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:14:41
 * @LastEditTime: 2022-06-01 16:41:43
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\interaction\Index.vue
-->
<template>
  <div class="main-interaction">
    <!-- 图层管理面板 -->
    <div class="layer-manager-wrapper">
      <layer-manager />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@src/store'
import LayerManager from '@src/components/layer-manager/Index.vue'
import { ThemeOptions } from '@src/types/theme'

// state

// computed

const theme = computed<ThemeOptions>(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})
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
  }
}
</style>
