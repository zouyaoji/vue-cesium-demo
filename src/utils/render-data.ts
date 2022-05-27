/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-10-28 10:19:54
 * @LastEditTime: 2022-05-26 14:26:21
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\render-data.ts
 */

import { store, pinia } from '@src/store'
import { find } from 'lodash'
import { VcRenderData, VcFeature, VcSelectedRenderData } from '@src/types/render-data'
import { VcDatasourceCustomProps, VcDatasourceGeojsonProps, VcEntityProps } from 'vue-cesium'
import { AllGeoJSON, Feature, FeatureCollection } from '@turf/turf'
import * as logger from './logger'
import { entityModelHandler } from './model-helper'
import { toggleGlobalLayout } from './layout'

/**
 * 添加渲染数据到场景。
 * @param {VcRenderData|Array<VcRenderData>} renderDatas 待添加的渲染数据或数据组
 */
export function addRenderDatas(renderDatas: VcRenderData | Array<VcRenderData>) {
  store.viewer.useRenderStore(pinia).addRenderDatas(renderDatas)
}
/**
 * 根据 id 移除渲染数据。
 * @param {string} id 待移除渲染数据的 id
 */
export function removeRenderDataById(id: string | number) {
  store.viewer.useRenderStore(pinia).removeRenderDataById(id)
}
/**
 * 根据 type 移除渲染数据。
 * @param {string} type 待移除渲染数据的 type
 */
export function removeRenderDataByType(type: string) {
  store.viewer.useRenderStore(pinia).removeRenderDataByType(type)
}
/**
 * 根据 page 移除渲染数据。
 * @param {string} type 待移除渲染数据的 page
 */
export function removeRenderDataByPage(pageName: string) {
  store.viewer.useRenderStore(pinia).removeRenderDataByPage(pageName)
}
/**
 * 移除当前所有的渲染数据
 */
export function removeAllRenderData() {
  store.viewer.useRenderStore(pinia).removeAllRenderData()
}
/**
 * 根据 id 获取渲染数据。
 */
export function getRenderDataByDatasetId(id: string | number): VcRenderData {
  return store.viewer.useRenderStore(pinia).getRenderDataByDatasetId(id)
}
/**
 * 设置当前选中的渲染数据
 * @param {*} renderData
 */
export function setSelectedRenderData(renderData: VcSelectedRenderData) {
  store.viewer.useRenderStore(pinia).setSelectedRenderData(renderData)
}
/**
 * 清除当前选中的渲染数据
 */
export function clearSelectedRenderData() {
  const selectedRenderData = store.viewer.useRenderStore(pinia).selectedRenderData
  selectedRenderData.model && selectedRenderData?.restoreHandler?.()
  setSelectedRenderData({
    model: undefined,
    renderingType: undefined,
    restoreHandler: undefined,
    feature: undefined,
    featureInfoListItems: []
  })
}
/**
 * 高亮展示选中的渲染数据
 * @param renderingType 渲染类型
 * @param datasetId 数据集 id
 * @param featureId 要素id
 * @param featureInfoListItems
 * @returns
 */
