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

define(['./defaultValue-4607806f', './PrimitivePipeline-e055216c', './createTaskProcessorWorker', './Transforms-fc8266a1', './Matrix2-46dc0d7f', './RuntimeError-cef79f54', './ComponentDatatype-1ef49b14', './WebGLConstants-f100e3dd', './_commonjsHelpers-a32ac251', './combine-fc59ba59', './GeometryAttribute-0c65674d', './GeometryAttributes-acac33d2', './GeometryPipeline-e00ed69b', './AttributeCompression-e3844002', './EncodedCartesian3-67ce8bc4', './IndexDatatype-790b4297', './IntersectionTests-f3daffbb', './Plane-e8eab25b', './WebMercatorProjection-60cca281'], (function (defaultValue, PrimitivePipeline, createTaskProcessorWorker, Transforms, Matrix2, RuntimeError, ComponentDatatype, WebGLConstants, _commonjsHelpers, combine, GeometryAttribute, GeometryAttributes, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, WebMercatorProjection) { 'use strict';

  /* global require */

  const moduleCache = {};

  function getModule(moduleName) {
    let module = moduleCache[moduleName];
    if (!defaultValue.defined(module)) {
      if (typeof exports === "object") {
        // Use CommonJS-style require.
        moduleCache[module] = module = require(`Workers/${moduleName}`);
      } else {
        // Use AMD-style require.
        // in web workers, require is synchronous
        require([`Workers/${moduleName}`], function (f) {
          module = f;
          moduleCache[module] = f;
        });
      }
    }
    return module;
  }

  function createGeometry(parameters, transferableObjects) {
    const subTasks = parameters.subTasks;
    const length = subTasks.length;
    const resultsOrPromises = new Array(length);

    for (let i = 0; i < length; i++) {
      const task = subTasks[i];
      const geometry = task.geometry;
      const moduleName = task.moduleName;

      if (defaultValue.defined(moduleName)) {
        const createFunction = getModule(moduleName);
        resultsOrPromises[i] = createFunction(geometry, task.offset);
      } else {
        //Already created geometry
        resultsOrPromises[i] = geometry;
      }
    }

    return Promise.all(resultsOrPromises).then(function (results) {
      return PrimitivePipeline.PrimitivePipeline.packCreateGeometryResults(
        results,
        transferableObjects
      );
    });
  }
  var createGeometry$1 = createTaskProcessorWorker(createGeometry);

  return createGeometry$1;

}));
