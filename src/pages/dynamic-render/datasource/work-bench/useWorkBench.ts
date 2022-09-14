/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-02-06 22:03:02
 * @LastEditTime: 2022-09-13 22:41:15
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\datasource\work-bench\useWorkBench.ts
 */
import { reactive, computed, nextTick } from 'vue'
import { useVueCesium } from 'vue-cesium'
import * as api from '@src/api'
import { store } from '@src/store'

import { logger } from '@src/utils'
import { VcDataset, VcDatasourceCategory, VcFeature } from '@src/types/render-data'
import {
  addDatasetByRenderingType,
  fetchDatasetList,
  getRenderDataByDatasetId,
  removeRenderDataById,
  flyToFeature as flyToFeatureModel,
  showFeatureInfoPanel
} from '@src/utils/render-data'
import { hasOwn } from 'vue-cesium/es/utils/util'

export interface WorkBenchModel {
  selectedId: string
  datasourceCategories: Array<VcDatasourceCategory>
  loading: boolean
  hasLoadingError: boolean
  filterText: string
  selectedKey: string
}
export default function () {
  const $vc = useVueCesium()
  const { toggleGlobalLayout, toggleDynamicRenderPageLayout } = store.system.useLayoutStore()
  // state
  const workBenchModel = reactive<WorkBenchModel>({
    selectedId: '',
    datasourceCategories: [],
    loading: false,
    hasLoadingError: false,
    filterText: '',
    selectedKey: ''
  })

  const dynamicRenderLayout = store.system.useLayoutStore().dynamicRender

  const selectedDatasetCategories = computed(() => {
    let result = []
    try {
      workBenchModel?.datasourceCategories.forEach(datasource => {
        if (datasource.id === workBenchModel.selectedId) {
          result = datasource.children
          throw new Error('endForEach')
        }
      })
    } catch (error: any) {
      if (error.message !== 'endForEach') {
        throw error
      }
    }

    return result
  })

  $vc.vm.vcMitt.on('pickEvt', (key: string) => {
    workBenchModel.selectedKey = key
  })
  // methods
  /**
   * 获取数据集类别分组
   */
  const getDatasourceCategories = async () => {
    workBenchModel.hasLoadingError = false
    return api.dynamicRender
      .getTreeData()
      .then(res => {
        if (res.code) return
        const datasourceCategories = res.data
        workBenchModel.selectedId = datasourceCategories[0].id
        workBenchModel.datasourceCategories = datasourceCategories
        autoRenderData()
        return true
      })
      .catch(e => {
        workBenchModel.hasLoadingError = true
      })
  }

  const autoRenderData = () => {
    workBenchModel.datasourceCategories.forEach(datasourceCategory => {
      datasourceCategory?.children?.forEach(node => {
        const dataset = node as VcDataset
        dataset?.children && addOrRemoveDataset(true, dataset)
      })
    })
  }

  const init = () => {
    workBenchModel.loading = true
    getDatasourceCategories().then(() => {
      workBenchModel.loading = false
      toggleGlobalLayout({
        navigation: true
      })
      toggleDynamicRenderPageLayout({
        datasource: {
          workBench: true
        }
      })
    })
  }

  const showFeatureInfo = (key: string, feature: VcFeature) => {
    showFeatureInfoPanel(feature)
  }

  const flyToFeature = (key: string, feature: VcFeature, index: number) => {
    $vc.vm.vcMitt.emit('pickEvt', feature.properties.id)
    flyToFeatureModel($vc.viewer, feature, index)
  }

  const addOrRemoveDataset = (show: boolean, node: VcDataset | VcFeature, parent?: VcDataset, index?: number) => {
    console.log(show, node, parent, index)
    const renderDatasetProps = {
      onReady: e => {
        console.log('onReady', e)
      }
    }
    if (hasOwn(node, 'type') && hasOwn(node, 'properties')) {
      const feature = node as VcFeature
      if (show === true) {
        if (!Cesium.defined(feature.properties.datasetId)) {
          removeRenderDataById(parent?.id)
        }
        nextTick(() => {
          const renderData = getRenderDataByDatasetId(feature.properties.datasetId)
          if (renderData) {
            //
          } else {
            if (!parent) {
              logger.error(
                '添加渲染数据集失败，原因：要素节点不能作为顶节点，请将其放到数据集节点下。',
                '数据模型：',
                node
              )
              return
            }
            if (parent?.renderingType) {
              const fetchingMethod = () => {
                return api.common.getStaticData(parent.fetchStr)
              }

              parent.loading = true
              addDatasetByRenderingType(
                parent,
                fetchingMethod,
                '/dynamic-render/datasource',
                'datasource',
                renderDatasetProps
              ).finally(() => {
                parent.loading = false
              })
            } else if (parent.renderingType !== '') {
              logger.error('添加渲染数据集失败，原因：未知的显示类型。', '数据模型：', parent)
            }
          }
        })
      }
    } else {
      const dataset = node as VcDataset
      if (show === true) {
        const renderData = getRenderDataByDatasetId(dataset.id)
        if (renderData) {
          // 已存在
        } else {
          if (dataset.renderingType) {
            const fetchingMethod = () => {
              return api.common.getStaticData(dataset.fetchStr)
            }

            dataset.loading = true
            addDatasetByRenderingType(
              dataset,
              fetchingMethod,
              '/dynamic-render/datasource',
              'datasource',
              renderDatasetProps
            ).finally(() => {
              dataset.loading = false
            })
          } else if (dataset.renderingType !== '') {
            logger.error('添加渲染数据集失败，原因：未知的显示类型。', '数据模型：', dataset)
          }
        }
      } else {
        removeRenderDataById(dataset.id)
        dataset?.children?.forEach(node => {
          addOrRemoveDataset(show, node, dataset)
        })
      }
    }
  }

  const onLazyLoad = e => {
    const dataset: VcDataset = e.dataset
    const key = e.key as string
    if (key.indexOf('Lazy load empty') > -1) {
      e.done([])
      return
    }

    const fetchingMethod = () => {
      return api.common.getStaticData(dataset.fetchStr)
    }
    dataset.loading = true
    fetchDatasetList(dataset, fetchingMethod).then(async result => {
      if (result) {
        e.done(result)
      } else {
        e.fail()
      }

      // 自动加载数据
      const renderData = await getRenderDataByDatasetId(dataset.id)
      if (!renderData) {
        const renderFeatures = dataset.children?.filter(v => v.properties.checked)
        if (renderFeatures && renderFeatures.length > 0) {
          addOrRemoveDataset(true, dataset)
        }
      }
      dataset.loading = false
    })
  }

  return {
    workBenchModel,
    dynamicRenderLayout,
    selectedDatasetCategories,
    init,
    showFeatureInfo,
    flyToFeature,
    onLazyLoad,
    addOrRemoveDataset,
    toggleDynamicRenderPageLayout
  }
}
