/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.96
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(['./arrayRemoveDuplicates-1f0fa8fd', './Transforms-fc8266a1', './Matrix2-46dc0d7f', './RuntimeError-cef79f54', './ComponentDatatype-1ef49b14', './CoplanarPolygonGeometryLibrary-392b179d', './defaultValue-4607806f', './GeometryAttribute-0c65674d', './GeometryAttributes-acac33d2', './GeometryInstance-a75a729d', './GeometryPipeline-e00ed69b', './IndexDatatype-790b4297', './PolygonGeometryLibrary-c4474e3f', './_commonjsHelpers-a32ac251', './combine-fc59ba59', './WebGLConstants-f100e3dd', './OrientedBoundingBox-7072d624', './EllipsoidTangentPlane-daffc3d5', './AxisAlignedBoundingBox-8c885262', './IntersectionTests-f3daffbb', './Plane-e8eab25b', './AttributeCompression-e3844002', './EncodedCartesian3-67ce8bc4', './ArcType-f5af12f9', './EllipsoidRhumbLine-c4e2c591', './PolygonPipeline-8d44637f'], (function (arrayRemoveDuplicates, Transforms, Matrix2, RuntimeError, ComponentDatatype, CoplanarPolygonGeometryLibrary, defaultValue, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryPipeline, IndexDatatype, PolygonGeometryLibrary, _commonjsHelpers, combine, WebGLConstants, OrientedBoundingBox, EllipsoidTangentPlane, AxisAlignedBoundingBox, IntersectionTests, Plane, AttributeCompression, EncodedCartesian3, ArcType, EllipsoidRhumbLine, PolygonPipeline) { 'use strict';

  function createGeometryFromPositions(positions) {
    const length = positions.length;
    const flatPositions = new Float64Array(length * 3);
    const indices = IndexDatatype.IndexDatatype.createTypedArray(length, length * 2);

    let positionIndex = 0;
    let index = 0;

    for (let i = 0; i < length; i++) {
      const position = positions[i];
      flatPositions[positionIndex++] = position.x;
      flatPositions[positionIndex++] = position.y;
      flatPositions[positionIndex++] = position.z;

      indices[index++] = i;
      indices[index++] = (i + 1) % length;
    }

    const attributes = new GeometryAttributes.GeometryAttributes({
      position: new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: flatPositions,
      }),
    });

    return new GeometryAttribute.Geometry({
      attributes: attributes,
      indices: indices,
      primitiveType: GeometryAttribute.PrimitiveType.LINES,
    });
  }

  /**
   * A description of the outline of a polygon composed of arbitrary coplanar positions.
   *
   * @alias CoplanarPolygonOutlineGeometry
   * @constructor
   *
   * @param {Object} options Object with the following properties:
   * @param {PolygonHierarchy} options.polygonHierarchy A polygon hierarchy that can include holes.
   *
   * @see CoplanarPolygonOutlineGeometry.createGeometry
   *
   * @example
   * const polygonOutline = new Cesium.CoplanarPolygonOutlineGeometry({
   *   positions : Cesium.Cartesian3.fromDegreesArrayHeights([
   *      -90.0, 30.0, 0.0,
   *      -90.0, 30.0, 1000.0,
   *      -80.0, 30.0, 1000.0,
   *      -80.0, 30.0, 0.0
   *   ])
   * });
   * const geometry = Cesium.CoplanarPolygonOutlineGeometry.createGeometry(polygonOutline);
   */
  function CoplanarPolygonOutlineGeometry(options) {
    options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);
    const polygonHierarchy = options.polygonHierarchy;
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("options.polygonHierarchy", polygonHierarchy);
    //>>includeEnd('debug');

    this._polygonHierarchy = polygonHierarchy;
    this._workerName = "createCoplanarPolygonOutlineGeometry";

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    this.packedLength =
      PolygonGeometryLibrary.PolygonGeometryLibrary.computeHierarchyPackedLength(
        polygonHierarchy,
        Matrix2.Cartesian3
      ) + 1;
  }

  /**
   * A description of a coplanar polygon outline from an array of positions.
   *
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3[]} options.positions An array of positions that defined the corner points of the polygon.
   * @returns {CoplanarPolygonOutlineGeometry}
   */
  CoplanarPolygonOutlineGeometry.fromPositions = function (options) {
    options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);

    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("options.positions", options.positions);
    //>>includeEnd('debug');

    const newOptions = {
      polygonHierarchy: {
        positions: options.positions,
      },
    };
    return new CoplanarPolygonOutlineGeometry(newOptions);
  };

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {CoplanarPolygonOutlineGeometry} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  CoplanarPolygonOutlineGeometry.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.typeOf.object("value", value);
    RuntimeError.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defaultValue.defaultValue(startingIndex, 0);

    startingIndex = PolygonGeometryLibrary.PolygonGeometryLibrary.packPolygonHierarchy(
      value._polygonHierarchy,
      array,
      startingIndex,
      Matrix2.Cartesian3
    );

    array[startingIndex] = value.packedLength;

    return array;
  };

  const scratchOptions = {
    polygonHierarchy: {},
  };
  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {CoplanarPolygonOutlineGeometry} [result] The object into which to store the result.
   * @returns {CoplanarPolygonOutlineGeometry} The modified result parameter or a new CoplanarPolygonOutlineGeometry instance if one was not provided.
   */
  CoplanarPolygonOutlineGeometry.unpack = function (
    array,
    startingIndex,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defaultValue.defaultValue(startingIndex, 0);

    const polygonHierarchy = PolygonGeometryLibrary.PolygonGeometryLibrary.unpackPolygonHierarchy(
      array,
      startingIndex,
      Matrix2.Cartesian3
    );
    startingIndex = polygonHierarchy.startingIndex;
    delete polygonHierarchy.startingIndex;
    const packedLength = array[startingIndex];

    if (!defaultValue.defined(result)) {
      result = new CoplanarPolygonOutlineGeometry(scratchOptions);
    }

    result._polygonHierarchy = polygonHierarchy;
    result.packedLength = packedLength;

    return result;
  };

  /**
   * Computes the geometric representation of an arbitrary coplanar polygon, including its vertices, indices, and a bounding sphere.
   *
   * @param {CoplanarPolygonOutlineGeometry} polygonGeometry A description of the polygon.
   * @returns {Geometry|undefined} The computed vertices and indices.
   */
  CoplanarPolygonOutlineGeometry.createGeometry = function (polygonGeometry) {
    const polygonHierarchy = polygonGeometry._polygonHierarchy;

    let outerPositions = polygonHierarchy.positions;
    outerPositions = arrayRemoveDuplicates.arrayRemoveDuplicates(
      outerPositions,
      Matrix2.Cartesian3.equalsEpsilon,
      true
    );
    if (outerPositions.length < 3) {
      return;
    }
    const isValid = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.validOutline(outerPositions);
    if (!isValid) {
      return undefined;
    }

    const polygons = PolygonGeometryLibrary.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(
      polygonHierarchy,
      false
    );

    if (polygons.length === 0) {
      return undefined;
    }

    const geometries = [];

    for (let i = 0; i < polygons.length; i++) {
      const geometryInstance = new GeometryInstance.GeometryInstance({
        geometry: createGeometryFromPositions(polygons[i]),
      });
      geometries.push(geometryInstance);
    }

    const geometry = GeometryPipeline.GeometryPipeline.combineInstances(geometries)[0];
    const boundingSphere = Transforms.BoundingSphere.fromPoints(polygonHierarchy.positions);

    return new GeometryAttribute.Geometry({
      attributes: geometry.attributes,
      indices: geometry.indices,
      primitiveType: geometry.primitiveType,
      boundingSphere: boundingSphere,
    });
  };

  function createCoplanarPolygonOutlineGeometry(polygonGeometry, offset) {
    if (defaultValue.defined(offset)) {
      polygonGeometry = CoplanarPolygonOutlineGeometry.unpack(
        polygonGeometry,
        offset
      );
    }
    polygonGeometry._ellipsoid = Matrix2.Ellipsoid.clone(polygonGeometry._ellipsoid);
    return CoplanarPolygonOutlineGeometry.createGeometry(polygonGeometry);
  }

  return createCoplanarPolygonOutlineGeometry;

}));
