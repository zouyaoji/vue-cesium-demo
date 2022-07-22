/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-02-06 22:03:02
 * @LastEditTime: 2022-07-23 00:21:51
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\datasource\work-bench\useWorkBench.ts
 */
import { reactive, computed } from 'vue'
import { useVueCesium } from 'vue-cesium'
import * as api from '@src/api'
import { store } from '@src/store'

import { logger } from '@src/utils'
import { VcDataset } from '@src/types/render-data'
import {
  addDatasetByRenderingType,
  fetchDatasetList,
  getRenderDataByDatasetId,
  removeRenderDataById,
  flyToFeature as flyToFeatureModel
} from '@src/utils/render-data'

export interface WorkBenchModel {
  selectedId: string
  datasourceCategories: Array<any>
  loading: boolean
  hasLoadingError: boolean
  filterText: string
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
    filterText: ''
  })

  window.workBenchModel = workBenchModel

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
        return true
      })
      .catch(e => {
        workBenchModel.hasLoadingError = true
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

  /**
   * 添加数据集到动态渲染数组或者从动态渲染数组中移除数据集。
   */
  const addOrRemoveDataset = async (show, dataset, subIndex?, featureItem?) => {
    if (show) {
      const renderData = await getRenderDataByDatasetId(dataset.id)
      if (renderData) {
        // 已存在
        dataset.children.forEach(feature => {
          feature.properties && (feature.properties.checked = true)
        })
      } else {
        if (dataset.id == 407) {
          // leftPanelModel.cars = dataset
          return
        }
        if (dataset.renderingType) {
          const fetchingMethod = () => {
            return api.common.getStaticData(dataset.fetchStr)
          }

          await addDatasetByRenderingType(dataset, fetchingMethod, '/dynamic-render/datasource')

          dataset.children.forEach(feature => {
            if (featureItem) {
              // featureItem 有值，说明 操作的是子项
              feature.properties && (feature.properties.checked = feature === featureItem)
            } else {
              // 显示数据集 数据集的对象全部显示
              feature.properties && (feature.properties.checked = true)
            }
          })
        } else {
          logger.error('添加渲染数据集失败，原因：未知的显示类型。', '数据模型：', dataset)
          dataset.checked = false
          dataset.loading = false
        }
      }
    } else {
      removeRenderDataById(dataset.id)

      dataset.cesiumObjects = []
      dataset.loading = false
      dataset.children.forEach(feature => {
        feature.properties && (feature.properties.checked = false)
      })
    }
  }

  const showFeatureInfo = (dataset, feature, subIndex?) => {
    if (!dataset.hasDetail) {
      return
    }
    // showFeatureInfoPanel(feature)
    logger.debug('属性展示逻辑待完善')
  }

  const flyToFeature = (dataset, feature, subIndex?) => {
    flyToFeatureModel($vc.viewer, feature)
  }

  const showOrHideDatasetList = (show: boolean, dataset: VcDataset) => {
    if (show && dataset.renderingType && dataset.children.length === 0) {
      const fetchingMethod = () => {
        return api.common.getStaticData(dataset.fetchStr)
      }
      dataset.loading = true
      fetchDatasetList(dataset, fetchingMethod).then(() => {
        dataset.loading = false
      })
    }
  }

  return {
    workBenchModel,
    dynamicRenderLayout,
    selectedDatasetCategories,
    init,
    addOrRemoveDataset,
    showFeatureInfo,
    flyToFeature,
    showOrHideDatasetList,
    toggleDynamicRenderPageLayout
  }
}
