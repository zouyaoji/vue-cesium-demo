/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.95
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

define(['./arrayRemoveDuplicates-1af79ba4', './BoundingRectangle-4974cee9', './Transforms-273eeb44', './Matrix2-9e1c22e2', './RuntimeError-4f8ec8a2', './ComponentDatatype-4eeb6d9b', './CoplanarPolygonGeometryLibrary-ecf852df', './defaultValue-97284df2', './GeometryAttribute-9be2d2e5', './GeometryAttributes-734a3446', './GeometryInstance-3db1d31b', './GeometryPipeline-d7363877', './IndexDatatype-f228f5fd', './PolygonGeometryLibrary-c2f9eee8', './PolygonPipeline-db21de21', './VertexFormat-563ab2cc', './_commonjsHelpers-3aae1032-65601a27', './combine-d11b1f00', './WebGLConstants-6da700a2', './OrientedBoundingBox-a82b3552', './EllipsoidTangentPlane-d42ee682', './AxisAlignedBoundingBox-1aaf78c2', './IntersectionTests-ea138127', './Plane-76b84425', './AttributeCompression-f202be44', './EncodedCartesian3-491ac596', './ArcType-de5d8777', './EllipsoidRhumbLine-7bc7dfce'], (function (arrayRemoveDuplicates, BoundingRectangle, Transforms, Matrix2, RuntimeError, ComponentDatatype, CoplanarPolygonGeometryLibrary, defaultValue, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryPipeline, IndexDatatype, PolygonGeometryLibrary, PolygonPipeline, VertexFormat, _commonjsHelpers3aae1032, combine, WebGLConstants, OrientedBoundingBox, EllipsoidTangentPlane, AxisAlignedBoundingBox, IntersectionTests, Plane, AttributeCompression, EncodedCartesian3, ArcType, EllipsoidRhumbLine) { 'use strict';

  const scratchPosition = new Matrix2.Cartesian3();
  const scratchBR = new BoundingRectangle.BoundingRectangle();
  const stScratch = new Matrix2.Cartesian2();
  const textureCoordinatesOrigin = new Matrix2.Cartesian2();
  const scratchNormal = new Matrix2.Cartesian3();
  const scratchTangent = new Matrix2.Cartesian3();
  const scratchBitangent = new Matrix2.Cartesian3();
  const centerScratch = new Matrix2.Cartesian3();
  const axis1Scratch = new Matrix2.Cartesian3();
  const axis2Scratch = new Matrix2.Cartesian3();
  const quaternionScratch = new Transforms.Quaternion();
  const textureMatrixScratch = new Matrix2.Matrix3();
  const tangentRotationScratch = new Matrix2.Matrix3();
  const surfaceNormalScratch = new Matrix2.Cartesian3();

  function createGeometryFromPolygon(
    polygon,
    vertexFormat,
    boundingRectangle,
    stRotation,
    hardcodedTextureCoordinates,
    projectPointTo2D,
    normal,
    tangent,
    bitangent
  ) {
    const positions = polygon.positions;
    let indices = PolygonPipeline.PolygonPipeline.triangulate(polygon.positions2D, polygon.holes);

    /* If polygon is completely unrenderable, just use the first three vertices */
    if (indices.length < 3) {
      indices = [0, 1, 2];
    }

    const newIndices = IndexDatatype.IndexDatatype.createTypedArray(
      positions.length,
      indices.length
    );
    newIndices.set(indices);

    let textureMatrix = textureMatrixScratch;
    if (stRotation !== 0.0) {
      let rotation = Transforms.Quaternion.fromAxisAngle(
        normal,
        stRotation,
        quaternionScratch
      );
      textureMatrix = Matrix2.Matrix3.fromQuaternion(rotation, textureMatrix);

      if (vertexFormat.tangent || vertexFormat.bitangent) {
        rotation = Transforms.Quaternion.fromAxisAngle(
          normal,
          -stRotation,
          quaternionScratch
        );
        const tangentRotation = Matrix2.Matrix3.fromQuaternion(
          rotation,
          tangentRotationScratch
        );

        tangent = Matrix2.Cartesian3.normalize(
          Matrix2.Matrix3.multiplyByVector(tangentRotation, tangent, tangent),
          tangent
        );
        if (vertexFormat.bitangent) {
          bitangent = Matrix2.Cartesian3.normalize(
            Matrix2.Cartesian3.cross(normal, tangent, bitangent),
            bitangent
          );
        }
      }
    } else {
      textureMatrix = Matrix2.Matrix3.clone(Matrix2.Matrix3.IDENTITY, textureMatrix);
    }

    const stOrigin = textureCoordinatesOrigin;
    if (vertexFormat.st) {
      stOrigin.x = boundingRectangle.x;
      stOrigin.y = boundingRectangle.y;
    }

    const length = positions.length;
    const size = length * 3;
    const flatPositions = new Float64Array(size);
    const normals = vertexFormat.normal ? new Float32Array(size) : undefined;
    const tangents = vertexFormat.tangent ? new Float32Array(size) : undefined;
    const bitangents = vertexFormat.bitangent
      ? new Float32Array(size)
      : undefined;
    const textureCoordinates = vertexFormat.st
      ? new Float32Array(length * 2)
      : undefined;

    let positionIndex = 0;
    let normalIndex = 0;
    let bitangentIndex = 0;
    let tangentIndex = 0;
    let stIndex = 0;

    for (let i = 0; i < length; i++) {
      const position = positions[i];
      flatPositions[positionIndex++] = position.x;
      flatPositions[positionIndex++] = position.y;
      flatPositions[positionIndex++] = position.z;

      if (vertexFormat.st) {
        if (
          defaultValue.defined(hardcodedTextureCoordinates) &&
          hardcodedTextureCoordinates.positions.length === length
        ) {
          textureCoordinates[stIndex++] =
            hardcodedTextureCoordinates.positions[i].x;
          textureCoordinates[stIndex++] =
            hardcodedTextureCoordinates.positions[i].y;
        } else {
          const p = Matrix2.Matrix3.multiplyByVector(
            textureMatrix,
            position,
            scratchPosition
          );
          const st = projectPointTo2D(p, stScratch);
          Matrix2.Cartesian2.subtract(st, stOrigin, st);

          const stx = ComponentDatatype.CesiumMath.clamp(st.x / boundingRectangle.width, 0, 1);
          const sty = ComponentDatatype.CesiumMath.clamp(st.y / boundingRectangle.height, 0, 1);
          textureCoordinates[stIndex++] = stx;
          textureCoordinates[stIndex++] = sty;
        }
      }

      if (vertexFormat.normal) {
        normals[normalIndex++] = normal.x;
        normals[normalIndex++] = normal.y;
        normals[normalIndex++] = normal.z;
      }

      if (vertexFormat.tangent) {
        tangents[tangentIndex++] = tangent.x;
        tangents[tangentIndex++] = tangent.y;
        tangents[tangentIndex++] = tangent.z;
      }

      if (vertexFormat.bitangent) {
        bitangents[bitangentIndex++] = bitangent.x;
        bitangents[bitangentIndex++] = bitangent.y;
        bitangents[bitangentIndex++] = bitangent.z;
      }
    }

    const attributes = new GeometryAttributes.GeometryAttributes();

    if (vertexFormat.position) {
      attributes.position = new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: flatPositions,
      });
    }

    if (vertexFormat.normal) {
      attributes.normal = new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: normals,
      });
    }

    if (vertexFormat.tangent) {
      attributes.tangent = new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: tangents,
      });
    }

    if (vertexFormat.bitangent) {
      attributes.bitangent = new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: bitangents,
      });
    }

    if (vertexFormat.st) {
      attributes.st = new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
        componentsPerAttribute: 2,
        values: textureCoordinates,
      });
    }

    return new GeometryAttribute.Geometry({
      attributes: attributes,
      indices: newIndices,
      primitiveType: GeometryAttribute.PrimitiveType.TRIANGLES,
    });
  }

  /**
   * A description of a polygon composed of arbitrary coplanar positions.
   *
   * @alias CoplanarPolygonGeometry
   * @constructor
   *
   * @param {Object} options Object with the following properties:
   * @param {PolygonHierarchy} options.polygonHierarchy A polygon hierarchy that can include holes.
   * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates, in radians. A positive rotation is counter-clockwise.
   * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
   * @param {PolygonHierarchy} [options.textureCoordinates] Texture coordinates as a {@link PolygonHierarchy} of {@link Cartesian2} points.
   *
   * @example
   * const polygonGeometry = new Cesium.CoplanarPolygonGeometry({
   *  polygonHierarchy: new Cesium.PolygonHierarchy(
   *     Cesium.Cartesian3.fromDegreesArrayHeights([
   *      -90.0, 30.0, 0.0,
   *      -90.0, 30.0, 300000.0,
   *      -80.0, 30.0, 300000.0,
   *      -80.0, 30.0, 0.0
   *   ]))
   * });
   *
   */
  function CoplanarPolygonGeometry(options) {
    options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);
    const polygonHierarchy = options.polygonHierarchy;
    const textureCoordinates = options.textureCoordinates;
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("options.polygonHierarchy", polygonHierarchy);
    //>>includeEnd('debug');

    const vertexFormat = defaultValue.defaultValue(options.vertexFormat, VertexFormat.VertexFormat.DEFAULT);
    this._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat);
    this._polygonHierarchy = polygonHierarchy;
    this._stRotation = defaultValue.defaultValue(options.stRotation, 0.0);
    this._ellipsoid = Matrix2.Ellipsoid.clone(
      defaultValue.defaultValue(options.ellipsoid, Matrix2.Ellipsoid.WGS84)
    );
    this._workerName = "createCoplanarPolygonGeometry";
    this._textureCoordinates = textureCoordinates;

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    this.packedLength =
      PolygonGeometryLibrary.PolygonGeometryLibrary.computeHierarchyPackedLength(
        polygonHierarchy,
        Matrix2.Cartesian3
      ) +
      VertexFormat.VertexFormat.packedLength +
      Matrix2.Ellipsoid.packedLength +
      (defaultValue.defined(textureCoordinates)
        ? PolygonGeometryLibrary.PolygonGeometryLibrary.computeHierarchyPackedLength(
            textureCoordinates,
            Matrix2.Cartesian2
          )
        : 1) +
      2;
  }

  /**
   * A description of a coplanar polygon from an array of positions.
   *
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3[]} options.positions An array of positions that defined the corner points of the polygon.
   * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
   * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates, in radians. A positive rotation is counter-clockwise.
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
   * @param {PolygonHierarchy} [options.textureCoordinates] Texture coordinates as a {@link PolygonHierarchy} of {@link Cartesian2} points.
   * @returns {CoplanarPolygonGeometry}
   *
   * @example
   * // create a polygon from points
   * const polygon = Cesium.CoplanarPolygonGeometry.fromPositions({
   *   positions : Cesium.Cartesian3.fromDegreesArray([
   *     -72.0, 40.0,
   *     -70.0, 35.0,
   *     -75.0, 30.0,
   *     -70.0, 30.0,
   *     -68.0, 40.0
   *   ])
   * });
   * const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
   *
   * @see PolygonGeometry#createGeometry
   */
  CoplanarPolygonGeometry.fromPositions = function (options) {
    options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);

    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("options.positions", options.positions);
    //>>includeEnd('debug');

    const newOptions = {
      polygonHierarchy: {
        positions: options.positions,
      },
      vertexFormat: options.vertexFormat,
      stRotation: options.stRotation,
      ellipsoid: options.ellipsoid,
      textureCoordinates: options.textureCoordinates,
    };
    return new CoplanarPolygonGeometry(newOptions);
  };

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {CoplanarPolygonGeometry} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  CoplanarPolygonGeometry.pack = function (value, array, startingIndex) {
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

    Matrix2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
    startingIndex += Matrix2.Ellipsoid.packedLength;

    VertexFormat.VertexFormat.pack(value._vertexFormat, array, startingIndex);
    startingIndex += VertexFormat.VertexFormat.packedLength;

    array[startingIndex++] = value._stRotation;
    if (defaultValue.defined(value._textureCoordinates)) {
      startingIndex = PolygonGeometryLibrary.PolygonGeometryLibrary.packPolygonHierarchy(
        value._textureCoordinates,
        array,
        startingIndex,
        Matrix2.Cartesian2
      );
    } else {
      array[startingIndex++] = -1.0;
    }
    array[startingIndex++] = value.packedLength;

    return array;
  };

  const scratchEllipsoid = Matrix2.Ellipsoid.clone(Matrix2.Ellipsoid.UNIT_SPHERE);
  const scratchVertexFormat = new VertexFormat.VertexFormat();
  const scratchOptions = {
    polygonHierarchy: {},
  };
  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {CoplanarPolygonGeometry} [result] The object into which to store the result.
   * @returns {CoplanarPolygonGeometry} The modified result parameter or a new CoplanarPolygonGeometry instance if one was not provided.
   */
  CoplanarPolygonGeometry.unpack = function (array, startingIndex, result) {
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

    const ellipsoid = Matrix2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
    startingIndex += Matrix2.Ellipsoid.packedLength;

    const vertexFormat = VertexFormat.VertexFormat.unpack(
      array,
      startingIndex,
      scratchVertexFormat
    );
    startingIndex += VertexFormat.VertexFormat.packedLength;

    const stRotation = array[startingIndex++];
    const textureCoordinates =
      array[startingIndex] === -1.0
        ? undefined
        : PolygonGeometryLibrary.PolygonGeometryLibrary.unpackPolygonHierarchy(
            array,
            startingIndex,
            Matrix2.Cartesian2
          );
    if (defaultValue.defined(textureCoordinates)) {
      startingIndex = textureCoordinates.startingIndex;
      delete textureCoordinates.startingIndex;
    } else {
      startingIndex++;
    }
    const packedLength = array[startingIndex++];

    if (!defaultValue.defined(result)) {
      result = new CoplanarPolygonGeometry(scratchOptions);
    }

    result._polygonHierarchy = polygonHierarchy;
    result._ellipsoid = Matrix2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
    result._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, result._vertexFormat);
    result._stRotation = stRotation;
    result._textureCoordinates = textureCoordinates;
    result.packedLength = packedLength;

    return result;
  };

  /**
   * Computes the geometric representation of an arbitrary coplanar polygon, including its vertices, indices, and a bounding sphere.
   *
   * @param {CoplanarPolygonGeometry} polygonGeometry A description of the polygon.
   * @returns {Geometry|undefined} The computed vertices and indices.
   */
  CoplanarPolygonGeometry.createGeometry = function (polygonGeometry) {
    const vertexFormat = polygonGeometry._vertexFormat;
    const polygonHierarchy = polygonGeometry._polygonHierarchy;
    const stRotation = polygonGeometry._stRotation;
    const textureCoordinates = polygonGeometry._textureCoordinates;
    const hasTextureCoordinates = defaultValue.defined(textureCoordinates);

    let outerPositions = polygonHierarchy.positions;
    outerPositions = arrayRemoveDuplicates.arrayRemoveDuplicates(
      outerPositions,
      Matrix2.Cartesian3.equalsEpsilon,
      true
    );
    if (outerPositions.length < 3) {
      return;
    }

    let normal = scratchNormal;
    let tangent = scratchTangent;
    let bitangent = scratchBitangent;
    let axis1 = axis1Scratch;
    const axis2 = axis2Scratch;

    const validGeometry = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.computeProjectTo2DArguments(
      outerPositions,
      centerScratch,
      axis1,
      axis2
    );
    if (!validGeometry) {
      return undefined;
    }

    normal = Matrix2.Cartesian3.cross(axis1, axis2, normal);
    normal = Matrix2.Cartesian3.normalize(normal, normal);

    if (
      !Matrix2.Cartesian3.equalsEpsilon(
        centerScratch,
        Matrix2.Cartesian3.ZERO,
        ComponentDatatype.CesiumMath.EPSILON6
      )
    ) {
      const surfaceNormal = polygonGeometry._ellipsoid.geodeticSurfaceNormal(
        centerScratch,
        surfaceNormalScratch
      );
      if (Matrix2.Cartesian3.dot(normal, surfaceNormal) < 0) {
        normal = Matrix2.Cartesian3.negate(normal, normal);
        axis1 = Matrix2.Cartesian3.negate(axis1, axis1);
      }
    }

    const projectPoints = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.createProjectPointsTo2DFunction(
      centerScratch,
      axis1,
      axis2
    );
    const projectPoint = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.createProjectPointTo2DFunction(
      centerScratch,
      axis1,
      axis2
    );

    if (vertexFormat.tangent) {
      tangent = Matrix2.Cartesian3.clone(axis1, tangent);
    }
    if (vertexFormat.bitangent) {
      bitangent = Matrix2.Cartesian3.clone(axis2, bitangent);
    }

    const results = PolygonGeometryLibrary.PolygonGeometryLibrary.polygonsFromHierarchy(
      polygonHierarchy,
      hasTextureCoordinates,
      projectPoints,
      false
    );
    const hierarchy = results.hierarchy;
    const polygons = results.polygons;

    const dummyFunction = function (identity) {
      return identity;
    };

    const textureCoordinatePolygons = hasTextureCoordinates
      ? PolygonGeometryLibrary.PolygonGeometryLibrary.polygonsFromHierarchy(
          textureCoordinates,
          true,
          dummyFunction,
          false
        ).polygons
      : undefined;

    if (hierarchy.length === 0) {
      return;
    }
    outerPositions = hierarchy[0].outerRing;

    const boundingSphere = Transforms.BoundingSphere.fromPoints(outerPositions);
    const boundingRectangle = PolygonGeometryLibrary.PolygonGeometryLibrary.computeBoundingRectangle(
      normal,
      projectPoint,
      outerPositions,
      stRotation,
      scratchBR
    );

    const geometries = [];
    for (let i = 0; i < polygons.length; i++) {
      const geometryInstance = new GeometryInstance.GeometryInstance({
        geometry: createGeometryFromPolygon(
          polygons[i],
          vertexFormat,
          boundingRectangle,
          stRotation,
          hasTextureCoordinates ? textureCoordinatePolygons[i] : undefined,
          projectPoint,
          normal,
          tangent,
          bitangent
        ),
      });

      geometries.push(geometryInstance);
    }

    const geometry = GeometryPipeline.GeometryPipeline.combineInstances(geometries)[0];
    geometry.attributes.position.values = new Float64Array(
      geometry.attributes.position.values
    );
    geometry.indices = IndexDatatype.IndexDatatype.createTypedArray(
      geometry.attributes.position.values.length / 3,
      geometry.indices
    );

    const attributes = geometry.attributes;
    if (!vertexFormat.position) {
      delete attributes.position;
    }
    return new GeometryAttribute.Geometry({
      attributes: attributes,
      indices: geometry.indices,
      primitiveType: geometry.primitiveType,
      boundingSphere: boundingSphere,
    });
  };

  function createCoplanarPolygonGeometry(polygonGeometry, offset) {
    if (defaultValue.defined(offset)) {
      polygonGeometry = CoplanarPolygonGeometry.unpack(polygonGeometry, offset);
    }
    return CoplanarPolygonGeometry.createGeometry(polygonGeometry);
  }

  return createCoplanarPolygonGeometry;

}));
//# sourceMappingURL=createCoplanarPolygonGeometry.js.map
