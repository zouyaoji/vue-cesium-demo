<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:12:47
 * @LastEditTime: 2022-05-26 14:27:21
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\viewer\Index.vue
-->
<template>
  <vc-config-provider :locale="vclocale">
    <vc-viewer ref="viewerRef" class="main-viewer" @ready="onViewerReady" @cesiumReady="onCesiumReady">
      <vc-navigation :offset="navOffset" :compass-opts="compassOpts" />
      <!-- 栅格数据图层 -->
      <template v-for="(item, index) in layerList" :key="'layer' + index">
        <vc-layer-imagery
          :alpha="item.alpha"
          :brightness="item.brightness"
          :contrast="item.contrast"
          :sort-order="item.sortOrder"
          :show="item.show"
        >
          <component :is="item.component" v-bind="item.props" />
        </vc-layer-imagery>
      </template>
      <!-- 矢量数据图层 -->
      <template v-for="(item, index) in vectorLayers" :key="'vector' + index">
        <component
          :is="item.component"
          v-if="item.component === 'VcTerrainProviderCesium' ? item.props.show : true"
          v-bind="item.props"
        />
      </template>
      <!-- 名称 overlay -->
      <vc-overlay-html
        v-if="mouseOverNameOpts.show"
        :position="mouseOverNameOpts.position"
        :pixel-offset="mouseOverNameOpts.pixelOffset"
      >
        <div class="vc-drawtip vc-tooltip--style">
          {{ mouseOverNameOpts.text }}
        </div>
      </vc-overlay-html>
      <slot />
    </vc-viewer>
  </vc-config-provider>
</template>
<script setup lang="ts">
import useTimeout from 'vue-cesium/es/composables/private/use-timeout'
import { ref, computed, toRaw, reactive } from 'vue'
import { store } from '@src/store'
import { layout } from '@src/utils'
import type { VcReadyObject } from 'vue-cesium/es/utils/types'
import type { VcCompassProps, VcConfigProvider, VcViewerRef } from 'vue-cesium'
import type { VcComponentInternalInstance, VcBtnTooltipProps, VcActionTooltipProps } from 'vue-cesium/lib/utils/types'
import { VcDrawingOpts } from 'vue-cesium/es/utils/drawing-types'
import { useI18n } from 'vue-i18n'
import enUS from 'vue-cesium/es/locale/lang/en-us'
import zhCN from 'vue-cesium/es/locale/lang/zh-hans'
const language = {
  'en-US': enUS,
  'zh-CN': zhCN
}
const { locale } = useI18n()
// emit
const emit = defineEmits(['viewerReady', 'cesiumReady', 'leftClick', 'destroyed'])
const vclocale = computed(() => {
  return language[locale.value]
})
// data
const camera = ref({
  position: {
    lng: 105,
    lat: 31,
    height: 21634101
  }
})

const { registerTimeout } = useTimeout()
const viewerRef = ref<VcViewerRef>(null)
const navOffset: [number, number] = [0, 75]
const compassOpts = ref<VcCompassProps>({
  outerOptions: {
    icon: 'svguse:#vc-icons-compass-outer'
  },
  duration: 5
})

const mouseOverNameOpts = store.viewer.useOverlayStore().mouseOverNameOpts
const selectedRenderData = store.viewer.useRenderStore().selectedRenderData

const measurementFabOptions: any = {
  direction: 'right'
}

// computed
const layerList = computed(() => [
  ...store.viewer.useLayerStore().baseLayers,
  ...store.viewer.useLayerStore().rasterLayers
])
const vectorLayers = computed(() => store.viewer.useLayerStore().vectorLayers)

// methods
const onViewerReady = readyObj => {
  emit('viewerReady', readyObj)

  layout.toggleGlobalLayout({
    header: true
  })
  registerTimeout(() => {
    layout.toggleGlobalLayout({
      content: true
    })
  }, 500)
}

const onCesiumReady = readyObj => {
  emit('cesiumReady', readyObj)
}

const onLeftClick = e => {
  emit('leftClick', e)
}

const onDestroyed = e => {
  emit('destroyed', e)
  // 球销毁了头部和路由都隐藏
  layout.toggleGlobalLayout({
    content: false,
    header: false,
    layerManager: false,
    footer: false,
    featureInfo: false
  })
  // 销毁名称 overlay
  // clearMouseOverlayLabel()
}
</script>
