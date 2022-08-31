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
define(["exports","./Matrix2-21f90abf","./RuntimeError-cef79f54","./defaultValue-4607806f","./WebGLConstants-f100e3dd","./Transforms-c450597e"],(function(t,e,n,a,r,i){"use strict";var o=Object.freeze({NONE:0,TRIANGLES:1,LINES:2,POLYLINES:3});const s={POINTS:r.WebGLConstants.POINTS,LINES:r.WebGLConstants.LINES,LINE_LOOP:r.WebGLConstants.LINE_LOOP,LINE_STRIP:r.WebGLConstants.LINE_STRIP,TRIANGLES:r.WebGLConstants.TRIANGLES,TRIANGLE_STRIP:r.WebGLConstants.TRIANGLE_STRIP,TRIANGLE_FAN:r.WebGLConstants.TRIANGLE_FAN,isLines:function(t){return t===s.LINES||t===s.LINE_LOOP||t===s.LINE_STRIP},isTriangles:function(t){return t===s.TRIANGLES||t===s.TRIANGLE_STRIP||t===s.TRIANGLE_FAN},validate:function(t){return t===s.POINTS||t===s.LINES||t===s.LINE_LOOP||t===s.LINE_STRIP||t===s.TRIANGLES||t===s.TRIANGLE_STRIP||t===s.TRIANGLE_FAN}};var u=Object.freeze(s);function I(t){t=a.defaultValue(t,a.defaultValue.EMPTY_OBJECT),this.attributes=t.attributes,this.indices=t.indices,this.primitiveType=a.defaultValue(t.primitiveType,u.TRIANGLES),this.boundingSphere=t.boundingSphere,this.geometryType=a.defaultValue(t.geometryType,o.NONE),this.boundingSphereCV=t.boundingSphereCV,this.offsetAttribute=t.offsetAttribute}I.computeNumberOfVertices=function(t){let e=-1;for(const n in t.attributes)if(t.attributes.hasOwnProperty(n)&&a.defined(t.attributes[n])&&a.defined(t.attributes[n].values)){const a=t.attributes[n];e=a.values.length/a.componentsPerAttribute}return e};const N=new e.Cartographic,T=new e.Cartesian3,c=new e.Matrix4,l=[new e.Cartographic,new e.Cartographic,new e.Cartographic],f=[new e.Cartesian2,new e.Cartesian2,new e.Cartesian2],L=[new e.Cartesian2,new e.Cartesian2,new e.Cartesian2],E=new e.Cartesian3,m=new i.Quaternion,p=new e.Matrix4,y=new e.Matrix2;I._textureCoordinateRotationPoints=function(t,n,a,r){let o;const s=e.Rectangle.center(r,N),u=e.Cartographic.toCartesian(s,a,T),I=i.Transforms.eastNorthUpToFixedFrame(u,a,c),b=e.Matrix4.inverse(I,c),C=f,h=l;h[0].longitude=r.west,h[0].latitude=r.south,h[1].longitude=r.west,h[1].latitude=r.north,h[2].longitude=r.east,h[2].latitude=r.south;let A=E;for(o=0;o<3;o++)e.Cartographic.toCartesian(h[o],a,A),A=e.Matrix4.multiplyByPointAsVector(b,A,A),C[o].x=A.x,C[o].y=A.y;const d=i.Quaternion.fromAxisAngle(e.Cartesian3.UNIT_Z,-n,m),x=e.Matrix3.fromQuaternion(d,p),S=t.length;let P=Number.POSITIVE_INFINITY,G=Number.POSITIVE_INFINITY,R=Number.NEGATIVE_INFINITY,_=Number.NEGATIVE_INFINITY;for(o=0;o<S;o++)A=e.Matrix4.multiplyByPointAsVector(b,t[o],A),A=e.Matrix3.multiplyByVector(x,A,A),P=Math.min(P,A.x),G=Math.min(G,A.y),R=Math.max(R,A.x),_=Math.max(_,A.y);const O=e.Matrix2.fromRotation(n,y),g=L;g[0].x=P,g[0].y=G,g[1].x=P,g[1].y=_,g[2].x=R,g[2].y=G;const w=C[0],V=C[2].x-w.x,M=C[1].y-w.y;for(o=0;o<3;o++){const t=g[o];e.Matrix2.multiplyByVector(O,t,t),t.x=(t.x-w.x)/V,t.y=(t.y-w.y)/M}const v=g[0],F=g[1],W=g[2],Y=new Array(6);return e.Cartesian2.pack(v,Y),e.Cartesian2.pack(F,Y,2),e.Cartesian2.pack(W,Y,4),Y},t.Geometry=I,t.GeometryAttribute=function(t){t=a.defaultValue(t,a.defaultValue.EMPTY_OBJECT),this.componentDatatype=t.componentDatatype,this.componentsPerAttribute=t.componentsPerAttribute,this.normalize=a.defaultValue(t.normalize,!1),this.values=t.values},t.GeometryType=o,t.PrimitiveType=u}));