export function highlightRenderData(
  renderingType: string,
  datasetId: string | number,
  featureId: string | number,
  featureInfoListItems = [],
  renderingApi?
) {
  clearSelectedRenderData()
  return getFeatureModel(renderingType, datasetId, featureId).then(model => {
    if (!model) {
      return false
    }

    if (renderingType === 'point') {
      const point = renderingApi === 'primitive' ? model : model.point
      const restorePixelSize = point.pixelSize || 1
      const restoreColor = point.color || [255, 255, 255, 0]
      point.pixelSize = restorePixelSize * 1.5
      // billboard.color = '#ffc107'

      setSelectedRenderData({
        model: point,
        renderingType,
        restoreHandler: () => {
          point.pixelSize = restorePixelSize
          point.color = restoreColor
        },
        feature: model.feature,
        featureInfoListItems
      })
    } else if (renderingType === 'billboard') {
      const billboard = renderingApi === 'primitive' ? model : model.billboard
      // const restoreColor = billboard.color || [255, 255, 255, 0]
      const restoreScale = billboard.scale || 1
      billboard.scale = restoreScale * 1.5
      // billboard.color = '#ffc107'

      setSelectedRenderData({
        model: billboard,
        renderingType,
        restoreHandler: () => {
          billboard.scale = restoreScale
          // billboard.color = restoreColor
        },
        feature: model.feature,
        featureInfoListItems
      })
    } else if (renderingType === 'polyline') {
      const polyline = renderingApi === 'primitive' ? model : model.polyline
      const restoreMaterial = polyline.material || 'white'
      const restoreWidth = polyline.width || 1
      polyline.width = restoreWidth * 1.5
      polyline.material = '#ffc107'
      setSelectedRenderData({
        model: polyline,
        renderingType: 'polyline',
        restoreHandler: () => {
          polyline.width = restoreWidth
          polyline.material = restoreMaterial
        },
        feature: model.feature,
        featureInfoListItems
      })
    } else if (renderingType === 'polygon') {
      if (renderingApi === 'primitive') {
        const polygon = model
        const restoreColor = polygon.color || 'white'
        polygon.color = '#ffc107'
        setSelectedRenderData({
          model: polygon,
          renderingType: 'polygon',
          restoreHandler: () => {
            polygon.color = restoreColor
          },
          feature: model.feature,
          featureInfoListItems
        })
      } else {
        const polygon = model.polygon
        const restoreMaterial = polygon.material || 'white'
        if (model.feature.properties?.datasetId === 'observationElementPattern') {
          polygon.extrudedHeight = 1000
        }
        polygon.material = '#ffc107'
        setSelectedRenderData({
          model: polygon,
          renderingType: 'polygon',
          restoreHandler: () => {
            polygon.material = restoreMaterial
            polygon.extrudedHeight = undefined
          },
          feature: model.feature,
          featureInfoListItems
        })
      }
    } else if (renderingType === 'geojson') {
      const polygon = renderingApi === 'primitive' ? model.polygon : model.polygon
    }
  })
}

export function getRenderDataDatasetModel(datasetId: string | number, cmpName: string) {
  const renderData = getRenderDataByDatasetId(datasetId)
  if (!renderData) {
    return undefined
  }

  const dataset = find(renderData.datasets, v => v.cmpName === cmpName)

  if (dataset) {
    return dataset.props
  }
  return undefined
}

/**
 * 获取渲染要素的数据模型。
 * @param {*} renderingType 渲染类型
 * @param {*} datasetId 数据集 id
 * @param {*} featureId 要素 id
 * @returns
 */
export function getFeatureModel(
  renderingType: string,
  datasetId: string | number,
  featureId: string | number,
  renderingApi?
) {
  const renderData = getRenderDataByDatasetId(datasetId)
  if (!renderData) {
    return undefined
  }

  let cmpName, propName
  switch (renderingType) {
    case 'label':
    case 'point':
    case 'billboard':
      cmpName = renderingApi === 'primitive' ? 'VcCollectionBillboard' : 'VcDatasourceCustom'
      propName = renderingApi === 'primitive' ? 'billboards' : 'entities'
      break
    case 'polyline':
      cmpName = renderingApi === 'primitive' ? 'VcCollectionPolyline' : 'VcDatasourceCustom'
      propName = renderingApi === 'primitive' ? 'polylines' : 'entities'
      break
    case 'polygon':
      cmpName = renderingApi === 'primitive' ? 'VcCollectionPrimitive' : 'VcDatasourceCustom'
      propName = renderingApi === 'primitive' ? 'polygons' : 'entities'
      break
    case 'geojson':
      // zouyaoji tips geojson 不支持取子要素数据模型
      cmpName = renderingApi === 'primitive' ? 'VcDatasourceGeojson' : 'VcDatasourceGeojson'
      propName = renderingApi === 'primitive' ? 'data' : 'data'
      break
  }

  const dataset = find(renderData.datasets, v => v.cmpName === cmpName)
  if (renderingType === 'geojson') {
    return dataset
  }
  const model = find(
    dataset.props[propName],
    v => v.feature.properties.id === featureId && v.feature.properties.actualRenderingType === renderingType
  )

  return model
}

