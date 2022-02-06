/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-11-17 23:52:31
 * @LastEditTime: 2022-02-06 21:57:05
 * @LastEditors: zouyaoji
 * @Description: 为 GeoJSON 数据生成  entity api 数据模型
 * @FilePath: \vue-cesium-demo\src\utils\render-data-model-primitive.ts
 */
import { toRef } from 'vue'
import { polygonToLineString, lineStringToPolygon } from '@turf/turf'
import { cloneDeep } from 'lodash'

/**
 * 创建 VcPoint 组件数据模型
 * @param {*} dataset 数据集
 * @param {*} coordinates 点坐标
 * @param {*} renderingType 渲染类型
 * @param {*} feature 要素
 * @returns 返回支持用 VcPoint 渲染的模型。
 */
function createVcPointModel(dataset, coordinates, renderingType, feature) {
  const gisshow = JSON.parse(dataset.gisshow) // todo 处理 gisshow 为空的情况
  const show = toRef(feature.properties, 'checked')
  feature.properties.actualRenderingType = renderingType

  if (renderingType === 'billboard') {
    // 点要素 用 VcBillboard 组件展示
    const billboard = {
      position: coordinates,
      image: dataset.iconMapV2,
      color: '#ffc10',
      scale: 1,
      show,
      feature: cloneDeep(feature)
    }
    return billboard
  } else {
    // 点要素 用 VcPoint 组件展示
    const point = {
      position: coordinates,
      color: gisshow.giscolor,
      pixelSize: 8,
      show,
      feature: cloneDeep(feature)
    }
    return point
  }
}
/**
 * 创建 VcPolyline 组件数据模型
 * @param {*} dataset 数据集
 * @param {*} coordinates 线坐标
 * @param {*} renderingType 渲染类型
 * @param {*} feature 要素
 * @returns 返回支持用 VcPolyline 渲染的模型。
 */
function createVcPolylineModel(dataset, coordinates, renderingType, feature) {
  const gisshow = JSON.parse(dataset.gisshow) // todo 处理 gisshow 为空的情况
  const show = toRef(feature.properties, 'checked')
  feature.properties.actualRenderingType = renderingType
  if (renderingType === 'polygon') {
    // 线要素 用 VcPolygon 组件展示
    const featurePolygon = lineStringToPolygon(feature)
    return processPolygon2PrimitiveModel(dataset, featurePolygon, renderingType)
  } else if (renderingType === 'billboard') {
    // 线要素 用 VcBillboard 组件展示中心点
    // 要求有中心点字段，目前取的是 feature.properties 有 longitude 和  latitude字段值
    const billboard = {
      position: [feature.properties.longitude, feature.properties.latitude],
      image: dataset.iconMapV2,
      color: gisshow.giscolor,
      feature: cloneDeep(feature),
      scale: 1,
      show
    }
    return billboard
  } else {
    // 线要素 用 VcPolyline 组件展示
    const polyline = {
      positions: coordinates,
      material: gisshow.giscolor,
      feature: cloneDeep(feature),
      width: gisshow.width,
      show
    }
    return polyline
  }
}

function createVcPolygonModel(dataset, coordinates, renderingType, feature) {
  const gisshow = JSON.parse(dataset.gisshow) // todo 处理 gisshow 为空的情况
  const show = toRef(feature.properties, 'checked')
  feature.properties.actualRenderingType = renderingType
  if (renderingType === 'polyline') {
    // 面要素 用 VcPolyline 展示
    // 需要转换一下
    const featureLine = polygonToLineString(feature)
    return processLineString2PrimitiveModel(dataset, featureLine, renderingType)
  } else if (renderingType === 'billboard') {
    // 面要素 用 VcBillboard 展示中心点
    // 要求有中心点字段，目前取的是 feature.properties 有 longitude 和  latitude字段值
    const billboard = {
      position: [feature.properties.longitude, feature.properties.latitude],
      image: dataset.iconMapV2,
      // color: gisshow.giscolor,
      feature: cloneDeep(feature),
      scale: 1,
      show
    }
    return billboard
  } else {
    // 面要素 用 VcPolygon 展示
    // 处理岛洞
    const holes = []
    for (let i = 1; i < coordinates.length; i++) {
      holes.push(coordinates[i])
    }
    const polygon = {
      show,
      polygonHierarchy: {
        positions: coordinates[0],
        holes
      },
      color: gisshow.giscolor,
      feature: cloneDeep(feature)
    }
    return polygon
  }
}

/**
 * 将 GeoJSON Point 数据处理成 Primitive API 数据模型。
 * @param {*} dataset 数据集模型
 * @param {*} feature 要素
 * @param {*} renderingType 渲染类型
 * @returns
 */
export function processPoint2PrimitiveModel(dataset, feature, renderingType) {
  return createVcPointModel(dataset, feature.geometry.coordinates, renderingType, feature)
}
/**
 * 将 GeoJSON MultiPoint 数据处理成 Primitive API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processMultiPoint2PrimitiveModel(dataset, feature, renderingType) {
  const models = []
  const coordinates = feature.geometry.coordinates
  for (let i = 0; i < coordinates.length; i++) {
    models.push(createVcPointModel(dataset, coordinates[i], renderingType, feature))
  }

  return models
}

/**
 * 将 GeoJSON LineString 数据处理成 Primitive API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processLineString2PrimitiveModel(dataset, feature, renderingType) {
  return createVcPolylineModel(dataset, feature.geometry.coordinates, renderingType, feature)
}

/**
 * 将 GeoJSON MultiLineString 数据处理成 Primitive API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processMultiLineString2PrimitiveModel(dataset, feature, renderingType) {
  const models = []
  const lineStrings = feature.geometry.coordinates
  for (let i = 0; i < lineStrings.length; i++) {
    models.push(createVcPolylineModel(dataset, lineStrings[i], renderingType, feature))
  }
  return models
}

/**
 * 将 GeoJSON Polygon 数据处理成 Primitive API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processPolygon2PrimitiveModel(dataset, feature, renderingType) {
  return createVcPolygonModel(dataset, feature.geometry.coordinates, renderingType, feature)
}

/**
 * 将 GeoJSON MultiPolygon 数据处理成 Primitive API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processMultiPolygon2PrimitiveModel(dataset, feature, renderingType) {
  const models = []
  const lineStrings = feature.geometry.coordinates
  for (let i = 0; i < lineStrings.length; i++) {
    models.push(createVcPolygonModel(dataset, lineStrings[i], renderingType, feature))
  }
  return models
}
