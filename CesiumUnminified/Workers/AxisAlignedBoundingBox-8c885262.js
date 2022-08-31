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

define(['exports', './Matrix2-46dc0d7f', './RuntimeError-cef79f54', './defaultValue-4607806f', './Transforms-fc8266a1'], (function (exports, Matrix2, RuntimeError, defaultValue, Transforms) { 'use strict';

  /**
   * Creates an instance of an AxisAlignedBoundingBox from the minimum and maximum points along the x, y, and z axes.
   * @alias AxisAlignedBoundingBox
   * @constructor
   *
   * @param {Cartesian3} [minimum=Cartesian3.ZERO] The minimum point along the x, y, and z axes.
   * @param {Cartesian3} [maximum=Cartesian3.ZERO] The maximum point along the x, y, and z axes.
   * @param {Cartesian3} [center] The center of the box; automatically computed if not supplied.
   *
   * @see BoundingSphere
   * @see BoundingRectangle
   */
  function AxisAlignedBoundingBox(minimum, maximum, center) {
    /**
     * The minimum point defining the bounding box.
     * @type {Cartesian3}
     * @default {@link Cartesian3.ZERO}
     */
    this.minimum = Matrix2.Cartesian3.clone(defaultValue.defaultValue(minimum, Matrix2.Cartesian3.ZERO));

    /**
     * The maximum point defining the bounding box.
     * @type {Cartesian3}
     * @default {@link Cartesian3.ZERO}
     */
    this.maximum = Matrix2.Cartesian3.clone(defaultValue.defaultValue(maximum, Matrix2.Cartesian3.ZERO));

    // If center was not defined, compute it.
    if (!defaultValue.defined(center)) {
      center = Matrix2.Cartesian3.midpoint(this.minimum, this.maximum, new Matrix2.Cartesian3());
    } else {
      center = Matrix2.Cartesian3.clone(center);
    }

    /**
     * The center point of the bounding box.
     * @type {Cartesian3}
     */
    this.center = center;
  }

  /**
   * Creates an instance of an AxisAlignedBoundingBox from its corners.
   *
   * @param {Cartesian3} minimum The minimum point along the x, y, and z axes.
   * @param {Cartesian3} maximum The maximum point along the x, y, and z axes.
   * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
   * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
   *
   * @example
   * // Compute an axis aligned bounding box from the two corners.
   * const box = Cesium.AxisAlignedBoundingBox.fromCorners(new Cesium.Cartesian3(-1, -1, -1), new Cesium.Cartesian3(1, 1, 1));
   */
  AxisAlignedBoundingBox.fromCorners = function (minimum, maximum, result) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("minimum", minimum);
    RuntimeError.Check.defined("maximum", maximum);
    //>>includeEnd('debug');

    if (!defaultValue.defined(result)) {
      result = new AxisAlignedBoundingBox();
    }

    result.minimum = Matrix2.Cartesian3.clone(minimum, result.minimum);
    result.maximum = Matrix2.Cartesian3.clone(maximum, result.maximum);
    result.center = Matrix2.Cartesian3.midpoint(minimum, maximum, result.center);

    return result;
  };

  /**
   * Computes an instance of an AxisAlignedBoundingBox. The box is determined by
   * finding the points spaced the farthest apart on the x, y, and z axes.
   *
   * @param {Cartesian3[]} positions List of points that the bounding box will enclose.  Each point must have a <code>x</code>, <code>y</code>, and <code>z</code> properties.
   * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
   * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
   *
   * @example
   * // Compute an axis aligned bounding box enclosing two points.
   * const box = Cesium.AxisAlignedBoundingBox.fromPoints([new Cesium.Cartesian3(2, 0, 0), new Cesium.Cartesian3(-2, 0, 0)]);
   */
  AxisAlignedBoundingBox.fromPoints = function (positions, result) {
    if (!defaultValue.defined(result)) {
      result = new AxisAlignedBoundingBox();
    }

    if (!defaultValue.defined(positions) || positions.length === 0) {
      result.minimum = Matrix2.Cartesian3.clone(Matrix2.Cartesian3.ZERO, result.minimum);
      result.maximum = Matrix2.Cartesian3.clone(Matrix2.Cartesian3.ZERO, result.maximum);
      result.center = Matrix2.Cartesian3.clone(Matrix2.Cartesian3.ZERO, result.center);
      return result;
    }

    let minimumX = positions[0].x;
    let minimumY = positions[0].y;
    let minimumZ = positions[0].z;

    let maximumX = positions[0].x;
    let maximumY = positions[0].y;
    let maximumZ = positions[0].z;

    const length = positions.length;
    for (let i = 1; i < length; i++) {
      const p = positions[i];
      const x = p.x;
      const y = p.y;
      const z = p.z;

      minimumX = Math.min(x, minimumX);
      maximumX = Math.max(x, maximumX);
      minimumY = Math.min(y, minimumY);
      maximumY = Math.max(y, maximumY);
      minimumZ = Math.min(z, minimumZ);
      maximumZ = Math.max(z, maximumZ);
    }

    const minimum = result.minimum;
    minimum.x = minimumX;
    minimum.y = minimumY;
    minimum.z = minimumZ;

    const maximum = result.maximum;
    maximum.x = maximumX;
    maximum.y = maximumY;
    maximum.z = maximumZ;

    result.center = Matrix2.Cartesian3.midpoint(minimum, maximum, result.center);

    return result;
  };

  /**
   * Duplicates a AxisAlignedBoundingBox instance.
   *
   * @param {AxisAlignedBoundingBox} box The bounding box to duplicate.
   * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
   * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if none was provided. (Returns undefined if box is undefined)
   */
  AxisAlignedBoundingBox.clone = function (box, result) {
    if (!defaultValue.defined(box)) {
      return undefined;
    }

    if (!defaultValue.defined(result)) {
      return new AxisAlignedBoundingBox(box.minimum, box.maximum, box.center);
    }

    result.minimum = Matrix2.Cartesian3.clone(box.minimum, result.minimum);
    result.maximum = Matrix2.Cartesian3.clone(box.maximum, result.maximum);
    result.center = Matrix2.Cartesian3.clone(box.center, result.center);
    return result;
  };

  /**
   * Compares the provided AxisAlignedBoundingBox componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {AxisAlignedBoundingBox} [left] The first AxisAlignedBoundingBox.
   * @param {AxisAlignedBoundingBox} [right] The second AxisAlignedBoundingBox.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  AxisAlignedBoundingBox.equals = function (left, right) {
    return (
      left === right ||
      (defaultValue.defined(left) &&
        defaultValue.defined(right) &&
        Matrix2.Cartesian3.equals(left.center, right.center) &&
        Matrix2.Cartesian3.equals(left.minimum, right.minimum) &&
        Matrix2.Cartesian3.equals(left.maximum, right.maximum))
    );
  };

  let intersectScratch = new Matrix2.Cartesian3();
  /**
   * Determines which side of a plane a box is located.
   *
   * @param {AxisAlignedBoundingBox} box The bounding box to test.
   * @param {Plane} plane The plane to test against.
   * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
   *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
   *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
   *                      intersects the plane.
   */
  AxisAlignedBoundingBox.intersectPlane = function (box, plane) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("box", box);
    RuntimeError.Check.defined("plane", plane);
    //>>includeEnd('debug');

    intersectScratch = Matrix2.Cartesian3.subtract(
      box.maximum,
      box.minimum,
      intersectScratch
    );
    const h = Matrix2.Cartesian3.multiplyByScalar(
      intersectScratch,
      0.5,
      intersectScratch
    ); //The positive half diagonal
    const normal = plane.normal;
    const e =
      h.x * Math.abs(normal.x) +
      h.y * Math.abs(normal.y) +
      h.z * Math.abs(normal.z);
    const s = Matrix2.Cartesian3.dot(box.center, normal) + plane.distance; //signed distance from center

    if (s - e > 0) {
      return Transforms.Intersect.INSIDE;
    }

    if (s + e < 0) {
      //Not in front because normals point inward
      return Transforms.Intersect.OUTSIDE;
    }

    return Transforms.Intersect.INTERSECTING;
  };

  /**
   * Duplicates this AxisAlignedBoundingBox instance.
   *
   * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
   * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
   */
  AxisAlignedBoundingBox.prototype.clone = function (result) {
    return AxisAlignedBoundingBox.clone(this, result);
  };

  /**
   * Determines which side of a plane this box is located.
   *
   * @param {Plane} plane The plane to test against.
   * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
   *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
   *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
   *                      intersects the plane.
   */
  AxisAlignedBoundingBox.prototype.intersectPlane = function (plane) {
    return AxisAlignedBoundingBox.intersectPlane(this, plane);
  };

  /**
   * Compares this AxisAlignedBoundingBox against the provided AxisAlignedBoundingBox componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {AxisAlignedBoundingBox} [right] The right hand side AxisAlignedBoundingBox.
   * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  AxisAlignedBoundingBox.prototype.equals = function (right) {
    return AxisAlignedBoundingBox.equals(this, right);
  };

  exports.AxisAlignedBoundingBox = AxisAlignedBoundingBox;

}));
