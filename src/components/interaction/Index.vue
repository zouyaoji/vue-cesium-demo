<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:14:41
 * @LastEditTime: 2022-08-24 22:34:19
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
    <!-- 视频播放面板 -->
    <div class="video-player-wrapper">
      <device-player />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@src/store'
import LayerManager from '@src/components/layer-manager/Index.vue'
import DevicePlayer from '@src/components/device-player/Index.vue'
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
  .layer-manager-wrapper,
  .video-player-wrapper {
    z-index: $z-fab - 20;
    position: relative;
  }
}
</style>
