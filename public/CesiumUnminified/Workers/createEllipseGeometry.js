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

define(['./Matrix2-9e1c22e2', './defaultValue-97284df2', './EllipseGeometry-83f433c5', './RuntimeError-4f8ec8a2', './ComponentDatatype-4eeb6d9b', './WebGLConstants-6da700a2', './Transforms-273eeb44', './_commonjsHelpers-3aae1032-65601a27', './combine-d11b1f00', './EllipseGeometryLibrary-dac95924', './GeometryAttribute-9be2d2e5', './GeometryAttributes-734a3446', './GeometryInstance-3db1d31b', './GeometryOffsetAttribute-59b14f45', './GeometryPipeline-d7363877', './AttributeCompression-f202be44', './EncodedCartesian3-491ac596', './IndexDatatype-f228f5fd', './IntersectionTests-ea138127', './Plane-76b84425', './VertexFormat-563ab2cc'], (function (Matrix2, defaultValue, EllipseGeometry, RuntimeError, ComponentDatatype, WebGLConstants, Transforms, _commonjsHelpers3aae1032, combine, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryOffsetAttribute, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, VertexFormat) { 'use strict';

  function createEllipseGeometry(ellipseGeometry, offset) {
    if (defaultValue.defined(offset)) {
      ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Matrix2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Matrix2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseGeometry;

}));
//# sourceMappingURL=createEllipseGeometry.js.map
