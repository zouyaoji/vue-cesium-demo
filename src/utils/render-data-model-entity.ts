/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-11-17 23:52:31
 * @LastEditTime: 2022-10-20 01:12:40
 * @LastEditors: zouyaoji
 * @Description: 为 GeoJSON 数据生成  entity api 数据模型
 * @FilePath: \vue-cesium-demo\src\utils\render-data-model-entity.ts
 */
import { toRef } from 'vue'
import type { Position, Polygon, MultiPolygon, Properties, Feature, FeatureCollection, LineString } from '@turf/turf'
import { polygonToLineString, lineStringToPolygon, centroid, centerOfMass } from '@turf/turf'
import { cloneDeep } from 'lodash'
import { VcFeature } from '@src/types/render-data'
import { VcEntityProps } from 'vue-cesium'
import { isPlainObject } from 'vue-cesium/es/utils/util'
import { makeCartesian3 } from 'vue-cesium/es/utils/cesium-helpers'

/**
 * 将 Point 类型的 GeoJSON 数据处理为 Cesium.Entity 数据模型。
 * @param props 渲染参数
 * @param feature 要素
 * @param renderingType 渲染类型
 * @returns
 */
export function processPoint2EntityModel(props, feature, renderingType) {
  return createVcGraphicPointModel(props, feature.geometry.coordinates, renderingType, feature)
}

/**
 * 将 MultiPoint 类型的 GeoJSON 数据处理为 Cesium.Entity 数据模型。
 * @param props 渲染参数
 * @param feature 要素
 * @param renderingType 渲染类型
 * @returns
 */
export function processMultiPoint2EntityModel(props, feature, renderingType) {
  const models = []
  const coordinates = feature.geometry.coordinates
  for (let i = 0; i < coordinates.length; i++) {
    models.push(createVcGraphicPointModel(props, coordinates[i], renderingType, feature))
  }

  return models
}

/**
 * 将 LineString 类型的 GeoJSON 数据处理为 Cesium.Entity 数据模型。
 * @param props 渲染参数
 * @param feature 要素
 * @param renderingType 渲染类型
 * @returns
 */
export function processLineString2EntityModel(props, feature, renderingType) {
  return createVcGraphicPolylineModel(props, feature.geometry.coordinates, renderingType, feature)
}

/**
 * 将 MultiLineString 类型的 GeoJSON 数据处理为 Cesium.Entity 数据模型。
 * @param props 渲染参数
 * @param feature 要素
 * @param renderingType 渲染类型
 * @returns
 */
export function processMultiLineString2EntityModel(props, feature, renderingType) {
  const models = []
  const lineStrings = feature.geometry.coordinates
  for (let i = 0; i < lineStrings.length; i++) {
    models.push(createVcGraphicPolylineModel(props, lineStrings[i], renderingType, feature))
  }
  return models
}

/**
 * 将 Polygon 类型的 GeoJSON 数据处理为 Cesium.Entity 数据模型。
 * @param props 渲染参数
 * @param feature 要素
 * @param renderingType 渲染类型
 * @returns
 */
export function processPolygon2EntityModel(props, feature, renderingType) {
  return createVcGraphicPolygonModel(props, feature.geometry.coordinates, renderingType, feature)
}

/**
 * 将 MultiPolygon 类型的 GeoJSON 数据处理为 Cesium.Entity 数据模型。
 * @param props 渲染参数
 * @param feature 要素
 * @param renderingType 渲染类型
 * @returns
 */
export function processMultiPolygon2EntityModel(props, feature, renderingType) {
  const models = []
  const polygons = feature.geometry.coordinates
  for (let i = 0; i < polygons.length; i++) {
    const result = createVcGraphicPolygonModel(props, polygons[i], renderingType, feature)
    const results = Array.isArray(result) ? result : [result]
    models.push(...results)
  }
  return models
}

/**
 * 创建 Point 类型的 GeoJSON 数据渲染模型。可以渲染为 point, billboard, label。
 * @param props
 * @param coordinates
 * @param renderingType
 * @param feature
 * @returns
 */
function createVcGraphicPointModel(
  props: VcEntityProps,
  coordinates: Position,
  renderingType: string,
  feature: VcFeature
) {
  const show = Cesium.defined(feature.properties.checked) ? toRef(feature.properties, 'checked') : true
  feature.properties.actualRenderingType = renderingType

  const entityModel: any = {
    id: Cesium.createGuid(),
    position: coordinates,
    show: show,
    feature: cloneDeep(feature)
  }

  // const childProps = feature.properties?.props
  // const childPropsR = childProps && isPlainObject(childProps) ? childProps : childProps ? JSON.parse(childProps) : {}
  // const vcProps = Object.assign({}, props[renderingType], childPropsR[renderingType])
  entityModel[renderingType] = {
    ...props[renderingType]
  }

  if (renderingType === 'model') {
    const hprOpts = JSON.parse(feature.properties?.hpr || '{}')
    if (Array.isArray(hprOpts)) {
      const position = makeCartesian3(coordinates) as Cesium.Cartesian3
      const hpr = new Cesium.HeadingPitchRoll(...hprOpts)
      entityModel.orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)
    }
  }
  return entityModel
}

