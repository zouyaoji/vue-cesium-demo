/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-02-06 22:03:02
 * @LastEditTime: 2022-08-17 21:12:02
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\datasource\work-bench\useWorkBench.ts
 */
import { reactive, computed } from 'vue'
import { useVueCesium } from 'vue-cesium'
import * as api from '@src/api'
import { store } from '@src/store'

import { logger } from '@src/utils'
import { VcDataset, VcFeature } from '@src/types/render-data'
import {
  addDatasetByRenderingType,
  fetchDatasetList,
  getRenderDataByDatasetId,
  removeRenderDataById,
  flyToFeature as flyToFeatureModel,
  showFeatureInfoPanel
} from '@src/utils/render-data'

export interface WorkBenchModel {
  selectedId: string
  datasourceCategories: Array<any>
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

  const showFeatureInfo = (key: string, feature: VcFeature) => {
    showFeatureInfoPanel(feature)
  }

  const flyToFeature = (key: string, feature: VcFeature) => {
    flyToFeatureModel($vc.viewer, feature)
  }

  const showOrHideDatasetList = (show: boolean, dataset: VcDataset) => {
    if (show && dataset.renderingType && !dataset?.children) {
      const fetchingMethod = () => {
        return api.common.getStaticData(dataset.fetchStr)
      }
      dataset.loading = true
      fetchDatasetList(dataset, fetchingMethod).then(() => {
        dataset.loading = false
      })
    }
  }

  const onChecked = (state: boolean, node: VcDataset | VcFeature, m, parent: VcDataset) => {
    console.log(state, node)
    if (m.isParent === true) {
      const dataset = node as VcDataset
      if (state === true) {
        const renderData = getRenderDataByDatasetId(dataset.id)
        if (renderData) {
          // 已存在
        } else {
          if (dataset.renderingType) {
            const fetchingMethod = () => {
              return api.common.getStaticData(dataset.fetchStr)
            }

            addDatasetByRenderingType(dataset, fetchingMethod, '/dynamic-render/datasource')
          } else if (dataset.renderingType !== '') {
            logger.error('添加渲染数据集失败，原因：未知的显示类型。', '数据模型：', dataset)
          }
        }
      } else {
        removeRenderDataById(dataset.id)
      }
    } else {
      const vcFeature = node as VcFeature
      if (state === true) {
        const renderData = getRenderDataByDatasetId(vcFeature.properties.datasetId)
        if (renderData) {
          //
        } else {
          if (parent.renderingType) {
            const fetchingMethod = () => {
              return api.common.getStaticData(parent.fetchStr)
            }

            addDatasetByRenderingType(parent, fetchingMethod, '/dynamic-render/datasource')
          } else if (parent.renderingType !== '') {
            logger.error('添加渲染数据集失败，原因：未知的显示类型。', '数据模型：', parent)
          }
        }
      }
    }
  }

  const addOrRemoveDataset = e => {
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
    fetchDatasetList(dataset, fetchingMethod).then(result => {
      if (result) {
        e.done(result)
      } else {
        e.fail()
      }
    })
  }

  return {
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
  }
}
