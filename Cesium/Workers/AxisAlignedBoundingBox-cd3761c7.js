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
define(["exports","./Matrix2-21f90abf","./RuntimeError-cef79f54","./defaultValue-4607806f","./Transforms-c450597e"],(function(e,n,t,i,a){"use strict";function m(e,t,a){this.minimum=n.Cartesian3.clone(i.defaultValue(e,n.Cartesian3.ZERO)),this.maximum=n.Cartesian3.clone(i.defaultValue(t,n.Cartesian3.ZERO)),a=i.defined(a)?n.Cartesian3.clone(a):n.Cartesian3.midpoint(this.minimum,this.maximum,new n.Cartesian3),this.center=a}m.fromCorners=function(e,t,a){return i.defined(a)||(a=new m),a.minimum=n.Cartesian3.clone(e,a.minimum),a.maximum=n.Cartesian3.clone(t,a.maximum),a.center=n.Cartesian3.midpoint(e,t,a.center),a},m.fromPoints=function(e,t){if(i.defined(t)||(t=new m),!i.defined(e)||0===e.length)return t.minimum=n.Cartesian3.clone(n.Cartesian3.ZERO,t.minimum),t.maximum=n.Cartesian3.clone(n.Cartesian3.ZERO,t.maximum),t.center=n.Cartesian3.clone(n.Cartesian3.ZERO,t.center),t;let a=e[0].x,r=e[0].y,s=e[0].z,u=e[0].x,c=e[0].y,o=e[0].z;const l=e.length;for(let n=1;n<l;n++){const t=e[n],i=t.x,m=t.y,l=t.z;a=Math.min(i,a),u=Math.max(i,u),r=Math.min(m,r),c=Math.max(m,c),s=Math.min(l,s),o=Math.max(l,o)}const f=t.minimum;f.x=a,f.y=r,f.z=s;const C=t.maximum;return C.x=u,C.y=c,C.z=o,t.center=n.Cartesian3.midpoint(f,C,t.center),t},m.clone=function(e,t){if(i.defined(e))return i.defined(t)?(t.minimum=n.Cartesian3.clone(e.minimum,t.minimum),t.maximum=n.Cartesian3.clone(e.maximum,t.maximum),t.center=n.Cartesian3.clone(e.center,t.center),t):new m(e.minimum,e.maximum,e.center)},m.equals=function(e,t){return e===t||i.defined(e)&&i.defined(t)&&n.Cartesian3.equals(e.center,t.center)&&n.Cartesian3.equals(e.minimum,t.minimum)&&n.Cartesian3.equals(e.maximum,t.maximum)};let r=new n.Cartesian3;m.intersectPlane=function(e,t){r=n.Cartesian3.subtract(e.maximum,e.minimum,r);const i=n.Cartesian3.multiplyByScalar(r,.5,r),m=t.normal,s=i.x*Math.abs(m.x)+i.y*Math.abs(m.y)+i.z*Math.abs(m.z),u=n.Cartesian3.dot(e.center,m)+t.distance;return u-s>0?a.Intersect.INSIDE:u+s<0?a.Intersect.OUTSIDE:a.Intersect.INTERSECTING},m.prototype.clone=function(e){return m.clone(this,e)},m.prototype.intersectPlane=function(e){return m.intersectPlane(this,e)},m.prototype.equals=function(e){return m.equals(this,e)},e.AxisAlignedBoundingBox=m}));
