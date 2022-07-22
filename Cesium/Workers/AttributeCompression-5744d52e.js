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
define(["exports","./Matrix2-73789715","./ComponentDatatype-e7fbe225","./RuntimeError-4f8ec8a2","./defaultValue-97284df2"],(function(t,e,n,o,a){"use strict";const r={SCALAR:"SCALAR",VEC2:"VEC2",VEC3:"VEC3",VEC4:"VEC4",MAT2:"MAT2",MAT3:"MAT3",MAT4:"MAT4",getMathType:function(t){switch(t){case r.SCALAR:return Number;case r.VEC2:return e.Cartesian2;case r.VEC3:return e.Cartesian3;case r.VEC4:return e.Cartesian4;case r.MAT2:return e.Matrix2;case r.MAT3:return e.Matrix3;case r.MAT4:return e.Matrix4}},getNumberOfComponents:function(t){switch(t){case r.SCALAR:return 1;case r.VEC2:return 2;case r.VEC3:return 3;case r.VEC4:case r.MAT2:return 4;case r.MAT3:return 9;case r.MAT4:return 16}},getAttributeLocationCount:function(t){switch(t){case r.SCALAR:case r.VEC2:case r.VEC3:case r.VEC4:return 1;case r.MAT2:return 2;case r.MAT3:return 3;case r.MAT4:return 4}},getGlslType:function(t){switch(t){case r.SCALAR:return"float";case r.VEC2:return"vec2";case r.VEC3:return"vec3";case r.VEC4:return"vec4";case r.MAT2:return"mat2";case r.MAT3:return"mat3";case r.MAT4:return"mat4"}}};var c=Object.freeze(r);const s=1/256,u={octEncodeInRange:function(t,e,o){if(o.x=t.x/(Math.abs(t.x)+Math.abs(t.y)+Math.abs(t.z)),o.y=t.y/(Math.abs(t.x)+Math.abs(t.y)+Math.abs(t.z)),t.z<0){const t=o.x,e=o.y;o.x=(1-Math.abs(e))*n.CesiumMath.signNotZero(t),o.y=(1-Math.abs(t))*n.CesiumMath.signNotZero(e)}return o.x=n.CesiumMath.toSNorm(o.x,e),o.y=n.CesiumMath.toSNorm(o.y,e),o},octEncode:function(t,e){return u.octEncodeInRange(t,255,e)}},i=new e.Cartesian2,C=new Uint8Array(1);function M(t){return C[0]=t,C[0]}u.octEncodeToCartesian4=function(t,e){return u.octEncodeInRange(t,65535,i),e.x=M(i.x*s),e.y=M(i.x),e.z=M(i.y*s),e.w=M(i.y),e},u.octDecodeInRange=function(t,o,a,r){if(r.x=n.CesiumMath.fromSNorm(t,a),r.y=n.CesiumMath.fromSNorm(o,a),r.z=1-(Math.abs(r.x)+Math.abs(r.y)),r.z<0){const t=r.x;r.x=(1-Math.abs(r.y))*n.CesiumMath.signNotZero(t),r.y=(1-Math.abs(t))*n.CesiumMath.signNotZero(r.y)}return e.Cartesian3.normalize(r,r)},u.octDecode=function(t,e,n){return u.octDecodeInRange(t,e,255,n)},u.octDecodeFromCartesian4=function(t,e){const n=256*t.x+t.y,o=256*t.z+t.w;return u.octDecodeInRange(n,o,65535,e)},u.octPackFloat=function(t){return 256*t.x+t.y};const f=new e.Cartesian2;function m(t){return t>>1^-(1&t)}u.octEncodeFloat=function(t){return u.octEncode(t,f),u.octPackFloat(f)},u.octDecodeFloat=function(t,e){const n=t/256,o=Math.floor(n),a=256*(n-o);return u.octDecode(o,a,e)},u.octPack=function(t,e,n,o){const a=u.octEncodeFloat(t),r=u.octEncodeFloat(e),c=u.octEncode(n,f);return o.x=65536*c.x+a,o.y=65536*c.y+r,o},u.octUnpack=function(t,e,n,o){let a=t.x/65536;const r=Math.floor(a),c=65536*(a-r);a=t.y/65536;const s=Math.floor(a),i=65536*(a-s);u.octDecodeFloat(c,e),u.octDecodeFloat(i,n),u.octDecode(r,s,o)},u.compressTextureCoordinates=function(t){return 4096*(4095*t.x|0)+(4095*t.y|0)},u.decompressTextureCoordinates=function(t,e){const n=t/4096,o=Math.floor(n);return e.x=o/4095,e.y=(t-4096*o)/4095,e},u.zigZagDeltaDecode=function(t,e,n){const o=t.length;let r=0,c=0,s=0;for(let u=0;u<o;++u)r+=m(t[u]),c+=m(e[u]),t[u]=r,e[u]=c,a.defined(n)&&(s+=m(n[u]),n[u]=s)},u.dequantize=function(t,e,o,a){const r=c.getNumberOfComponents(o);let s;switch(e){case n.ComponentDatatype.BYTE:s=127;break;case n.ComponentDatatype.UNSIGNED_BYTE:s=255;break;case n.ComponentDatatype.SHORT:s=32767;break;case n.ComponentDatatype.UNSIGNED_SHORT:s=65535;break;case n.ComponentDatatype.INT:s=2147483647;break;case n.ComponentDatatype.UNSIGNED_INT:s=4294967295}const u=new Float32Array(a*r);for(let e=0;e<a;e++)for(let n=0;n<r;n++){const o=e*r+n;u[o]=Math.max(t[o]/s,-1)}return u},u.decodeRGB565=function(t,e){const n=t.length;a.defined(e)||(e=new Float32Array(3*n));const o=1/31;for(let a=0;a<n;a++){const n=t[a],r=n>>11,c=n>>5&63,s=31&n,u=3*a;e[u]=r*o,e[u+1]=.015873015873015872*c,e[u+2]=s*o}return e},t.AttributeCompression=u}));
