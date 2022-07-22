/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-10-28 10:19:54
 * @LastEditTime: 2022-07-22 23:47:42
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\render-data.ts
 */

import { store, pinia } from '@src/store'
import { VcRenderData, VcFeature, VcSelectedRenderData, VcDatasetGetMethod, VcDataset } from '@src/types/render-data'
import { VcDatasourceCustomProps, VcDatasourceGeojsonProps, VcEntityProps, VcPrimitiveTilesetProps } from 'vue-cesium'
import { AllGeoJSON, Feature, FeatureCollection } from '@turf/turf'
import * as logger from './logger'
import { entityModelHandler } from './model-helper'
import { isPlainObject } from 'vue-cesium/es/utils/util'
import { find, intersectionWith, uniqWith } from 'lodash'
import { markRaw, toRef } from 'vue'
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

  const model = getFeatureModel(renderingType, datasetId, featureId)
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
    case 'model':
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
    case 'tileset':
      cmpName = 'VcPrimitiveTileset'
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
 *     //   '/datasource,
 *     //   {
 *     //     data: `https://zouyaoji.top/vue-cesium/test.json`,
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
  const { toggleGlobalLayout } = store.system.useLayoutStore(pinia)
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
            // 菜单展示逻辑
          })
      }
      break
    case 'tileset':
      // 关闭上次的布告板菜单（如果有的话）
      // clearBillboardOverlayMenu()
      // 关闭属性详情面板
      toggleGlobalLayout({
        featureInfo: false
      })
      if (renderData?.datasets?.length) {
        const datasets = renderData.datasets.filter(
          dataset => dataset.props.url === feature.properties.props.tileset.url
        )
        const target = datasets[0].cmpRef.cesiumObject
        viewer
          .flyTo(target, {
            ...options
          })
          .then(() => {
            // 菜单展示逻辑
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

export function fetchDatasetList(dataset: VcDataset, fetchingMethod: VcDatasetGetMethod) {
  return fetchingMethod()
    .then(res => {
      if (res.code !== 0) {
        logger.error(`添加渲染数据集失败，原因：数据请求失败。数据集id: ${dataset.id}，数据集名称: ${dataset.name}`)
        dataset.loading = false
        dataset.checked = false
        return false
      }

      if (res.data) {
        if (res.data?.type) {
          const geoJsonObjectType = res.data?.type
          switch (geoJsonObjectType) {
            case 'Feature':
              dataset.children = [res.data]
              break
            case 'FeatureCollection':
              dataset.children = res.data.features
              dataset.children.forEach(v => {
                if (!Cesium.defined(v.properties.renderingType)) {
                  v.properties.renderingType = dataset.renderingType || 'billboard'
                }
                if (!Cesium.defined(v.properties.id)) {
                  v.properties.id = Cesium.createGuid()
                }
                if (!Cesium.defined(v.properties.checked)) {
                  v.properties.checked = false
                }
              })
              break
            default:
              logger.error(
                `添加渲染数据集失败，原因：未知的 GeoJSON 类型。数据集id: ${dataset.id}，数据集名称: ${dataset.name}`
              )
              dataset.loading = false
              dataset.checked = false
              return
          }
        } else if (dataset.renderingType === 'heatmap') {
          // 人口分布的热力图
          dataset.children = [res.data]
        }
      } else {
        logger.error(
          `添加渲染数据集失败，原因：未知的 GeoJSON 类型。数据集id: ${dataset.id}，数据集名称: ${dataset.name}`
        )
        dataset.loading = false
        dataset.checked = false
        return false
      }
      if (!dataset.children?.length) {
        logger.error(
          `添加渲染数据集失败，原因：请求数据成功，但结果为空。数据集id: ${dataset.id}，数据集名称: ${dataset.name}`
        )
        dataset.loading = false
        dataset.checked = false
        return false
      }
      return true
    })
    .catch(e => {
      logger.error('添加渲染数据集失败，原因：数据请求异常。', e)
      dataset.loading = false
      dataset.checked = false
      return false
    })
}

/**
 * 根据渲染类型添加数据集到动态渲染数组。
 * @param dataset 渲染的数据集
 * @param fetchCallback 数据集请求参数
 * @param page 渲染数据所在的路由页面
 * @param type 渲染数据的类型
 * @returns
 */
export function addDatasetByRenderingType(
  dataset: VcDataset,
  fetchingMethod: VcDatasetGetMethod,
  page: string,
  type?: string
) {
  dataset.loading = true
  if (!dataset.children?.length) {
    try {
      return fetchDatasetList(dataset, fetchingMethod).then(flag => {
        if (flag) {
          return addRenderDataset(dataset, page, type)
        }
      })
    } catch (error) {
      logger.error(
        `添加渲染数据集失败，原因：数据请求发生错误。数据集id: ${dataset.id}，数据集名称: ${dataset.name}`,
        '数据模型：',
        dataset
      )
      dataset.loading = false
      dataset.checked = false
      return
    }
  } else {
    return Promise.resolve(addRenderDataset(dataset, page, type))
  }
}

/**
 * 添加渲染数据源。
 * @param {*} dataset
 * @param {*} page
 * @param {*} type
 * @returns
 */
const addRenderDataset = (dataset: VcDataset, page: string, type: string) => {
  dataset.cesiumObjects = dataset.cesiumObjects || []
  const renderData: VcRenderData = {
    id: dataset.id,
    name: dataset.name,
    page,
    type,
    datasets: []
  }

  const renderingApi = 'entity'

  let entities: Array<
    VcEntityProps & {
      feature: VcFeature
    }
  > = [] // 实体集合

  if (dataset.renderingType === 'tileset') {
    for (let i = 0; i < dataset.children.length; i++) {
      const feature = dataset.children[i]
      const properties = feature.properties
      properties.datasetId = dataset.id
      const props =
        dataset.props && isPlainObject(dataset?.props)
          ? dataset?.props
          : dataset.props
          ? JSON.parse(dataset?.props)
          : {}

      const vcProps = Object.assign(
        {},
        props[dataset.renderingType],
        feature.properties?.props?.[dataset.renderingType]
      )

      feature.properties.actualRenderingType = dataset.renderingType

      renderData.datasets.push({
        cmpName: 'VcPrimitiveTileset',
        props: {
          ...vcProps,
          show: toRef(feature.properties, 'checked'),
          maximumMemoryUsage: 128,
          maximumScreenSpaceError: 64,
          onReady: () => {
            dataset.loading = false
          }
        } as VcPrimitiveTilesetProps
      })
    }

    addRenderDatas(renderData)
  } else {
    for (let i = 0; i < dataset.children.length; i++) {
      const feature = dataset.children[i]
      const properties = feature.properties
      properties.datasetId = dataset.id
      const props =
        dataset.props && isPlainObject(dataset?.props)
          ? dataset?.props
          : dataset.props
          ? JSON.parse(dataset?.props)
          : {}
      const models = processVcEntityModels(feature, props)
      if (typeof models === 'string') {
        continue
      }
      const intersections = intersectionWith(models, entities, (arrVal: any, othVal: any) => {
        return (
          arrVal.feature.properties.id === othVal.feature.properties.id &&
          arrVal.feature.geometry.type === othVal.feature.geometry.type
        )
      })
      entities.push(...models)
      if (intersections.length) {
        intersections.forEach(intersection => {
          logger.warn(
            `已添加相同id和类型的渲染数据集，可能有重复数据，请核实。对象 id: ${intersection.feature.properties.id}，对象类型: ${intersection.feature.geometry.type}`,
            '数据模型：',
            intersection
          )
        })
        // 去重
        entities = uniqWith(entities, (arrVal: any, othVal: any) => {
          return (
            arrVal.feature.properties.id === othVal.feature.properties.id &&
            arrVal.feature.geometry.type === othVal.feature.geometry.type
          )
        })
      }
    }

    if (renderingApi === 'entity') {
      entities.length &&
        renderData.datasets.push({
          cmpName: 'VcDatasourceCustom',
          props: {
            entities,
            onReady: ({ cesiumObject }) => {
              const id = `VcDatasourceCustom_${dataset.id}`
              cesiumObject.datasetId = id
              const findResult = find(dataset.cesiumObjects, v => v.datasetId === id)
              !findResult && dataset.cesiumObjects.push(markRaw(cesiumObject))
              dataset.loading = false
            }
          }
        })
    } else if (renderingApi === 'primitive') {
      //
    }

    addRenderDatas(renderData)
  }

  return true
}
