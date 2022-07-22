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

define(['./defaultValue-97284df2', './EllipsoidGeometry-c9dbbf37', './Transforms-273eeb44', './Matrix2-9e1c22e2', './RuntimeError-4f8ec8a2', './ComponentDatatype-4eeb6d9b', './WebGLConstants-6da700a2', './_commonjsHelpers-3aae1032-65601a27', './combine-d11b1f00', './GeometryAttribute-9be2d2e5', './GeometryAttributes-734a3446', './GeometryOffsetAttribute-59b14f45', './IndexDatatype-f228f5fd', './VertexFormat-563ab2cc'], (function (defaultValue, EllipsoidGeometry, Transforms, Matrix2, RuntimeError, ComponentDatatype, WebGLConstants, _commonjsHelpers3aae1032, combine, GeometryAttribute, GeometryAttributes, GeometryOffsetAttribute, IndexDatatype, VertexFormat) { 'use strict';

  function createEllipsoidGeometry(ellipsoidGeometry, offset) {
    if (defaultValue.defined(offset)) {
      ellipsoidGeometry = EllipsoidGeometry.EllipsoidGeometry.unpack(ellipsoidGeometry, offset);
    }
    return EllipsoidGeometry.EllipsoidGeometry.createGeometry(ellipsoidGeometry);
  }

  return createEllipsoidGeometry;

}));
//# sourceMappingURL=createEllipsoidGeometry.js.map