/**
 * 创建 LineString 类型的 GeoJSON 数据渲染模型。可以渲染为 polyline, polygon, point, billboard, label。
 * @param props
 * @param coordinates
 * @param renderingType
 * @param feature
 * @returns
 */
function createVcGraphicPolylineModel(
  props: VcEntityProps,
  coordinates: Position[],
  renderingType: string,
  feature: VcFeature
) {
  const show = toRef(feature.properties, 'checked')
  feature.properties.actualRenderingType = renderingType

  if (renderingType === 'polygon') {
    const featurePolygon = lineStringToPolygon(feature as Feature<LineString, Properties>)
    return processPolygon2EntityModel(props, featurePolygon, renderingType)
  } else if (renderingType === 'billboard' || renderingType === 'point' || renderingType === 'label') {
    // 计算中心点
    const center = feature.geometry.type === 'MultiPolygon' ? centroid(feature) : centerOfMass(feature)
    const entity: any = {
      show,
      position: center.geometry.coordinates,
      feature: cloneDeep(feature)
    }
    switch (renderingType) {
      case 'billboard': {
        // const billboardProps = Object.assign({}, props.billboard, feature.properties?.props?.billboard)
        entity.billboard = {
          ...props.billboard
        }
        break
      }
      case 'point': {
        // const pointProps = Object.assign({}, props.point, feature.properties?.props?.point)
        entity.point = {
          ...props.point
        }
        break
      }
      case 'label': {
        // const labelProps = Object.assign({}, props.label, feature.properties?.props?.label)
        entity.label = {
          text: feature.properties.text || feature.properties.name,
          ...props.label
        }
      }
    }

    return entity
  } else {
    // const polylineProps = Object.assign({}, props.polyline, feature.properties?.props?.polyline)

    const entity = {
      show,
      polyline: {
        positions: coordinates,
        ...props.polyline
      },
      feature: cloneDeep(feature)
    }
    return entity
  }
}

/**
 * 创建 Polygon 类型的 GeoJSON 数据渲染模型。可以渲染为 polyline, polygon, point, billboard, label。
 * @param props
 * @param coordinates
 * @param renderingType
 * @param feature
 * @returns
 */
function createVcGraphicPolygonModel(
  props: VcEntityProps,
  coordinates: Position[][] | Position[][][],
  renderingType: string,
  feature: VcFeature
) {
  const show = toRef(feature.properties, 'checked')
  feature.properties.actualRenderingType = renderingType

  if (renderingType === 'polyline') {
    // 面对象渲染成线对象，需要转换一下
    // MultiPolygon 会得到 FeatureCollection
    // Polygon 返回 Feature
    if (feature.geometry.type === 'MultiPolygon') {
      const featureCollection = polygonToLineString(feature as Feature<MultiPolygon, Properties>) as FeatureCollection
      const models = []
      featureCollection.features.forEach(featureLine => {
        if (featureLine.geometry.type === 'LineString') {
          models.push(processLineString2EntityModel(props, featureLine, renderingType))
        } else {
          models.push(...processMultiLineString2EntityModel(props, featureLine, renderingType))
        }
      })

      return models
    } else if (feature.geometry.type === 'Polygon') {
      // Todo 待测试
      const featureLine = polygonToLineString(feature as Feature<Polygon, Properties>)
      return processLineString2EntityModel(props, featureLine, renderingType)
    }
  } else if (renderingType === 'polygon') {
    // 处理岛洞
    const holes = []
    for (let i = 1; i < coordinates.length; i++) {
      holes.push({
        positions: coordinates[i]
      })
    }
    // const polygonProps = Object.assign({}, props.polygon, feature.properties?.props?.polygon)
    const entity = {
      show,
      polygon: {
        height: 0,
        hierarchy: {
          positions: coordinates[0],
          holes
        },
        ...props.polygon
      },
      feature: cloneDeep(feature)
    }
    return entity
  } else if (renderingType === 'billboard' || renderingType === 'point' || renderingType === 'label') {
    // 计算中心点
    const center = feature.geometry.type === 'MultiPolygon' ? centroid(feature) : centerOfMass(feature)
    const entity: any = {
      show,
      position: center.geometry.coordinates,
      feature: cloneDeep(feature)
    }
    switch (renderingType) {
      case 'billboard': {
        // const billboardProps = Object.assign({}, props.billboard, feature.properties?.props?.billboard)
        entity.billboard = {
          ...props.billboard
        }
        break
      }
      case 'point': {
        // const pointProps = Object.assign({}, props.point, feature.properties?.props?.point)
        entity.point = {
          ...props.point
        }
        break
      }
      case 'label': {
        // const labelProps = Object.assign({}, props.label, feature.properties?.props?.label)
        entity.label = {
          text: feature.properties.text || feature.properties.name,
          ...props.label
        }
      }
    }

    return entity
  }
}
