/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-10-28 10:19:54
 * @LastEditTime: 2022-01-05 21:27:13
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\render-data.ts
 */

import { markRaw } from 'vue'
import store from '@src/store'
import { find, intersectionWith, uniqWith } from 'lodash'
import * as api from '@src/api'
import * as logger from './logger'
import {
  processPoint2EntityModel,
  processMultiPoint2EntityModel,
  processLineString2EntityModel,
  processMultiLineString2EntityModel,
  processPolygon2EntityModel,
  processMultiPolygon2EntityModel
} from './render-data-model-entity'
import {
  processPoint2PrimitiveModel,
  processMultiPoint2PrimitiveModel,
  processLineString2PrimitiveModel,
  processMultiLineString2PrimitiveModel,
  processPolygon2PrimitiveModel,
  processMultiPolygon2PrimitiveModel
} from './render-data-model-primitive'

const entityGeometryTypes = {
  // GeometryCollection: processGeometryCollection,
  LineString: processLineString2EntityModel,
  MultiLineString: processMultiLineString2EntityModel,
  MultiPoint: processMultiPoint2EntityModel,
  MultiPolygon: processMultiPolygon2EntityModel,
  Point: processPoint2EntityModel,
  Polygon: processPolygon2EntityModel
  // Polygon: processPolygon,
  // Topology: processTopology,
}

const primitiveGeometryTypes = {
  // GeometryCollection: processGeometryCollection,
  LineString: processLineString2PrimitiveModel,
  MultiLineString: processMultiLineString2PrimitiveModel,
  MultiPoint: processMultiPoint2PrimitiveModel,
  MultiPolygon: processMultiPolygon2PrimitiveModel,
  Point: processPoint2PrimitiveModel,
  Polygon: processPolygon2PrimitiveModel
  // Topology: processTopology,
}

/**
 * 添加渲染数据到场景。
 * @param {RenderData|Array<RenderData>} renderDatas 待添加的渲染数据或数据组
 */
export function addRenderDatas (renderDatas) {
  store.commit('viewer/render/addRenderDatas', renderDatas)
}
/**
 * 根据 id 移除渲染数据。
 * @param {string} id 待移除渲染数据的 id
 */
export function removeRenderDataById (id) {
  store.commit('viewer/render/removeRenderDataById', id)
}
/**
 * 根据 type 移除渲染数据。
 * @param {string} type 待移除渲染数据的 type
 */
export function removeRenderDataByType (type) {
  store.commit('viewer/render/removeRenderDataByType', type)
}
/**
 * 根据 type 移除渲染数据。
 * @param {string} type 待移除渲染数据的 type
 */
export function removeRenderDataByPage (page) {
  store.commit('viewer/render/removeRenderDataByPage', page)
}
/**
 * 移除当前所有的渲染数据
 */
export function removeAllRenderData () {
  store.commit('viewer/render/removeAllRenderData')
}
/**
 * 根据 id 获取渲染数据。
 */
export function getRenderDataByDatasetId (id) {
  return store.dispatch('viewer/render/getRenderDataByDatasetId', id)
}
/**
 * 设置当前选中的渲染数据
 * @param {*} renderData
 */
export function setSelectedRenderData (renderData) {
  store.commit('viewer/render/setSelectedRenderData', renderData)
}
/**
 * 清除当前选中的渲染数据
 */
export function clearSelectedRenderData () {
  const selectedRenderData = store.getters['viewer/render/selectedRenderData']
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
 * @param {*} renderingTypeaddDatasetByRenderingType
 * @param {*} datasetId
 * @param {*} featureId
 */
export function highlightRenderData (renderingType, datasetId, featureId) {
  clearSelectedRenderData()
  return getFeatureModel(renderingType, datasetId, featureId).then(model => {
    if (!model) {
      return false
    }

    const renderingApi = store.getters['viewer/render/renderingApi']

    if (renderingType === 'billboard') {
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
        featureInfoListItems: []
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
        featureInfoListItems: []
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
          featureInfoListItems: []
        })
      } else {
        const polygon = model.polygon
        const restoreMaterial = polygon.material || 'white'
        polygon.material = '#ffc107'
        setSelectedRenderData({
          model: polygon,
          renderingType: 'polygon',
          restoreHandler: () => {
            polygon.material = restoreMaterial
          },
          feature: model.feature,
          featureInfoListItems: []
        })
      }
    } else if (renderingType === 'geojson') {
      const polygon = renderingApi === 'primitive' ? model.polygon : model.polygon
    }
  })
}

export function getDatasetModel (renderingType, datasetId) {
  return getRenderDataByDatasetId(datasetId).then(renderData => {
    if (!renderData) {
      return undefined
    }

    if (renderingType === 'billboard') {
      const dataset = find(renderData.datasets, v => v.cmpName === 'VcCollectionBillboard')
      return dataset.props
    } else if (renderingType === 'geojson') {
      const dataset = find(renderData.datasets, v => v.cmpName === 'VcDatasourceGeojson')
      return dataset.props
    }
    return undefined
  })
}

