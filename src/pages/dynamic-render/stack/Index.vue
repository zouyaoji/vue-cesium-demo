<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-09-20 09:41:54
 * @LastEditTime: 2022-10-19 16:56:43
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\stack\Index.vue
-->
<template>
  <div class="page-dynamic-render-stack">
    <div v-if="showStackButtons" class="stack-buttons-wrapper">
      <div class="stack-buttons-container">
        <div
          v-for="(dataset, index) in stackDatas"
          :key="index"
          class="stack-button"
          :class="{ active: dataset.checked }"
          @click="onStackButtonClick(dataset)"
        >
          <div style="margin-top: 5px">{{ dataset.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { store } from '@src/store'
import useStackData from './useStackData'
import {
  addRenderDataCustom,
  addRenderDataGeojson,
  addRenderDatas,
  makeEntitiesModel,
  removeRenderDataById
} from '@src/utils/render-data'
import { useRoute } from 'vue-router'
import { flyToCamera } from 'vue-cesium/es/utils/cesium-helpers'
import { useVueCesium } from 'vue-cesium'
import { VcRenderData } from '@src/types/render-data'

defineOptions({
  name: 'VcDemoDynamicRenderStack'
})

const $route = useRoute()
const { loadDefaultLayers } = store.viewer.useLayerStore()
const { stackDatas } = useStackData()
const $vc = useVueCesium()
const showStackButtons = ref(false)
const entities = ref([])

onUnmounted(() => {
  removeRenderDataById($route.path)
})

onMounted(() => {
  loadDefaultLayers(true)
  flyToCamera(
    $vc.viewer,
    {
      position: { x: -2324661.042454219, y: 5396877.953175202, z: 2474170.1591741517 },
      heading: 6.283185307179586,
      pitch: -0.5001412827126326,
      roll: 6.283185307179586
    },
    {
      duration: 1,
      complete: () => {
        showStackButtons.value = true
      }
    }
  )
})

const onStackButtonClick = menu => {
  if (menu.checked) {
    removeRenderDataById(menu.id)
  } else {
    addRenderDataCustom(menu.data, menu.renderingType, menu.entityProps, menu.entitySelectedProps, menu.id, $route.path)
  }
  menu.checked = !menu.checked
}
</script>

<style lang="scss" scoped>
.page-dynamic-render-stack {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: url(/images/bg-mask.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: $z-fab;

  & > div {
    pointer-events: auto;
  }

  .stack-buttons-wrapper {
    position: absolute;
    z-index: $z-fab - 20;
    width: 100%;
    height: auto;
    bottom: 44px;
    justify-content: center;
    align-items: center;
    display: inline-flex;
    font-size: 17px;
    color: #fff;
    pointer-events: none;

    & > div {
      pointer-events: auto;
    }

    .stack-buttons-container {
      position: relative;
      display: flex;
      background: url(/images/bg-buttons-container.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      .stack-button {
        background: url(/images/bg-stack-button.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;

        width: 120px;
        height: 65px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 10px 10px 10px 0;

        &:first-child {
          margin-left: 10px;
        }

        &:hover {
          color: #ffb000;
          background: url(/images/bg-stack-button-active.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }

      .stack-button.active {
        color: #ffb000;
        background: url(/images/bg-stack-button-active.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
