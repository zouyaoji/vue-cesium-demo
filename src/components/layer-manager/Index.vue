<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:19:31
 * @LastEditTime: 2022-05-26 21:02:05
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\layer-manager\Index.vue
-->
<template>
  <div class="layer-manager" :class="indexLayout.workBench ? '' : 'full-srceen'">
    <drag-wrapper ref="dragWrapperRef">
      <common-panel
        v-show="globalLayout.layerManager"
        class="layer-manager-panel"
        :title="$t('message.panel.layerManager')"
        title-class="drag-handle"
        @close="onLayerManagerToggle"
      >
        <q-card-section class="q-pt-sm">
          <div class="text-subtitle2">{{ $t('message.baseLayer') }}</div>
          <div class="q-gutter-sm">
            <q-radio
              v-for="(item, index) of layerList.baseLayers"
              :key="index"
              v-model="defaultbaseLayer"
              :val="item.name"
              :label="item.text"
              @update:model-value="baseLayerSwitch"
            />
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="q-pt-sm">
          <div class="text-subtitle2">{{ $t('message.rasterLayer') }}</div>
          <div class="q-gutter-sm">
            <q-checkbox
              v-for="(item, index) of layerList.rasterLayers"
              :key="index"
              v-model="item.show"
              :val="item.name"
              :label="item.text"
              @update:model-value="overlayLayerSwitch(item, $event)"
            />
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="q-pt-sm">
          <div class="text-subtitle2">{{ $t('message.vectorLayer') }}</div>
          <div class="q-gutter-sm">
            <q-checkbox
              v-for="(item, index) of layerList.vectorLayers"
              :key="index"
              v-model="item.props.show"
              :val="item.name"
              :label="item.text"
              @update:model-value="overlayLayerSwitch(item, $event)"
            />
          </div>
        </q-card-section>
      </common-panel>
    </drag-wrapper>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue'
import { store } from '@src/store'
import CommonPanel from '@components/common-panel/Index.vue'
import DragWrapper from '@components/drag-wrapper'
import { layer, layout } from '@src/utils'
import { storeToRefs } from 'pinia'

// state
const dragWrapperRef = ref<typeof DragWrapper | null>(null)

const layoutStore = store.system.useLayoutStore()
const { global: globalLayout, index: indexLayout } = storeToRefs(layoutStore)
const { rasterLayers, baseLayers, vectorLayers } = store.viewer.useLayerStore()

// watch
watch(
  indexLayout,
  val => {
    nextTick(() => {
      dragWrapperRef.value && dragWrapperRef.value.resizeListener?.()
    })
  },
  {
    deep: true
  }
)

// computed
const layerList = computed(() => ({
  rasterLayers,
  baseLayers,
  vectorLayers
}))

const defaultbaseLayer = computed(() => {
  return layerList.value.baseLayers.filter(v => v.show)?.[0]?.name
})

//底图切换
const baseLayerSwitch = (data, evt) => {
  layerList.value.baseLayers.forEach(item => {
    if (item.name === data) {
      layer.toggleLayerVisible(item.name, true)
    } else {
      layer.toggleLayerVisible(item.name, false)
    }
  })
}

//图层切换
const overlayLayerSwitch = (data, evt) => {
  const name = data.name
  layer.toggleLayerVisible(name, evt)
}

const onLayerManagerToggle = () => {
  layoutStore.toggleGlobalLayout({
    layerManager: !globalLayout.value.layerManager
  })
}
</script>
