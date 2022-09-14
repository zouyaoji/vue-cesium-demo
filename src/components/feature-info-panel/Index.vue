<template>
  <div class="feature-info" :class="dynamicRenderLayout.datasource.workBench ? '' : 'full-srceen'">
    <drag-wrapper ref="dragWrapperRef">
      <common-panel
        v-show="globalLayout.featureInfo"
        class="feature-info-panel animated fadeIn q-ma-xs"
        title="要素信息"
        title-class="drag-handle"
        @close="closePanel"
      >
        <loading-ios
          v-if="selectedRenderData?.featureInfoListItems.length === 0"
          class="absolute-center"
          show-tip
        ></loading-ios>
        <q-btn
          v-if="verticalPositionRef > 600"
          dense
          fab
          round
          glossy
          fab-mini
          ripple
          icon="expand_less"
          padding="2px"
          class="absolute-bottom-right non-selectable scroll-top z-top"
          @click="setScrollPosition('vertical', 0, 300)"
        >
          <q-tooltip>回到顶部</q-tooltip>
        </q-btn>
        <q-scroll-area
          ref="scrollAreaRef"
          class="feature-info-panel-content"
          :style="featureInfoPanelStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          @scroll="onScrollHandler"
        >
          <q-list ref="featureInfoListRef" dark bordered separator class="feature-info-list">
            <q-item v-for="(item, index) of selectedRenderData?.featureInfoListItems" :key="index" v-ripple clickable>
              <q-item-section avatar>
                <q-icon class="feature-info-field-icon" name="article" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label caption>{{ item.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </common-panel>
    </drag-wrapper>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed, nextTick, reactive, ref, watch } from 'vue'
import { store } from '@src/store'
import { useScroll } from '@composables/index'

import CommonPanel from '@components/common-panel/Index.vue'
import DragWrapper from '@components/drag-wrapper'
import LoadingIos from '@components/loading/Ios.vue'
import { clearSelectedRenderData } from '@src/utils/render-data'
import { storeToRefs } from 'pinia'
// state
const dragWrapperRef = ref(null)

const {
  contentStyle,
  contentActiveStyle,
  thumbStyle,
  scrollAreaRef,
  verticalPositionRef,
  setScrollPosition,
  onScrollHandler
} = useScroll()

const layoutStore = store.system.useLayoutStore()
const { global: globalLayout, dynamicRender: dynamicRenderLayout } = storeToRefs(layoutStore)
const { toggleGlobalLayout } = layoutStore

const selectedRenderData = store.viewer.useRenderStore().selectedRenderData
const featureInfoListRef = ref(null)
const featureInfoPanel = ref('450px')

// onMounted
onMounted(() => {
  console.log()
})

// watch
watch(
  globalLayout,
  val => {
    nextTick(() => {
      dragWrapperRef.value?.resizeListener?.()
    })
  },
  {
    deep: true
  }
)

watch(selectedRenderData, val => {
  nextTick(() => {
    if (val?.featureInfoListItems?.length) {
      const node = featureInfoListRef.value.$el
      const style = getComputedStyle(node)
      const height = style.height
      const h = parseInt(height)
      if (h < 680) {
        featureInfoPanel.value = height
      } else {
        featureInfoPanel.value = '680px'
      }
    }
  })
})
// computed
const featureInfoPanelStyle = computed(() => {
  return {
    height: featureInfoPanel.value
  }
})
// window.featureInfoPanelStyle = featureInfoPanelStyle.value
// methods
// 关闭详情面板
const closePanel = () => {
  // clearSelectedRenderData()
  toggleGlobalLayout({
    featureInfo: false
  })
}
</script>
<style lang="scss" scoped>
.feature-info {
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
    right: 10px;
    top: 10px;
    .feature-info-panel {
      pointer-events: auto;
      width: 400px;
      height: auto;
      max-height: 700px;
      color: #fff;
    }
  }
}
</style>
