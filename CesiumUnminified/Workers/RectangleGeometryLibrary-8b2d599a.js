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

define(['exports', './Matrix2-46dc0d7f', './defaultValue-4607806f', './RuntimeError-cef79f54', './Transforms-fc8266a1', './ComponentDatatype-1ef49b14'], (function (exports, Matrix2, defaultValue, RuntimeError, Transforms, ComponentDatatype) { 'use strict';

  const cos = Math.cos;
  const sin = Math.sin;
  const sqrt = Math.sqrt;

  /**
   * @private
   */
  const RectangleGeometryLibrary = {};

  /**
   * @private
   */
  RectangleGeometryLibrary.computePosition = function (
    computedOptions,
    ellipsoid,
    computeST,
    row,
    col,
    position,
    st
  ) {
    const radiiSquared = ellipsoid.radiiSquared;
    const nwCorner = computedOptions.nwCorner;
    const rectangle = computedOptions.boundingRectangle;

    let stLatitude =
      nwCorner.latitude -
      computedOptions.granYCos * row +
      col * computedOptions.granXSin;
    const cosLatitude = cos(stLatitude);
    const nZ = sin(stLatitude);
    const kZ = radiiSquared.z * nZ;

    let stLongitude =
      nwCorner.longitude +
      row * computedOptions.granYSin +
      col * computedOptions.granXCos;
    const nX = cosLatitude * cos(stLongitude);
    const nY = cosLatitude * sin(stLongitude);

    const kX = radiiSquared.x * nX;
    const kY = radiiSquared.y * nY;

    const gamma = sqrt(kX * nX + kY * nY + kZ * nZ);

    position.x = kX / gamma;
    position.y = kY / gamma;
    position.z = kZ / gamma;

    if (computeST) {
      const stNwCorner = computedOptions.stNwCorner;
      if (defaultValue.defined(stNwCorner)) {
        stLatitude =
          stNwCorner.latitude -
          computedOptions.stGranYCos * row +
          col * computedOptions.stGranXSin;
        stLongitude =
          stNwCorner.longitude +
          row * computedOptions.stGranYSin +
          col * computedOptions.stGranXCos;

        st.x = (stLongitude - computedOptions.stWest) * computedOptions.lonScalar;
        st.y = (stLatitude - computedOptions.stSouth) * computedOptions.latScalar;
      } else {
        st.x = (stLongitude - rectangle.west) * computedOptions.lonScalar;
        st.y = (stLatitude - rectangle.south) * computedOptions.latScalar;
      }
    }
  };

  const rotationMatrixScratch = new Matrix2.Matrix2();
  let nwCartesian = new Matrix2.Cartesian3();
  const centerScratch = new Matrix2.Cartographic();
  let centerCartesian = new Matrix2.Cartesian3();
  const proj = new Transforms.GeographicProjection();

  function getRotationOptions(
    nwCorner,
    rotation,
    granularityX,
    granularityY,
    center,
    width,
    height
  ) {
    const cosRotation = Math.cos(rotation);
    const granYCos = granularityY * cosRotation;
    const granXCos = granularityX * cosRotation;

    const sinRotation = Math.sin(rotation);
    const granYSin = granularityY * sinRotation;
    const granXSin = granularityX * sinRotation;

    nwCartesian = proj.project(nwCorner, nwCartesian);

    nwCartesian = Matrix2.Cartesian3.subtract(nwCartesian, centerCartesian, nwCartesian);
    const rotationMatrix = Matrix2.Matrix2.fromRotation(rotation, rotationMatrixScratch);
    nwCartesian = Matrix2.Matrix2.multiplyByVector(
      rotationMatrix,
      nwCartesian,
      nwCartesian
    );
    nwCartesian = Matrix2.Cartesian3.add(nwCartesian, centerCartesian, nwCartesian);
    nwCorner = proj.unproject(nwCartesian, nwCorner);

    width -= 1;
    height -= 1;

    const latitude = nwCorner.latitude;
    const latitude0 = latitude + width * granXSin;
    const latitude1 = latitude - granYCos * height;
    const latitude2 = latitude - granYCos * height + width * granXSin;

    const north = Math.max(latitude, latitude0, latitude1, latitude2);
    const south = Math.min(latitude, latitude0, latitude1, latitude2);

    const longitude = nwCorner.longitude;
    const longitude0 = longitude + width * granXCos;
    const longitude1 = longitude + height * granYSin;
    const longitude2 = longitude + height * granYSin + width * granXCos;

    const east = Math.max(longitude, longitude0, longitude1, longitude2);
    const west = Math.min(longitude, longitude0, longitude1, longitude2);

    return {
      north: north,
      south: south,
      east: east,
      west: west,
      granYCos: granYCos,
      granYSin: granYSin,
      granXCos: granXCos,
      granXSin: granXSin,
      nwCorner: nwCorner,
    };
  }

  /**
   * @private
   */
  RectangleGeometryLibrary.computeOptions = function (
    rectangle,
    granularity,
    rotation,
    stRotation,
    boundingRectangleScratch,
    nwCornerResult,
    stNwCornerResult
  ) {
    let east = rectangle.east;
    let west = rectangle.west;
    let north = rectangle.north;
    let south = rectangle.south;

    let northCap = false;
    let southCap = false;

    if (north === ComponentDatatype.CesiumMath.PI_OVER_TWO) {
      northCap = true;
    }
    if (south === -ComponentDatatype.CesiumMath.PI_OVER_TWO) {
      southCap = true;
    }

    let dx;
    const dy = north - south;
    if (west > east) {
      dx = ComponentDatatype.CesiumMath.TWO_PI - west + east;
    } else {
      dx = east - west;
    }

    const width = Math.ceil(dx / granularity) + 1;
    const height = Math.ceil(dy / granularity) + 1;
    const granularityX = dx / (width - 1);
    const granularityY = dy / (height - 1);

    const nwCorner = Matrix2.Rectangle.northwest(rectangle, nwCornerResult);
    const center = Matrix2.Rectangle.center(rectangle, centerScratch);
    if (rotation !== 0 || stRotation !== 0) {
      if (center.longitude < nwCorner.longitude) {
        center.longitude += ComponentDatatype.CesiumMath.TWO_PI;
      }
      centerCartesian = proj.project(center, centerCartesian);
    }

    const granYCos = granularityY;
    const granXCos = granularityX;
    const granYSin = 0.0;
    const granXSin = 0.0;

    const boundingRectangle = Matrix2.Rectangle.clone(
      rectangle,
      boundingRectangleScratch
    );

    const computedOptions = {
      granYCos: granYCos,
      granYSin: granYSin,
      granXCos: granXCos,
      granXSin: granXSin,
      nwCorner: nwCorner,
      boundingRectangle: boundingRectangle,
      width: width,
      height: height,
      northCap: northCap,
      southCap: southCap,
    };

    if (rotation !== 0) {
      const rotationOptions = getRotationOptions(
        nwCorner,
        rotation,
        granularityX,
        granularityY,
        center,
        width,
        height
      );
      north = rotationOptions.north;
      south = rotationOptions.south;
      east = rotationOptions.east;
      west = rotationOptions.west;

      //>>includeStart('debug', pragmas.debug);
      if (
        north < -ComponentDatatype.CesiumMath.PI_OVER_TWO ||
        north > ComponentDatatype.CesiumMath.PI_OVER_TWO ||
        south < -ComponentDatatype.CesiumMath.PI_OVER_TWO ||
        south > ComponentDatatype.CesiumMath.PI_OVER_TWO
      ) {
        throw new RuntimeError.DeveloperError(
          "Rotated rectangle is invalid.  It crosses over either the north or south pole."
        );
      }
      //>>includeEnd('debug')

      computedOptions.granYCos = rotationOptions.granYCos;
      computedOptions.granYSin = rotationOptions.granYSin;
      computedOptions.granXCos = rotationOptions.granXCos;
      computedOptions.granXSin = rotationOptions.granXSin;

      boundingRectangle.north = north;
      boundingRectangle.south = south;
      boundingRectangle.east = east;
      boundingRectangle.west = west;
    }

    if (stRotation !== 0) {
      rotation = rotation - stRotation;
      const stNwCorner = Matrix2.Rectangle.northwest(boundingRectangle, stNwCornerResult);

      const stRotationOptions = getRotationOptions(
        stNwCorner,
        rotation,
        granularityX,
        granularityY,
        center,
        width,
        height
      );

      computedOptions.stGranYCos = stRotationOptions.granYCos;
      computedOptions.stGranXCos = stRotationOptions.granXCos;
      computedOptions.stGranYSin = stRotationOptions.granYSin;
      computedOptions.stGranXSin = stRotationOptions.granXSin;
      computedOptions.stNwCorner = stNwCorner;
      computedOptions.stWest = stRotationOptions.west;
      computedOptions.stSouth = stRotationOptions.south;
    }

    return computedOptions;
  };

  exports.RectangleGeometryLibrary = RectangleGeometryLibrary;

}));