/**
 * 设置数据源中对象的风格，暂时只针对面对象。
 * @param {*} dataSource
 * @param {*} legends
 */
export function setDataSourceRangeColor(dataSource, feature) {
  const entities = dataSource.entities.values
  const legends = feature.properties.legends
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]
    entity.feature = feature
    const value = entity.properties.dValue._value
    let color = ''
    if (value < 0) continue
    legends.forEach(legend => {
      if (value >= legend.start && value < legend.end) {
        color = legend.color
      }
    })
    if (Cesium.defined(entity.polygon)) {
      entity.polygon.material = Cesium.Color.fromCssColorString(color).withAlpha(0.8)
    }
  }
}

/**
 * 将 GeoJSON 的 Feature 对象处理成 [VcDatasourceCustom](https://zouyaoji.top/vue-cesium/#/zh-CN/component/datasources/vc-datasource-custom) 组件 `entities` 参数模型。
 * @param feature 要素
 * @param props 默认参数
 * @returns
 */
export function processVcEntityModels(
  feature: VcFeature,
  props: VcEntityProps
):
  | Array<
      VcEntityProps & {
        feature: VcFeature
      }
    >
  | string {
  const entities = []

  if (!Cesium.defined(feature.geometry)) {
    logger.warn('feature.geometry is required.', '要素：', feature)
    return '添加渲染模型失败，原因：该要素没有 geometry 属性'
  }

  const geometryType = feature.geometry.type
  const properties = feature.properties
  const renderingTypes = properties?.renderingType?.trim().split(',')
  if (!renderingTypes || !renderingTypes.length) {
    logger.warn(`添加渲染模型失败，原因：未知的显示类型。`, '要素：', feature)
    return '添加渲染模型失败，原因：未知的显示类型。'
  }

  const geometryHandler = entityModelHandler[geometryType]
  if (!Cesium.defined(geometryHandler)) {
    logger.warn(`添加渲染模型失败，原因：该几何类型${geometryType}没有找到处理方法。`, '要素：', feature)
    return `添加渲染模型失败，原因：该几何类型${geometryType}没有找到处理方法。`
  }

  renderingTypes.forEach(renderingType => {
    const model = geometryHandler(props, feature, renderingType)
    const models = Array.isArray(model) ? model : [model]
    entities.push(...models)
  })

  return entities
}

/**
 * 将 GeoJSON 数据用 VcDatasourceGeojson 组件动态添加到渲染数据队列。
 * @param id 数据集 id
 * @param page 数据所处页面完整 path 路径
 * @param props [VcDatasourceGeojson](https://zouyaoji.top/vue-cesium/#/zh-CN/component/datasources/vc-datasource-geojson) 组件参数
 * @param type 数据类型
 * @example
 *     // 用 VcDatasourceGeojson 渲染数据。
 *     // addRenderDataGeojson(
 *     //   'risk-admin',
 *     //   '/flood-and-typhoon-prevention/risk-judgment',
 *     //   {
 *     //     data: `https://devapi.weatherone.net/${e.jsonfile}`,
 *     //     fill: 'rgba(64,158,255,.4)',
 *     //     stroke: 'red',
 *     //     strokeWidth: 5.0,
 *     //     onReady: (readyObj: VcReadyObject) => {
 *     //       const datasource = readyObj.cesiumObject as Cesium.GeoJsonDataSource
 *     //       readyObj.viewer.flyTo(datasource, {
 *     //         duration: 1.5
 *     //       })
 *     //     }
 *     //   } as any,
 *     //   'regional-risk-info'
 *     // )
 */
export function addRenderDataGeojson(
  id: string | number,
  page: string,
  props: VcDatasourceGeojsonProps | Array<VcDatasourceGeojsonProps>,
  type?: string
) {
  const renderData: VcRenderData = {
    id: id,
    page: page,
    type: type,
    datasets: []
  }
  const datas = Array.isArray(props) ? props : [props]
  datas.forEach(props => {
    renderData.datasets.push({
      cmpName: 'VcDatasourceGeojson',
      props: {
        ...props
      }
    })
  })
  addRenderDatas(renderData)
}

