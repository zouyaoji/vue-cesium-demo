<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-02-06 22:02:25
 * @LastEditTime: 2022-08-17 21:31:09
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\datasource\work-bench\Index.vue
-->
<template>
  <div class="work-bench">
    <div
      v-show="dynamicRenderLayout.datasource.workBench"
      class="datasources-container animate__animated animate__fadeInLeft"
      :class="{ 'full-width-drawer': !globalLayout.leftDrawerMini }"
    >
      <div class="dataset-category">
        <div class="dataset-category-header">
          <q-btn
            dense
            flat
            round
            class="close text-white"
            icon="close"
            size="sm"
            @click="
              toggleDynamicRenderPageLayout({
                datasource: {
                  workBench: false
                }
              })
            "
          ></q-btn>
          <div class="q-ml-md q-mr-md">
            <q-input
              v-model="workBenchModel.filterText"
              :disable="workBenchModel.loading"
              label="搜索"
              dark
              dense
              clearable
            >
              <template #prepend>
                <q-icon color="white" name="search" />
              </template>
            </q-input>
          </div>
        </div>
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
          class="absolute-bottom-right non-selectable z-top scroll-top"
          @click="setScrollPosition('vertical', 0, 300)"
        >
          <q-tooltip>回到顶部</q-tooltip>
        </q-btn>

        <q-scroll-area
          ref="scrollAreaRef"
          class="dataset-category-area"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          @scroll="onScrollHandler"
        >
          <loading-ios
            v-if="workBenchModel.loading"
            class="absolute-center"
            :has-error="workBenchModel.hasLoadingError"
          ></loading-ios>
          <vc-data-tree
            v-model:selected="workBenchModel.selectedKey"
            :nodes="selectedDatasetCategories"
            :filter="workBenchModel.filterText"
            @update:selected="showFeatureInfo"
            @zoomIconClicked="flyToFeature"
            @expanded="showOrHideDatasetList"
            @lazy-load="addOrRemoveDataset"
            @checked="onChecked"
          ></vc-data-tree>
        </q-scroll-area>
      </div>
    </div>
    <q-btn
      v-if="!dynamicRenderLayout.datasource.workBench"
      class="toggle-btn"
      round
      :loading="workBenchModel.loading"
      flat
      color="white"
      @click="
        toggleDynamicRenderPageLayout({
          datasource: {
            workBench: true
          }
        })
      "
    >
      <q-icon size="50px" name="keyboard_double_arrow_right"></q-icon>
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useWorkBench from './useWorkBench'
import VcDataTree from '../vc-data-tree'
import { useScroll } from '@composables/index'
import LoadingIos from '@components/loading/Ios.vue'
import { removeRenderDataByPage } from '@src/utils/render-data'
import { ThemeOptions } from '@src/types/theme'
import { store } from '@src/store'
import { storeToRefs } from 'pinia'

const globalLayout = storeToRefs(store.system.useLayoutStore()).global
const {
  contentStyle,
  contentActiveStyle,
  thumbStyle,
  scrollAreaRef,
  verticalPositionRef,
  setScrollPosition,
  onScrollHandler
} = useScroll()

const {
  workBenchModel,
  dynamicRenderLayout,
  selectedDatasetCategories,
  init,
  showFeatureInfo,
  flyToFeature,
  showOrHideDatasetList,
  addOrRemoveDataset,
  onChecked,
  toggleDynamicRenderPageLayout
} = useWorkBench()

const theme = computed<ThemeOptions>(() => {
  const themeStore = store.system.useThemeStore()
  return themeStore.themeConfig[themeStore.activeName]
})

// lifeCyle
onMounted(() => {
  init()
})

onUnmounted(() => {
  removeRenderDataByPage('/dynamic-render/datasource')
})
</script>
<style lang="scss" scoped>
.work-bench {
  .toggle-btn {
    position: absolute;
    top: 70px;
    left: 20px;
    z-index: 10;
    cursor: pointer;
  }
  .datasources-container {
    left: 80px;
    top: 120px;
    z-index: 10;
    position: absolute;
    width: 320px;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    transition: transform 0.8s ease-in, opacity 0.8s ease-in;

    .dataset-category {
      left: 220px;
      top: 80px;
      z-index: 10;
      width: 320px;
      height: auto;
      border: 1px solid rgba(0, 228, 255, 0.4);
      border-color: v-bind('theme.commonPanel.themeCommonPanelListBorderColor');
      display: flex;
      flex-direction: column;
      .dataset-category-header {
        width: 100%;
        height: 32px;
        background: v-bind('theme.commonPanel.themeCommonPanelContentBackgroundColor');
        // background: rgba(1, 84, 120, 0.7);

        .close {
          z-index: 20;
          float: right;
          position: absolute;
          right: 0px;
          // top: -16px;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
      }

      .dataset-category-area {
        height: 700px;
        overflow: hidden;
        // background: rgba(1, 84, 120, 0.7);
        background: v-bind('theme.commonPanel.themeCommonPanelContentBackgroundColor');
        padding-top: 10px;
        .data-list-tree {
          color: #fff;
        }
      }
    }
  }

  .datasources-container.full-width-drawer {
    left: 200px;
  }
}
</style>