/**
 * 获取渲染要素的数据模型。
 * @param {*} renderingType 渲染类型
 * @param {*} datasetId 数据集 id
 * @param {*} featureId 要素 id
 * @returns
 */
export function getFeatureModel (renderingType, datasetId, featureId) {
  return getRenderDataByDatasetId(datasetId).then(renderData => {
    if (!renderData) {
      return undefined
    }

    const renderingApi = store.getters['viewer/render/renderingApi']
    let cmpName, propName
    switch (renderingType) {
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
  })
}

/**
 * 设置数据源中对象的风格，暂时只针对面对象。
 * @param {*} dataSource
 * @param {*} legends
 */
export function setDataSourceRangeColor (dataSource, feature) {
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
 * 添加渲染数据源。
 * 点、线、面、布告板、热力图
 * @param {*} dataset
 * @param {*} page
 * @param {*} type
 * @returns
 */
const addRenderDataset = (dataset, page, type) => {
  dataset.cesiumObjects = dataset.cesiumObjects || []
  const renderData: any = {
    id: dataset.id,
    name: dataset.name || dataset.text,
    page,
    type,
    datasets: []
  }

  const renderingApi = store.getters['viewer/render/renderingApi']

  const billboards: any = [] // 布告板集合
  const points: any = [] // 点集合
  const polylines: any = [] // 线集合
  const polygons: any = [] // 面集合

  let entities: any = [] // 实体集合
  if (dataset.renderingType === 'heatmap') {
    // 热力图加载逻辑
    const heatmapData = dataset.children[0]
    const rectangle = [heatmapData.left, heatmapData.bottom, heatmapData.right, heatmapData.top]
    const length = renderData.datasets.push({
      cmpName: 'VcOverlayHeatmap',
      props: {
        type: renderingApi,
        max: heatmapData.max,
        min: heatmapData.min,
        rectangle: rectangle,
        segments: [
          [10, '#4A90C3'],
          [20, '#81AAAC'],
          [40, '#B2C899'],
          [60, '#E5EA84'],
          [100, '#F8DE6D'],
          [150, '#EFA451'],
          [200, '#E46C38'],
          [346, '#D53127']
        ],
        options: {
          backgroundColor: 'rgba(0,0,0,0)',
          opacity: 0.8,
          radius: 5,
          maxOpacity: 0.6,
          minOpacity: 0.3,
          blur: 0.75,
          xField: 'x',
          yField: 'y',
          valueField: 'z'
        },
        data: dataset.children[0].data,
        onReady: () => {
          const renderDatasetModel = renderData.datasets[length - 1]
          renderDatasetModel.cmpRef.childRef.value.createPromise.then(({ cesiumObject }) => {
            const id = `VcOverlayHeatmap_${dataset.id}`
            cesiumObject.datasetId = id
            const findResult = find(dataset.cesiumObjects, v => v.datasetId === id)
            !findResult && dataset.cesiumObjects.push(markRaw(cesiumObject))
            dataset.loading = false
          })
        }
      }
    })

    addRenderDatas(renderData)
  } else {
    for (let i = 0; i < dataset.children.length; i++) {
      const feature = dataset.children[i]
      // 点线面布告板加载逻辑
      if (!Cesium.defined(feature.geometry)) {
        logger.warn('feature.geometry is required.')
        continue
      }

      const geometryType = feature.geometry.type
      const properties = feature.properties
      properties.datasetId = dataset.id
      const renderingTypes = properties?.renderingType?.trim().split(',')
      if (!renderingTypes || !renderingTypes.length) {
        logger.error(
          `添加渲染数据集失败，原因：未知的显示类型。数据集id: ${dataset.id}，数据集name: ${dataset.name}`,
          '数据模型：',
          dataset
        )
        dataset.loading = false
        return false
      }

      for (let j = 0; j < renderingTypes.length; j++) {
        const renderingType = renderingTypes[j]

        const geometryHandler =
          renderingApi === 'entity' ? entityGeometryTypes[geometryType] : primitiveGeometryTypes[geometryType]
        if (!Cesium.defined(geometryHandler)) {
          logger.warn('Unknown geometry type: ' + geometryType)
          continue
        }

        const result = geometryHandler(dataset, feature, renderingType)
        const results: any = Array.isArray(result) ? result : [result]

        if (renderingApi === 'entity') {
          const intersections = intersectionWith(results, entities, (arrVal, othVal) => {
            return (
              arrVal.feature.properties.id === othVal.feature.properties.id &&
              arrVal.feature.geometry.type === othVal.feature.geometry.type
            )
          })
          entities.push(...results)
          if (intersections.length) {
            intersections.forEach(intersection => {
              logger.warn(
                `已添加相同id和类型的渲染数据集，可能有重复数据，请核实。对象 id: ${intersection.feature.properties.id}，对象类型: ${intersection.feature.geometry.type}`,
                '数据模型：',
                intersection
              )
            })
            // 去重
            entities = uniqWith(entities, (arrVal, othVal) => {
              return (
                arrVal.feature.properties.id === othVal.feature.properties.id &&
                arrVal.feature.geometry.type === othVal.feature.geometry.type
              )
            })
          }
        } else if (renderingApi === 'primitive') {
          switch (geometryType) {
            case 'Point':
              if (renderingType === 'billboard') {
                billboards.push(...results)
              } else {
                points.push(...results)
              }
              break
            case 'LineString':
              polylines.push(...results)
              break
            case 'Polygon':
              if (renderingType === 'polyline') {
                polylines.push(...results)
              } else if (renderingType === 'billboard') {
                billboards.push(...results)
              } else {
                polygons.push(...results)
              }
              break
            default:
              break
          }
        }
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
      billboards.length &&
        renderData.datasets.push({
          cmpName: 'VcCollectionBillboard',
          props: {
            billboards,
            onReady: ({ cesiumObject }) => {
              const id = `VcCollectionBillboard_${dataset.id}`
              cesiumObject.datasetId = id
              const findResult = find(dataset.cesiumObjects, v => v.datasetId === id)
              !findResult && dataset.cesiumObjects.push(markRaw(cesiumObject))
              dataset.loading = false
            }
          }
        })

      points.length &&
        renderData.datasets.push({
          cmpName: 'VcCollectionPoint',
          props: {
            points,
            onReady: ({ cesiumObject }) => {
              const id = `VcCollectionPoint_${dataset.id}`
              cesiumObject.datasetId = id
              const findResult = find(dataset.cesiumObjects, v => v.datasetId === id)
              !findResult && dataset.cesiumObjects.push(markRaw(cesiumObject))
              dataset.loading = false
            }
          }
        })

      polylines.length &&
        renderData.datasets.push({
          cmpName: 'VcCollectionPolyline',
          props: {
            polylines,
            onReady: ({ cesiumObject }) => {
              cesiumObject.datasetId = dataset.id
              const id = `VcCollectionPolyline_${dataset.id}`
              cesiumObject.datasetId = id
              const findResult = find(dataset.cesiumObjects, v => v.datasetId === id)
              !findResult && dataset.cesiumObjects.push(markRaw(cesiumObject))
              dataset.loading = false
            }
          }
        })

      polygons.length &&
        renderData.datasets.push({
          cmpName: 'VcCollectionPrimitive',
          props: {
            polygons: polygons,
            onReady: ({ cesiumObject }) => {
              const id = `VcCollectionPrimitive_${dataset.id}`
              cesiumObject.datasetId = id
              const findResult = find(dataset.cesiumObjects, v => v.datasetId === id)
              !findResult && dataset.cesiumObjects.push(markRaw(cesiumObject))
              dataset.loading = false
            }
          }
        })
    }

    addRenderDatas(renderData)
  }
  return true
}
/**
 * 根据渲染类型添加数据集到动态渲染数组。
 * @param {*} dataset
 * @param {*} fetchOpts
 * @returns
 */
export function addDatasetByRenderingType (dataset, fetchOpts, page, type) {
  dataset.loading = true
  if (!dataset.children.length) {
    if (dataset.fetchStr === null || dataset.fetchStr === '' || dataset.fetchStr === undefined) {
      logger.error(
        `添加渲染数据集失败，原因：数据请求地址不正确。数据集id: ${dataset.id}，数据集name: ${dataset.name}`,
        '数据模型：',
        dataset
      )
      dataset.loading = false
      dataset.check = false
      return
    }
    const { methodName, queryParams } = fetchOpts
    return api.system[methodName](dataset.fetchStr, queryParams)
      .then(res => {
        if (res.code !== 0) {
          logger.error(`添加渲染数据集失败，原因：数据请求失败。数据集id: ${dataset.id}，数据集name: ${dataset.name}`)
          dataset.loading = false
          dataset.check = false
          return
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
                break
              default:
                logger.error(
                  `添加渲染数据集失败，原因：未知的 GeoJSON 类型。数据集id: ${dataset.id}，数据集name: ${dataset.name}`
                )
                dataset.loading = false
                dataset.check = false
                return
            }
          } else if (dataset.renderingType === 'heatmap') {
            // 人口分布的热力图
            dataset.children = [res.data]
          }
        } else {
          logger.error(
            `添加渲染数据集失败，原因：未知的 GeoJSON 类型。数据集id: ${dataset.id}，数据集name: ${dataset.name}`
          )
          dataset.loading = false
          dataset.check = false
          return
        }
        return addRenderDataset(dataset, page, type)
      })
      .catch(e => {
        logger.error('添加渲染数据集失败，原因：数据请求异常。', e)
        dataset.loading = false
        dataset.check = false
      })
  } else {
    return Promise.resolve(addRenderDataset(dataset, page, type))
  }
}
