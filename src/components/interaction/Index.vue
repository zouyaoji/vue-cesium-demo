<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:14:41
 * @LastEditTime: 2022-09-14 22:11:25
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\interaction\Index.vue
-->
<template>
  <div class="main-interaction">
    <div class="panel-wrapper">
      <!-- 图层管理面板 -->
      <layer-manager />
      <!-- 要素信息面板 -->
      <feature-info-panel />
      <!-- 视频播放面板 -->
      <device-player-panel />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@src/store'
import LayerManager from '@src/components/layer-manager/Index.vue'
import FeatureInfoPanel from '@src/components/feature-info-panel/Index.vue'
import DevicePlayerPanel from '@src/components/device-player-panel/Index.vue'
import { ThemeOptions } from '@src/types/theme'

defineOptions({
  name: 'VcDemoInteraction'
})
// state

// computed

const theme = computed<ThemeOptions>(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})
</script>

<style lang="scss" scoped>
.main-interaction {
  .panel-wrapper {
    z-index: $z-fab + 20;
    position: relative;
  }
}
</style>
