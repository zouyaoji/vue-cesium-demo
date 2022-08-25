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

define(['./defaultValue-4607806f', './Matrix2-46dc0d7f', './arrayRemoveDuplicates-1f0fa8fd', './BoundingRectangle-41860583', './Transforms-fc8266a1', './ComponentDatatype-1ef49b14', './PolylineVolumeGeometryLibrary-52ea7e9d', './RuntimeError-cef79f54', './GeometryAttribute-0c65674d', './GeometryAttributes-acac33d2', './IndexDatatype-790b4297', './PolygonPipeline-8d44637f', './_commonjsHelpers-a32ac251', './combine-fc59ba59', './WebGLConstants-f100e3dd', './EllipsoidTangentPlane-daffc3d5', './AxisAlignedBoundingBox-8c885262', './IntersectionTests-f3daffbb', './Plane-e8eab25b', './PolylinePipeline-043c23e2', './EllipsoidGeodesic-70578277', './EllipsoidRhumbLine-c4e2c591'], (function (defaultValue, Matrix2, arrayRemoveDuplicates, BoundingRectangle, Transforms, ComponentDatatype, PolylineVolumeGeometryLibrary, RuntimeError, GeometryAttribute, GeometryAttributes, IndexDatatype, PolygonPipeline, _commonjsHelpers, combine, WebGLConstants, EllipsoidTangentPlane, AxisAlignedBoundingBox, IntersectionTests, Plane, PolylinePipeline, EllipsoidGeodesic, EllipsoidRhumbLine) { 'use strict';

  function computeAttributes(positions, shape) {
    const attributes = new GeometryAttributes.GeometryAttributes();
    attributes.position = new GeometryAttribute.GeometryAttribute({
      componentDatatype: ComponentDatatype.ComponentDatatype.DOUBLE,
      componentsPerAttribute: 3,
      values: positions,
    });

    const shapeLength = shape.length;
    const vertexCount = attributes.position.values.length / 3;
    const positionLength = positions.length / 3;
    const shapeCount = positionLength / shapeLength;
    const indices = IndexDatatype.IndexDatatype.createTypedArray(
      vertexCount,
      2 * shapeLength * (shapeCount + 1)
    );
    let i, j;
    let index = 0;
    i = 0;
    let offset = i * shapeLength;
    for (j = 0; j < shapeLength - 1; j++) {
      indices[index++] = j + offset;
      indices[index++] = j + offset + 1;
    }
    indices[index++] = shapeLength - 1 + offset;
    indices[index++] = offset;

    i = shapeCount - 1;
    offset = i * shapeLength;
    for (j = 0; j < shapeLength - 1; j++) {
      indices[index++] = j + offset;
      indices[index++] = j + offset + 1;
    }
    indices[index++] = shapeLength - 1 + offset;
    indices[index++] = offset;

    for (i = 0; i < shapeCount - 1; i++) {
      const firstOffset = shapeLength * i;
      const secondOffset = firstOffset + shapeLength;
      for (j = 0; j < shapeLength; j++) {
        indices[index++] = j + firstOffset;
        indices[index++] = j + secondOffset;
      }
    }

    const geometry = new GeometryAttribute.Geometry({
      attributes: attributes,
      indices: IndexDatatype.IndexDatatype.createTypedArray(vertexCount, indices),
      boundingSphere: Transforms.BoundingSphere.fromVertices(positions),
      primitiveType: GeometryAttribute.PrimitiveType.LINES,
    });

    return geometry;
  }

  /**
   * A description of a polyline with a volume (a 2D shape extruded along a polyline).
   *
   * @alias PolylineVolumeOutlineGeometry
   * @constructor
   *
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3[]} options.polylinePositions An array of positions that define the center of the polyline volume.
   * @param {Cartesian2[]} options.shapePositions An array of positions that define the shape to be extruded along the polyline
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
   * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
   * @param {CornerType} [options.cornerType=CornerType.ROUNDED] Determines the style of the corners.
   *
   * @see PolylineVolumeOutlineGeometry#createGeometry
   *
   * @example
   * function computeCircle(radius) {
   *   const positions = [];
   *   for (let i = 0; i < 360; i++) {
   *     const radians = Cesium.Math.toRadians(i);
   *     positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
   *   }
   *   return positions;
   * }
   *
   * const volumeOutline = new Cesium.PolylineVolumeOutlineGeometry({
   *   polylinePositions : Cesium.Cartesian3.fromDegreesArray([
   *     -72.0, 40.0,
   *     -70.0, 35.0
   *   ]),
   *   shapePositions : computeCircle(100000.0)
   * });
   */
  function PolylineVolumeOutlineGeometry(options) {
    options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);
    const positions = options.polylinePositions;
    const shape = options.shapePositions;

    //>>includeStart('debug', pragmas.debug);
    if (!defaultValue.defined(positions)) {
      throw new RuntimeError.DeveloperError("options.polylinePositions is required.");
    }
    if (!defaultValue.defined(shape)) {
      throw new RuntimeError.DeveloperError("options.shapePositions is required.");
    }
    //>>includeEnd('debug');

    this._positions = positions;
    this._shape = shape;
    this._ellipsoid = Matrix2.Ellipsoid.clone(
      defaultValue.defaultValue(options.ellipsoid, Matrix2.Ellipsoid.WGS84)
    );
    this._cornerType = defaultValue.defaultValue(options.cornerType, PolylineVolumeGeometryLibrary.CornerType.ROUNDED);
    this._granularity = defaultValue.defaultValue(
      options.granularity,
      ComponentDatatype.CesiumMath.RADIANS_PER_DEGREE
    );
    this._workerName = "createPolylineVolumeOutlineGeometry";

    let numComponents = 1 + positions.length * Matrix2.Cartesian3.packedLength;
    numComponents += 1 + shape.length * Matrix2.Cartesian2.packedLength;

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    this.packedLength = numComponents + Matrix2.Ellipsoid.packedLength + 2;
  }

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {PolylineVolumeOutlineGeometry} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  PolylineVolumeOutlineGeometry.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    if (!defaultValue.defined(value)) {
      throw new RuntimeError.DeveloperError("value is required");
    }
    if (!defaultValue.defined(array)) {
      throw new RuntimeError.DeveloperError("array is required");
    }
    //>>includeEnd('debug');

    startingIndex = defaultValue.defaultValue(startingIndex, 0);

    let i;

    const positions = value._positions;
    let length = positions.length;
    array[startingIndex++] = length;

    for (i = 0; i < length; ++i, startingIndex += Matrix2.Cartesian3.packedLength) {
      Matrix2.Cartesian3.pack(positions[i], array, startingIndex);
    }

    const shape = value._shape;
    length = shape.length;
    array[startingIndex++] = length;

    for (i = 0; i < length; ++i, startingIndex += Matrix2.Cartesian2.packedLength) {
      Matrix2.Cartesian2.pack(shape[i], array, startingIndex);
    }

    Matrix2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
    startingIndex += Matrix2.Ellipsoid.packedLength;

    array[startingIndex++] = value._cornerType;
    array[startingIndex] = value._granularity;

    return array;
  };

  const scratchEllipsoid = Matrix2.Ellipsoid.clone(Matrix2.Ellipsoid.UNIT_SPHERE);
  const scratchOptions = {
    polylinePositions: undefined,
    shapePositions: undefined,
    ellipsoid: scratchEllipsoid,
    height: undefined,
    cornerType: undefined,
    granularity: undefined,
  };

  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {PolylineVolumeOutlineGeometry} [result] The object into which to store the result.
   * @returns {PolylineVolumeOutlineGeometry} The modified result parameter or a new PolylineVolumeOutlineGeometry instance if one was not provided.
   */
  PolylineVolumeOutlineGeometry.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defaultValue.defined(array)) {
      throw new RuntimeError.DeveloperError("array is required");
    }
    //>>includeEnd('debug');

    startingIndex = defaultValue.defaultValue(startingIndex, 0);

    let i;

    let length = array[startingIndex++];
    const positions = new Array(length);

    for (i = 0; i < length; ++i, startingIndex += Matrix2.Cartesian3.packedLength) {
      positions[i] = Matrix2.Cartesian3.unpack(array, startingIndex);
    }

    length = array[startingIndex++];
    const shape = new Array(length);

    for (i = 0; i < length; ++i, startingIndex += Matrix2.Cartesian2.packedLength) {
      shape[i] = Matrix2.Cartesian2.unpack(array, startingIndex);
    }

    const ellipsoid = Matrix2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
    startingIndex += Matrix2.Ellipsoid.packedLength;

    const cornerType = array[startingIndex++];
    const granularity = array[startingIndex];

    if (!defaultValue.defined(result)) {
      scratchOptions.polylinePositions = positions;
      scratchOptions.shapePositions = shape;
      scratchOptions.cornerType = cornerType;
      scratchOptions.granularity = granularity;
      return new PolylineVolumeOutlineGeometry(scratchOptions);
    }

    result._positions = positions;
    result._shape = shape;
    result._ellipsoid = Matrix2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
    result._cornerType = cornerType;
    result._granularity = granularity;

    return result;
  };

  const brScratch = new BoundingRectangle.BoundingRectangle();

  /**
   * Computes the geometric representation of the outline of a polyline with a volume, including its vertices, indices, and a bounding sphere.
   *
   * @param {PolylineVolumeOutlineGeometry} polylineVolumeOutlineGeometry A description of the polyline volume outline.
   * @returns {Geometry|undefined} The computed vertices and indices.
   */
  PolylineVolumeOutlineGeometry.createGeometry = function (
    polylineVolumeOutlineGeometry
  ) {
    const positions = polylineVolumeOutlineGeometry._positions;
    const cleanPositions = arrayRemoveDuplicates.arrayRemoveDuplicates(
      positions,
      Matrix2.Cartesian3.equalsEpsilon
    );
    let shape2D = polylineVolumeOutlineGeometry._shape;
    shape2D = PolylineVolumeGeometryLibrary.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(shape2D);

    if (cleanPositions.length < 2 || shape2D.length < 3) {
      return undefined;
    }

    if (
      PolygonPipeline.PolygonPipeline.computeWindingOrder2D(shape2D) === PolygonPipeline.WindingOrder.CLOCKWISE
    ) {
      shape2D.reverse();
    }
    const boundingRectangle = BoundingRectangle.BoundingRectangle.fromPoints(shape2D, brScratch);

    const computedPositions = PolylineVolumeGeometryLibrary.PolylineVolumeGeometryLibrary.computePositions(
      cleanPositions,
      shape2D,
      boundingRectangle,
      polylineVolumeOutlineGeometry,
      false
    );
    return computeAttributes(computedPositions, shape2D);
  };

  function createPolylineVolumeOutlineGeometry(
    polylineVolumeOutlineGeometry,
    offset
  ) {
    if (defaultValue.defined(offset)) {
      polylineVolumeOutlineGeometry = PolylineVolumeOutlineGeometry.unpack(
        polylineVolumeOutlineGeometry,
        offset
      );
    }
    polylineVolumeOutlineGeometry._ellipsoid = Matrix2.Ellipsoid.clone(
      polylineVolumeOutlineGeometry._ellipsoid
    );
    return PolylineVolumeOutlineGeometry.createGeometry(
      polylineVolumeOutlineGeometry
    );
  }

  return createPolylineVolumeOutlineGeometry;

}));
