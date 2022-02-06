/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-11-17 23:52:31
 * @LastEditTime: 2022-02-06 23:12:03
 * @LastEditors: zouyaoji
 * @Description: 为 GeoJSON 数据生成  entity api 数据模型
 * @FilePath: \vue-cesium-demo\src\utils\render-data-model-entity.ts
 */
import { toRef } from 'vue'
import { polygonToLineString, lineStringToPolygon } from '@turf/turf'
import { cloneDeep } from 'lodash'

/**
 * 创建 VcGraphicPoint 组件数据模型
 * @param {*} dataset 数据集
 * @param {*} coordinates 点坐标
 * @param {*} renderingType 渲染类型
 * @param {*} feature 要素
 * @returns 返回支持用 VcGraphicPoint 渲染的模型。
 */
function createVcGraphicPointModel(dataset, coordinates, renderingType, feature) {
  const show = toRef(feature.properties, 'checked')
  const gisshow = JSON.parse(dataset.gisshow) // todo 处理 gisshow 为空的情况
  feature.properties.actualRenderingType = renderingType

  const entity: any = {
    position: coordinates,
    show,
    feature: cloneDeep(feature)
  }
  if (renderingType === 'billboard') {
    entity.billboard = {
      image: '',
      color: '#ffc10',
      scale: 1
    }
  } else {
    entity.point = {
      color: gisshow.giscolor,
      pixelSize: 8
    }
  }
  return entity
}

/**
 * 创建 VcGraphicPolyline 组件数据模型
 * @param {*} dataset 数据集。
 * @param {*} coordinates 线坐标
 * @param {*} renderingType 渲染类型
 * @param {*} feature 要素
 * @returns 返回支持用 VcGraphicPolyline 渲染的模型。
 */
function createVcGraphicPolylineModel(dataset, coordinates, renderingType, feature) {
  const gisshow = JSON.parse(dataset.gisshow) // todo 处理 gisshow 为空的情况
  const show = toRef(feature.properties, 'checked')
  feature.properties.actualRenderingType = renderingType

  if (renderingType === 'polygon') {
    // 线要素 用 VcGraphicPolygon 组件展示
    const featurePolygon = lineStringToPolygon(feature)
    return processPolygon2EntityModel(dataset, featurePolygon, renderingType)
    // return
  } else if (renderingType === 'billboard') {
    // 线要素 用 VcGraphicBillboard 组件展示中心点
    // 要求有中心点字段，目前取的是 feature.properties 有 longitude 和 latitude 字段值
    const entity = {
      show,
      position: [feature.properties.longitude, feature.properties.latitude],
      billboard: {
        image: dataset.iconMapV2,
        color: gisshow.giscolor,
        scale: 1
      },
      feature: cloneDeep(feature)
    }
    return entity
  } else {
    // 线要素 用 VcPolyline 组件展示
    const entity = {
      show,
      polyline: {
        positions: coordinates,
        material: gisshow.giscolor,
        width: gisshow.width
      },
      feature: cloneDeep(feature)
    }
    return entity
  }
}

function createVcGraphicPolygonModel(dataset, coordinates, renderingType, feature) {
  const gisshow = JSON.parse(dataset.gisshow) // todo 处理 gisshow 为空的情况
  const show = toRef(feature.properties, 'checked')
  feature.properties.actualRenderingType = renderingType

  if (renderingType === 'polyline') {
    // 面要素 用 VcGraphicPolyline 组件展示
    // 需要转换一下
    const featureLine = polygonToLineString(feature)
    return processLineString2EntityModel(dataset, featureLine, renderingType)
    // todo
  } else if (renderingType === 'billboard') {
    // 面要素 用 VcGraphicBillboard 展示中心点
    // 要求有中心点字段，目前取的是 feature.properties 有 longitude 和  latitude字段值
    const entity = {
      show,
      position: [feature.properties.longitude, feature.properties.latitude],
      billboard: {
        image: dataset.iconMapV2,
        color: gisshow.giscolor,
        scale: 1
      },
      feature: cloneDeep(feature)
    }
    return entity
  } else {
    // 面要素 用 VcGraphicPolygon 展示
    // 处理岛洞
    const holes = []
    for (let i = 1; i < coordinates.length; i++) {
      holes.push(coordinates[i])
    }

    const entity = {
      show,
      polygon: {
        hierarchy: {
          positions: coordinates[0],
          holes
        },
        material: gisshow.giscolor,
        height: 0
      },
      feature: cloneDeep(feature)
    }
    return entity
  }
}

/**
 * 将 GeoJSON Point 数据处理成 Entiy API 数据模型。
 * @param {*} dataset 数据集模型
 * @param {*} feature 要素
 * @param {*} renderingType 渲染类型
 * @returns
 */
export function processPoint2EntityModel(dataset, feature, renderingType) {
  return createVcGraphicPointModel(dataset, feature.geometry.coordinates, renderingType, feature)
}

/**
 * 将 GeoJSON Point 数据处理成 Entiy API 数据模型。
 * @param {*} dataset 数据集模型
 * @param {*} feature 要素
 * @param {*} renderingType 渲染类型
 * @returns
 */
export function processMultiPoint2EntityModel(dataset, feature, renderingType) {
  const models = []
  const coordinates = feature.geometry.coordinates
  for (let i = 0; i < coordinates.length; i++) {
    models.push(createVcGraphicPointModel(dataset, coordinates[i], renderingType, feature))
  }

  return models
}

/**
 * 将 GeoJSON LineString 数据处理成 Entity API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processLineString2EntityModel(dataset, feature, renderingType) {
  return createVcGraphicPolylineModel(dataset, feature.geometry.coordinates, renderingType, feature)
}

/**
 * 将 GeoJSON MultiLineString 数据处理成 Entity API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processMultiLineString2EntityModel(dataset, feature, renderingType) {
  const models = []
  const lineStrings = feature.geometry.coordinates
  for (let i = 0; i < lineStrings.length; i++) {
    models.push(createVcGraphicPolylineModel(dataset, lineStrings[i], renderingType, feature))
  }
  return models
}

/**
 * 将 GeoJSON Polygon 数据处理成 Entity API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processPolygon2EntityModel(dataset, feature, renderingType) {
  return createVcGraphicPolygonModel(dataset, feature.geometry.coordinates, renderingType, feature)
}

/**
 * 将 GeoJSON MultiPolygon 数据处理成 Entity API 数据模型。
 * @param {*} dataset
 * @param {*} feature
 * @param {*} renderingType
 * @returns
 */
export function processMultiPolygon2EntityModel(dataset, feature, renderingType) {
  const models = []
  const lineStrings = feature.geometry.coordinates
  for (let i = 0; i < lineStrings.length; i++) {
    models.push(createVcGraphicPolygonModel(dataset, lineStrings[i], renderingType, feature))
  }
  return models
}