/**
 * 将 GeoJSON 数据用 VcDatasourceCustom 组件动态添加到渲染数据队列。
 * @param id
 * @param page
 * @param feature
 * @param entityProps
 * @param props
 * @param type
 */
export async function addRenderDataCustom(
  data: string | AllGeoJSON,
  renderingType: string,
  id: string | number,
  page: string,
  entityProps: VcEntityProps,
  datasourceProps?: VcDatasourceCustomProps,
  type?: string
) {
  const renderData: VcRenderData = {
    id: id,
    page: page,
    type: type,
    datasets: []
  }

  const entities = await makeEntitiesModel(data, renderingType, entityProps)
  entities.length &&
    renderData.datasets.push({
      cmpName: 'VcDatasourceCustom',
      props: {
        entities,
        ...datasourceProps
      }
    })
  addRenderDatas(renderData)
  return Promise.resolve(renderData)
}

export async function makeEntitiesModel(data: string | AllGeoJSON, renderingType: string, props: VcEntityProps) {
  if (typeof data === 'string') {
    data = (await Cesium.Resource.fetchJson({
      url: data
    })) as AllGeoJSON
  }

  if (!Cesium.defined(data)) {
    logger.error('添加数据源失败，原因：GeoJSON 数据格式不正确。', data)
    return
  }

  const entities = []

  const featureType = data.type
  switch (featureType) {
    case 'FeatureCollection':
      {
        const featureCollection = data as FeatureCollection
        const features = featureCollection.features
        features.forEach(feature => {
          feature.properties.renderingType = feature.properties.renderingType || renderingType
          const models = processVcEntityModels(feature as VcFeature, props)
          models.length && entities.push(...models)
        })
      }
      break
    case 'Feature':
      {
        const feature = data as Feature
        feature.properties.renderingType = feature.properties.renderingType || renderingType
        const models = processVcEntityModels(feature as VcFeature, props)
        models.length && entities.push(...models)
      }
      break
  }

  return entities
}

/**
 * 定位到要素
 * @param viewer
 * @param feature
 * @param highlightRenderData
 * @param showBillboardOverlayMenu
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function flyToFeature<T = {}>(
  viewer: Cesium.Viewer,
  feature: VcFeature,
  options = {
    isHighlightRenderData: true,
    showBillboardOverlayMenu: true,
    duration: 1.5
  } as {
    isHighlightRenderData?: boolean
    showBillboardOverlayMenu?: boolean
    duration?: number
    [key: string]: any
  }
) {
  const renderingType = feature?.properties?.actualRenderingType
  if (!renderingType) {
    logger.error('定位到要素失败，原因：未知的显示类型。', '要素模型：', feature)
    return
  }
  const datasetId = feature.properties.datasetId
  const renderData = await getRenderDataByDatasetId(datasetId)
  if (!renderData) {
    logger.error('定位到要素失败，原因：未找到该要素所在的渲染数据。', '要素模型：', feature)
    return
  }
  const featureId = feature.properties.id
  options.isHighlightRenderData && highlightRenderData(renderingType, datasetId, featureId)
  switch (renderingType) {
    case 'billboard':
    case 'point':
    case 'label':
    case 'polyline':
    case 'polygon':
    case 'model':
      // 关闭上次的布告板菜单（如果有的话）
      // clearBillboardOverlayMenu()
      // 关闭属性详情面板
      toggleGlobalLayout({
        featureInfo: false
      })
      // 定位默认取第一个数据集的对象
      if (renderData?.datasets?.length) {
        const datasource = renderData.datasets[0].cmpRef?.cesiumObject as Cesium.DataSource
        const target = datasource.entities.values.filter((entity: any) => entity.feature.properties.id === featureId)[0]
        viewer
          .flyTo(target, {
            ...options
          })
          .then(() => {
            // options.showBillboardOverlayMenu &&
            //   setBillboardOverlayMenu({
            //     position: target.position.getValue(Cesium.JulianDate.now()),
            //     show: true
            //   })
          })
      }
      break
    case 'geojson':
      break
  }
}
