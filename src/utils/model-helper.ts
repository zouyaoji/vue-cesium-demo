/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-03-18 10:08:29
 * @LastEditTime: 2022-05-26 14:04:53
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\utils\model-helper.ts
 */

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

const entityModelHandler = {
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

const primitiveModelHandler = {
  // GeometryCollection: processGeometryCollection,
  LineString: processLineString2PrimitiveModel,
  MultiLineString: processMultiLineString2PrimitiveModel,
  MultiPoint: processMultiPoint2PrimitiveModel,
  MultiPolygon: processMultiPolygon2PrimitiveModel,
  Point: processPoint2PrimitiveModel,
  Polygon: processPolygon2PrimitiveModel
  // Topology: processTopology,
}

export { entityModelHandler, primitiveModelHandler }
