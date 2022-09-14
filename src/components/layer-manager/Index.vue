<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:19:31
 * @LastEditTime: 2022-09-13 23:21:02
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\layer-manager\Index.vue
-->
<template>
  <div class="layer-manager" :class="dynamicRenderLayout.datasource.workBench ? '' : 'full-srceen'">
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
          <div class="text-subtitle2">{{ $t('message.overlayLayer') }}</div>
          <div class="q-gutter-sm">
            <q-checkbox
              v-for="(item, index) of layerList.overlayLayers"
              :key="index"
              v-model="item.props.show"
              :val="item.name"
              :label="item.text"
              @update:model-value="overlayLayerSwitch(item, $event)"
            />
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="q-pt-sm">
          <div class="text-subtitle2">{{ $t('message.terrainLayer') }}</div>
          <div class="q-gutter-sm">
            <q-radio
              v-for="(item, index) of layerList.terrainLayers"
              :key="index"
              v-model="defaultTerrainLayer"
              :val="item.name"
              :label="item.text"
              @update:model-value="terrainLayerSwitch"
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
import { storeToRefs } from 'pinia'

// state
const dragWrapperRef = ref<typeof DragWrapper | null>(null)

const layoutStore = store.system.useLayoutStore()
const { global: globalLayout, dynamicRender: dynamicRenderLayout } = storeToRefs(layoutStore)
const { overlayLayers, baseLayers, terrainLayers, toggle: toggleLayerVisible } = store.viewer.useLayerStore()

// watch
watch(
  dynamicRenderLayout,
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
  overlayLayers,
  baseLayers,
  terrainLayers
}))

const defaultbaseLayer = computed<string>({
  get() {
    return layerList.value.baseLayers.filter(v => v.props.show)?.[0]?.name
  },
  set(val) {
    //
  }
})

const defaultTerrainLayer = computed<string>({
  get() {
    return layerList.value.terrainLayers.filter(v => v.props.show)?.[0]?.name
  },
  set(val) {
    //
  }
})

//底图切换
const baseLayerSwitch = (data, evt) => {
  layerList.value.baseLayers.forEach(item => {
    if (item.name === data) {
      toggleLayerVisible({
        names: item.name,
        show: true
      })
    } else {
      toggleLayerVisible({ names: item.name, show: false })
    }
  })
}

//图层切换
const overlayLayerSwitch = (data, evt) => {
  const name = data.name
  toggleLayerVisible({
    names: name,
    show: evt
  })
}

/**
 * 地形图层切换
 */
const terrainLayerSwitch = (data, evt) => {
  layerList.value.terrainLayers.forEach(item => {
    if (item.name === data) {
      toggleLayerVisible({
        names: item.name,
        show: true
      })
    } else {
      toggleLayerVisible({
        names: item.name,
        show: false
      })
    }
  })
}

const onLayerManagerToggle = () => {
  layoutStore.toggleGlobalLayout({
    layerManager: !globalLayout.value.layerManager
  })
}
</script>

<style lang="scss" scoped>
.layer-manager {
  z-index: $z-fab - 20;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  pointer-events: none;
  left: 0;

  height: calc(100vh - 115px);
  width: calc(100% - $left-panel-width);

  @media (min-width: $breakpoint-md) {
    left: $left-panel-width + 20px;
    top: 90px;
    right: 110px;
    bottom: 0;
  }

  & > div {
    pointer-events: auto;
  }

  &.full-srceen {
    left: 40px;
  }

  :deep(.drag-wrapper) {
    left: 35%;
    top: 20%;
    .layer-manager-panel {
      pointer-events: auto;
      width: 450px;
      min-width: 450px;
    }
  }
}
</style>
