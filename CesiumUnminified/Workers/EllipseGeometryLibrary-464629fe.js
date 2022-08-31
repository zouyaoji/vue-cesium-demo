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

define(['exports', './Matrix2-46dc0d7f', './ComponentDatatype-1ef49b14', './Transforms-fc8266a1'], (function (exports, Matrix2, ComponentDatatype, Transforms) { 'use strict';

  const EllipseGeometryLibrary = {};

  const rotAxis = new Matrix2.Cartesian3();
  const tempVec = new Matrix2.Cartesian3();
  const unitQuat = new Transforms.Quaternion();
  const rotMtx = new Matrix2.Matrix3();

  function pointOnEllipsoid(
    theta,
    rotation,
    northVec,
    eastVec,
    aSqr,
    ab,
    bSqr,
    mag,
    unitPos,
    result
  ) {
    const azimuth = theta + rotation;

    Matrix2.Cartesian3.multiplyByScalar(eastVec, Math.cos(azimuth), rotAxis);
    Matrix2.Cartesian3.multiplyByScalar(northVec, Math.sin(azimuth), tempVec);
    Matrix2.Cartesian3.add(rotAxis, tempVec, rotAxis);

    let cosThetaSquared = Math.cos(theta);
    cosThetaSquared = cosThetaSquared * cosThetaSquared;

    let sinThetaSquared = Math.sin(theta);
    sinThetaSquared = sinThetaSquared * sinThetaSquared;

    const radius =
      ab / Math.sqrt(bSqr * cosThetaSquared + aSqr * sinThetaSquared);
    const angle = radius / mag;

    // Create the quaternion to rotate the position vector to the boundary of the ellipse.
    Transforms.Quaternion.fromAxisAngle(rotAxis, angle, unitQuat);
    Matrix2.Matrix3.fromQuaternion(unitQuat, rotMtx);

    Matrix2.Matrix3.multiplyByVector(rotMtx, unitPos, result);
    Matrix2.Cartesian3.normalize(result, result);
    Matrix2.Cartesian3.multiplyByScalar(result, mag, result);
    return result;
  }

  const scratchCartesian1 = new Matrix2.Cartesian3();
  const scratchCartesian2 = new Matrix2.Cartesian3();
  const scratchCartesian3 = new Matrix2.Cartesian3();
  const scratchNormal = new Matrix2.Cartesian3();
  /**
   * Returns the positions raised to the given heights
   * @private
   */
  EllipseGeometryLibrary.raisePositionsToHeight = function (
    positions,
    options,
    extrude
  ) {
    const ellipsoid = options.ellipsoid;
    const height = options.height;
    const extrudedHeight = options.extrudedHeight;
    const size = extrude ? (positions.length / 3) * 2 : positions.length / 3;

    const finalPositions = new Float64Array(size * 3);

    const length = positions.length;
    const bottomOffset = extrude ? length : 0;
    for (let i = 0; i < length; i += 3) {
      const i1 = i + 1;
      const i2 = i + 2;

      const position = Matrix2.Cartesian3.fromArray(positions, i, scratchCartesian1);
      ellipsoid.scaleToGeodeticSurface(position, position);

      const extrudedPosition = Matrix2.Cartesian3.clone(position, scratchCartesian2);
      const normal = ellipsoid.geodeticSurfaceNormal(position, scratchNormal);
      const scaledNormal = Matrix2.Cartesian3.multiplyByScalar(
        normal,
        height,
        scratchCartesian3
      );
      Matrix2.Cartesian3.add(position, scaledNormal, position);

      if (extrude) {
        Matrix2.Cartesian3.multiplyByScalar(normal, extrudedHeight, scaledNormal);
        Matrix2.Cartesian3.add(extrudedPosition, scaledNormal, extrudedPosition);

        finalPositions[i + bottomOffset] = extrudedPosition.x;
        finalPositions[i1 + bottomOffset] = extrudedPosition.y;
        finalPositions[i2 + bottomOffset] = extrudedPosition.z;
      }

      finalPositions[i] = position.x;
      finalPositions[i1] = position.y;
      finalPositions[i2] = position.z;
    }

    return finalPositions;
  };

  const unitPosScratch = new Matrix2.Cartesian3();
  const eastVecScratch = new Matrix2.Cartesian3();
  const northVecScratch = new Matrix2.Cartesian3();
  /**
   * Returns an array of positions that make up the ellipse.
   * @private
   */
  EllipseGeometryLibrary.computeEllipsePositions = function (
    options,
    addFillPositions,
    addEdgePositions
  ) {
    const semiMinorAxis = options.semiMinorAxis;
    const semiMajorAxis = options.semiMajorAxis;
    const rotation = options.rotation;
    const center = options.center;

    // Computing the arc-length of the ellipse is too expensive to be practical. Estimating it using the
    // arc length of the sphere is too inaccurate and creates sharp edges when either the semi-major or
    // semi-minor axis is much bigger than the other. Instead, scale the angle delta to make
    // the distance along the ellipse boundary more closely match the granularity.
    const granularity = options.granularity * 8.0;

    const aSqr = semiMinorAxis * semiMinorAxis;
    const bSqr = semiMajorAxis * semiMajorAxis;
    const ab = semiMajorAxis * semiMinorAxis;

    const mag = Matrix2.Cartesian3.magnitude(center);

    const unitPos = Matrix2.Cartesian3.normalize(center, unitPosScratch);
    let eastVec = Matrix2.Cartesian3.cross(Matrix2.Cartesian3.UNIT_Z, center, eastVecScratch);
    eastVec = Matrix2.Cartesian3.normalize(eastVec, eastVec);
    const northVec = Matrix2.Cartesian3.cross(unitPos, eastVec, northVecScratch);

    // The number of points in the first quadrant
    let numPts = 1 + Math.ceil(ComponentDatatype.CesiumMath.PI_OVER_TWO / granularity);

    const deltaTheta = ComponentDatatype.CesiumMath.PI_OVER_TWO / (numPts - 1);
    let theta = ComponentDatatype.CesiumMath.PI_OVER_TWO - numPts * deltaTheta;
    if (theta < 0.0) {
      numPts -= Math.ceil(Math.abs(theta) / deltaTheta);
    }

    // If the number of points were three, the ellipse
    // would be tessellated like below:
    //
    //         *---*
    //       / | \ | \
    //     *---*---*---*
    //   / | \ | \ | \ | \
    //  / .*---*---*---*. \
    // * ` | \ | \ | \ | `*
    //  \`.*---*---*---*.`/
    //   \ | \ | \ | \ | /
    //     *---*---*---*
    //       \ | \ | /
    //         *---*
    // The first and last column have one position and fan to connect to the adjacent column.
    // Each other vertical column contains an even number of positions.
    const size = 2 * (numPts * (numPts + 2));
    const positions = addFillPositions ? new Array(size * 3) : undefined;
    let positionIndex = 0;
    let position = scratchCartesian1;
    let reflectedPosition = scratchCartesian2;

    const outerPositionsLength = numPts * 4 * 3;
    let outerRightIndex = outerPositionsLength - 1;
    let outerLeftIndex = 0;
    const outerPositions = addEdgePositions
      ? new Array(outerPositionsLength)
      : undefined;

    let i;
    let j;
    let numInterior;
    let t;
    let interiorPosition;

    // Compute points in the 'eastern' half of the ellipse
    theta = ComponentDatatype.CesiumMath.PI_OVER_TWO;
    position = pointOnEllipsoid(
      theta,
      rotation,
      northVec,
      eastVec,
      aSqr,
      ab,
      bSqr,
      mag,
      unitPos,
      position
    );
    if (addFillPositions) {
      positions[positionIndex++] = position.x;
      positions[positionIndex++] = position.y;
      positions[positionIndex++] = position.z;
    }
    if (addEdgePositions) {
      outerPositions[outerRightIndex--] = position.z;
      outerPositions[outerRightIndex--] = position.y;
      outerPositions[outerRightIndex--] = position.x;
    }
    theta = ComponentDatatype.CesiumMath.PI_OVER_TWO - deltaTheta;
    for (i = 1; i < numPts + 1; ++i) {
      position = pointOnEllipsoid(
        theta,
        rotation,
        northVec,
        eastVec,
        aSqr,
        ab,
        bSqr,
        mag,
        unitPos,
        position
      );
      reflectedPosition = pointOnEllipsoid(
        Math.PI - theta,
        rotation,
        northVec,
        eastVec,
        aSqr,
        ab,
        bSqr,
        mag,
        unitPos,
        reflectedPosition
      );

      if (addFillPositions) {
        positions[positionIndex++] = position.x;
        positions[positionIndex++] = position.y;
        positions[positionIndex++] = position.z;

        numInterior = 2 * i + 2;
        for (j = 1; j < numInterior - 1; ++j) {
          t = j / (numInterior - 1);
          interiorPosition = Matrix2.Cartesian3.lerp(
            position,
            reflectedPosition,
            t,
            scratchCartesian3
          );
          positions[positionIndex++] = interiorPosition.x;
          positions[positionIndex++] = interiorPosition.y;
          positions[positionIndex++] = interiorPosition.z;
        }

        positions[positionIndex++] = reflectedPosition.x;
        positions[positionIndex++] = reflectedPosition.y;
        positions[positionIndex++] = reflectedPosition.z;
      }

      if (addEdgePositions) {
        outerPositions[outerRightIndex--] = position.z;
        outerPositions[outerRightIndex--] = position.y;
        outerPositions[outerRightIndex--] = position.x;
        outerPositions[outerLeftIndex++] = reflectedPosition.x;
        outerPositions[outerLeftIndex++] = reflectedPosition.y;
        outerPositions[outerLeftIndex++] = reflectedPosition.z;
      }

      theta = ComponentDatatype.CesiumMath.PI_OVER_TWO - (i + 1) * deltaTheta;
    }

    // Compute points in the 'western' half of the ellipse
    for (i = numPts; i > 1; --i) {
      theta = ComponentDatatype.CesiumMath.PI_OVER_TWO - (i - 1) * deltaTheta;

      position = pointOnEllipsoid(
        -theta,
        rotation,
        northVec,
        eastVec,
        aSqr,
        ab,
        bSqr,
        mag,
        unitPos,
        position
      );
      reflectedPosition = pointOnEllipsoid(
        theta + Math.PI,
        rotation,
        northVec,
        eastVec,
        aSqr,
        ab,
        bSqr,
        mag,
        unitPos,
        reflectedPosition
      );

      if (addFillPositions) {
        positions[positionIndex++] = position.x;
        positions[positionIndex++] = position.y;
        positions[positionIndex++] = position.z;

        numInterior = 2 * (i - 1) + 2;
        for (j = 1; j < numInterior - 1; ++j) {
          t = j / (numInterior - 1);
          interiorPosition = Matrix2.Cartesian3.lerp(
            position,
            reflectedPosition,
            t,
            scratchCartesian3
          );
          positions[positionIndex++] = interiorPosition.x;
          positions[positionIndex++] = interiorPosition.y;
          positions[positionIndex++] = interiorPosition.z;
        }

        positions[positionIndex++] = reflectedPosition.x;
        positions[positionIndex++] = reflectedPosition.y;
        positions[positionIndex++] = reflectedPosition.z;
      }

      if (addEdgePositions) {
        outerPositions[outerRightIndex--] = position.z;
        outerPositions[outerRightIndex--] = position.y;
        outerPositions[outerRightIndex--] = position.x;
        outerPositions[outerLeftIndex++] = reflectedPosition.x;
        outerPositions[outerLeftIndex++] = reflectedPosition.y;
        outerPositions[outerLeftIndex++] = reflectedPosition.z;
      }
    }

    theta = ComponentDatatype.CesiumMath.PI_OVER_TWO;
    position = pointOnEllipsoid(
      -theta,
      rotation,
      northVec,
      eastVec,
      aSqr,
      ab,
      bSqr,
      mag,
      unitPos,
      position
    );

    const r = {};
    if (addFillPositions) {
      positions[positionIndex++] = position.x;
      positions[positionIndex++] = position.y;
      positions[positionIndex++] = position.z;
      r.positions = positions;
      r.numPts = numPts;
    }
    if (addEdgePositions) {
      outerPositions[outerRightIndex--] = position.z;
      outerPositions[outerRightIndex--] = position.y;
      outerPositions[outerRightIndex--] = position.x;
      r.outerPositions = outerPositions;
    }

    return r;
  };

  exports.EllipseGeometryLibrary = EllipseGeometryLibrary;

}));
