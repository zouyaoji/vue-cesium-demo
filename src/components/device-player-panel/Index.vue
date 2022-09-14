<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:19:31
 * @LastEditTime: 2022-09-14 22:44:02
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\device-player-panel\Index.vue
-->
<template>
  <div
    v-if="globalLayout.videoPlayer"
    class="device-player"
    :class="dynamicRenderLayout.datasource.workBench ? '' : 'full-srceen'"
  >
    <drag-wrapper ref="dragWrapperRef">
      <common-panel
        class="device-player-panel"
        :title="$t('message.panel.videoPlayer')"
        title-class="drag-handle"
        @close="onLayerManagerToggle"
      >
        <q-card-section>
          <div class="jessibuca-player-container">
            <jessibuca-player
              url="https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-720p.flv"
            ></jessibuca-player>
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
import JessibucaPlayer from '@components/jessibuca-player/Index.vue'

defineOptions({
  name: 'VcDemoDevicePlayerPanel'
})

// state
const dragWrapperRef = ref<typeof DragWrapper | null>(null)

const layoutStore = store.system.useLayoutStore()
const { global: globalLayout, dynamicRender: dynamicRenderLayout } = storeToRefs(layoutStore)

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

const onLayerManagerToggle = () => {
  layoutStore.toggleGlobalLayout({
    videoPlayer: !globalLayout.value.videoPlayer
  })
}
</script>

<style lang="scss" scoped>
.device-player {
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
    .device-player-panel {
      width: 920px;
      // height: 450px;
      min-width: 450px;
    }
  }
}
</style>
