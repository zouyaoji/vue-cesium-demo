import { logger } from '@src/utils'
import { ref, reactive, defineComponent, h, VNode, PropType, getCurrentInstance } from 'vue'
import {
  VcCollectionPoint,
  VcCollectionPrimitive,
  VcCollectionPrimitiveRef,
  VcGeometryGroundPolyline,
  VcGeometryInstance,
  VcGeometryPolyline,
  VcPointProps,
  VcPolygon,
  VcPrimitive,
  VcPrimitiveGroundPolyline
} from 'vue-cesium'
import useTimeout from 'vue-cesium/es/composables/private/use-timeout'
import { makeCartesian3Array } from 'vue-cesium/es/utils/cesium-helpers'
import { VcCartesian3Array, VcPickEvent, VcPosition, VcReadyObject } from 'vue-cesium/es/utils/types'

import { useVueCesium } from 'vue-cesium'
import { circle } from '@turf/turf'

export type TyphoonDatasource = {
  name: string
  typhoonData: any
  show: boolean
  points?: VcPointProps[]
  positions: VcPosition[]
  playInterval?: number
  playIndex?: number
  children?: TyphoonDatasource[]
  type?: 'live' | 'forc'
}

export default defineComponent({
  name: 'VcTyphoon',
  props: {
    typhoonDatas: Array as PropType<any[]>,
    clampToGround: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 100
    },
    radius7Color: {
      type: String,
      default: '#00bab2'
    },
    radius10Color: {
      type: String,
      default: '#ffff00'
    },
    radius12Color: {
      type: String,
      default: '#da7341'
    }
  },
  emits: {
    mouseover: (e: VcPickEvent) => true,
    mouseout: (e: VcPickEvent) => true,
    click: (e: VcPickEvent) => true,
    clickout: (e: VcPickEvent) => true
  },
  setup(props, ctx) {
    const instance = getCurrentInstance()
    const primitiveCollectionRef = ref<VcCollectionPrimitiveRef>(null)
    const { registerTimeout, removeTimeout } = useTimeout()
    const $vc = useVueCesium()
    const typhoonDatasources: TyphoonDatasource[] = reactive([])

    const getPointColor = strong => {
      let color = ''
      switch (strong) {
        case 'STS':
          color = '#0F8000'
          break
        case 'TY':
          color = '#FE9C45'
          break
        case 'STY':
          color = '#FE00FE'
          break
        case 'Super TY':
          color = '#FE0000'
          break
        case 'TD':
          color = '#EED139'
          break
        case 'TS':
          color = '#0000FF'
          break

        default:
          color = '#409eff'
          break
      }
      return color
    }

    const addTyphoonPath = (index: number, datasource: TyphoonDatasource) => {
      datasource.playIndex = index
      const point = datasource.typhoonData.points[index]
      point.type = 'live'
      point.index = index
      point.tfbh = datasource.name
      const position = [point.lng, point.lat]
      datasource.positions.push(position)
      datasource.points.push({
        id: point.id || Cesium.createGuid(),
        position,
        color: getPointColor(point.strong),
        pixelSize: 8,
        outlineColor: 'rgba(0,0,0,0.6)',
        outlineWidth: 1,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        onMouseover(evt: VcPickEvent) {
          // $vc.viewer.canvas.style.cursor = 'pointer'
          // e.pickedFeature.primitive.pixelSize = 8 * 1.5
          // removeTimeout()
          // registerTimeout(() => {
          //   // 弹出详情逻辑
          // }, 100)
          ctx.emit('mouseover', evt)
        },
        onMouseout(evt) {
          // $vc.viewer.canvas.style.cursor = 'auto'
          // e.pickedFeature.primitive.pixelSize = 8 * 1
          // removeTimeout()
          // registerTimeout(() => {
          //   // 移除详情逻辑
          // }, 100)
          ctx.emit('mouseout', evt)
        },
        onClick(evt) {
          showForecast(point, datasource)
          datasource.playIndex = point.index

          ctx.emit('click', evt)
        },
        onClickout(evt) {
          ctx.emit('clickout', evt)
        },
        ...point
      })

      // 最后一个实况点，展示预报路径
      if (index === datasource.typhoonData.points.length - 1) {
        showForecast(point, datasource)
      }
    }

    const addTyphoonByInterval = (tfbh: string, interval?: number) => {
      const typhoonDatasourceIndex = typhoonDatasources.findIndex(datasource => datasource.name === tfbh)
      if (typhoonDatasourceIndex >= 0) {
        let index = 0
        const datasource = typhoonDatasources[typhoonDatasourceIndex] as TyphoonDatasource
        datasource.points.length = 0
        datasource.positions.length = 0
        const typhoonData = datasource.typhoonData
        addTyphoonPath(index, datasource)
        clearInterval(datasource.playInterval)
        datasource.playInterval = setInterval(() => {
          index++
          if (index >= typhoonData.points.length) {
            clearInterval(datasource.playInterval)
          } else {
            addTyphoonPath(index, datasource)
          }
        }, interval || props.interval)
      } else {
        logger.warn('播放台风失败，原因：未找到对应编号的台风数据。')
      }
    }

    const showForecast = (livePoint, datasource: TyphoonDatasource) => {
      // 1. 删除预报数据
      datasource.children.length = 0
      // 2. 添加预报
      const forecast = livePoint.forecast
      if (!forecast || forecast.length <= 0) {
        return
      }

      for (let i = 0; i < forecast.length; i++) {
        // 预报机构数据
        const typhoonDataBySet = forecast[i]

        const points: VcPointProps[] = []
        const positions: VcPosition[] = []
        const datasourceBySet: TyphoonDatasource = {
          name: datasource.name + '_' + typhoonDataBySet.sets,
          typhoonData: typhoonDataBySet,
          show: true,
          positions,
          points,
          type: 'forc'
        }
        datasource.children.push(datasourceBySet)

        typhoonDataBySet.points.forEach((point, index) => {
          const position = [point.lng, point.lat]
          datasourceBySet.positions.push(position)
          if (index === 0) {
            datasourceBySet.positions.push([livePoint.lng, livePoint.lat])
          }

          point.sets = typhoonDataBySet.sets
          point.type = 'forc'
          point.index = index

          datasourceBySet.points.push({
            id: point.id || Cesium.createGuid(),
            position,
            color: getPointColor(point.strong),
            pixelSize: 8,
            outlineColor: 'rgba(0,0,0,0.6)',
            outlineWidth: 1,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            onMouseover(evt: VcPickEvent) {
              // $vc.viewer.canvas.style.cursor = 'pointer'
              // e.pickedFeature.primitive.pixelSize = 8 * 1.5
              // removeTimeout()
              // registerTimeout(() => {
              //   // 弹出详情逻辑
              // }, 100)
              ctx.emit('mouseover', evt)
            },
            onMouseout(evt) {
              // $vc.viewer.canvas.style.cursor = 'auto'
              // e.pickedFeature.primitive.pixelSize = 8 * 1
              // removeTimeout()
              // registerTimeout(() => {
              //   // 移除详情逻辑
              // }, 100)
              ctx.emit('mouseout', evt)
            },
            onClick(evt) {
              ctx.emit('click', evt)
            },
            ...point
          })
        })
      }
    }

    const addTyphoonData = typhoonData => {
      const points: VcPointProps[] = []
      const positions: VcPosition[] = []
      const typhoonDatasource: TyphoonDatasource = {
        name: typhoonData.tfbh,
        typhoonData,
        show: true,
        positions,
        points,
        children: [],
        type: 'live'
      }

      typhoonDatasources.push(typhoonDatasource)

      addTyphoonByInterval(typhoonData.tfbh)

      return typhoonDatasource
    }

    const flyToTyphoonData = (
      typhoon: string | string[],
      options?: {
        duration?: number
        offset?: Cesium.HeadingPitchRange
        complete?: Cesium.Camera.FlightCompleteCallback
        cancel?: Cesium.Camera.FlightCancelledCallback
        endTransform?: Cesium.Matrix4
        maximumHeight?: number
        pitchAdjustHeight?: number
        flyOverLongitude?: number
        flyOverLongitudeWeight?: number
        easingFunction?: Cesium.EasingFunction.Callback
      }
    ) => {
      const names = []
      if (typeof typhoon === 'string') {
        names.push(typhoon)
      } else {
        names.push(...typhoon)
      }

      let boundingSphereUnion = null
      names.forEach(name => {
        const positions = []
        const typhoonDatasource = typhoonDatasources.find(v => v.name === name)
        if (typhoonDatasource && typhoonDatasource.typhoonData.points) {
          typhoonDatasource.typhoonData.points.forEach(point => {
            positions.push([point.lng, point.lat])
          })
        }

        const cartesian3Array = makeCartesian3Array(positions)
        const boundingSphere = Cesium.BoundingSphere.fromPoints(cartesian3Array as Cesium.Cartesian3[])
        if (null === boundingSphereUnion) {
          boundingSphereUnion = boundingSphere
        } else {
          boundingSphereUnion = Cesium.BoundingSphere.union(boundingSphereUnion, boundingSphere)
        }
      })

      $vc.viewer.camera.flyToBoundingSphere(boundingSphereUnion, {
        ...options
      })
    }

    const removeTyphoonData = (datasource: TyphoonDatasource) => {
      const index = typhoonDatasources.indexOf(datasource)
      if (index >= 0) {
        clearInterval(datasource.playInterval)
        typhoonDatasources.splice(index, 1)
      }
    }

    const removeAllTyphoonData = () => {
      typhoonDatasources.forEach(datasource => {
        clearInterval(datasource.playInterval)
      })
      typhoonDatasources.length = 0
    }

    const getTyphoonCirclePostions = (center: VcPosition, radiusData) => {
      let positions: VcPosition[] = []
      if (typeof radiusData === 'number') {
        positions = circle(center as number[], radiusData * 1000, {
          units: 'meters'
        }).geometry.coordinates as unknown as VcPosition[]
      } else if (radiusData['ne']) {
        const _angInterval = 6
        const _pointNums = 360 / (_angInterval * 4)
        const quadrant = {
          // 逆时针算角度
          '0': 'ne',
          '1': 'nw',
          '2': 'sw',
          '3': 'se'
        }
        for (let i = 0; i < 4; i++) {
          let _r = parseFloat(radiusData[quadrant[i]]) * 1000 // 单位是km
          if (!_r) _r = 0
          for (let j = i * _pointNums; j <= (i + 1) * _pointNums; j++) {
            const _ang = _angInterval * j
            const x: number = center[0] + (_r * Math.cos((_ang * Math.PI) / 180)) / 111000
            const y: number = center[1] + (_r * Math.sin((_ang * Math.PI) / 180)) / 111000
            positions.push([x, y])
          }
        }
      }
      return positions as VcCartesian3Array
    }

    const getChildren = datasources => {
      const children: Array<VNode> = []
      datasources.forEach(typhoonDatasource => {
        // polyline 台风路径-线
        if (typhoonDatasource.positions.length > 1) {
          children.push(
            h(
              props.clampToGround ? VcPrimitiveGroundPolyline : VcPrimitive,
              {
                show: true,
                enableMouseEvent: true,
                asynchronous: false,
                classificationType: 2,
                appearance: {
                  type: 'PolylineMaterialAppearance',
                  options: {
                    material: {
                      fabric: {
                        type: typhoonDatasource.type === 'live' ? 'Color' : 'PolylineDash',
                        uniforms: {
                          color: 'rgba(0,0,0,0.5)'
                        }
                      }
                    },
                    translucent: true
                  }
                },
                onMouseover(evt) {
                  ctx.emit('mouseover', evt)
                },
                onMouseout(evt) {
                  ctx.emit('mouseout', evt)
                },
                onClick(evt) {
                  ctx.emit('click', evt)
                },
                onClickout(evt) {
                  ctx.emit('clickout', evt)
                }
              },
              () =>
                h(
                  VcGeometryInstance,
                  {
                    id: typhoonDatasource.name || Cesium.createGuid()
                  },
                  () =>
                    h(props.clampToGround ? VcGeometryGroundPolyline : VcGeometryPolyline, {
                      positions: makeCartesian3Array(typhoonDatasource.positions as VcCartesian3Array),
                      width: 2.0,
                      arcType: Cesium.ArcType.RHUMB,
                      show: true
                    })
                )
            )
          )
        }
        // points 台风路径-点
        children.push(
          h(VcCollectionPoint, {
            points: typhoonDatasource.points,
            onReady: (e: VcReadyObject) => {
              const { cesiumObject: pointPrimitiveCollection } = e as any
              const originalUpdate = pointPrimitiveCollection.update

              pointPrimitiveCollection.update = function (frameState) {
                const originalLength = frameState.commandList.length
                originalUpdate.call(this, frameState)
                const endLength = frameState.commandList.length
                for (let i = originalLength; i < endLength; ++i) {
                  frameState.commandList[i].pass = Cesium['Pass'].TRANSLUCENT
                  frameState.commandList[i].renderState = Cesium['RenderState'].fromCache({
                    depthTest: {
                      enabled: false
                    },
                    depthMask: false
                  })
                }
              }
            }
          })
        )
        // polygon 台风风圈
        if (typhoonDatasource.type === 'live') {
          const point = typhoonDatasource.points[typhoonDatasource.playIndex]
          // 7 级风圈
          if (point?.radius7 > 0) {
            children.push(
              h(VcPolygon, {
                positions: getTyphoonCirclePostions(point.position, point.radius7_quad),
                clampToGround: props.clampToGround,
                asynchronous: false,
                classificationType: 2,
                appearance: {
                  type: 'MaterialAppearance',
                  options: {
                    material: {
                      fabric: {
                        type: 'Color',
                        uniforms: {
                          color: props.radius7Color
                        }
                      }
                    },
                    faceForward: true,
                    renderState: {
                      cull: {
                        enabled: false
                      },
                      depthTest: {
                        enabled: false
                      }
                    }
                  }
                }
              })
            )
          }
          // 10 级风圈
          if (point?.radius10 > 0) {
            children.push(
              h(VcPolygon, {
                positions: getTyphoonCirclePostions(point.position, point.radius10_quad),
                clampToGround: props.clampToGround,
                asynchronous: false,
                classificationType: 2,
                appearance: {
                  type: 'MaterialAppearance',
                  options: {
                    material: {
                      fabric: {
                        type: 'Color',
                        uniforms: {
                          color: props.radius10Color
                        }
                      }
                    },
                    faceForward: true,
                    renderState: {
                      cull: {
                        enabled: false
                      },
                      depthTest: {
                        enabled: false
                      }
                    }
                  }
                }
              })
            )
          }
          // 12 级风圈
          if (point?.radius12 > 0) {
            children.push(
              h(VcPolygon, {
                positions: getTyphoonCirclePostions(point.position, point.radius12_quad),
                clampToGround: props.clampToGround,
                asynchronous: false,
                classificationType: 2,
                appearance: {
                  type: 'MaterialAppearance',
                  options: {
                    material: {
                      fabric: {
                        type: 'Color',
                        uniforms: {
                          color: props.radius12Color
                        }
                      }
                    },
                    faceForward: true,
                    renderState: {
                      cull: {
                        enabled: false
                      },
                      depthTest: {
                        enabled: false
                      }
                    }
                  }
                }
              })
            )
          }
        }

        if (typhoonDatasource.children) {
          children.push(...getChildren(typhoonDatasource.children))
        }
      })

      return children
    }

    Object.assign(instance.proxy, {
      addTyphoonData,
      addTyphoonByInterval,
      flyToTyphoonData,
      removeTyphoonData,
      removeAllTyphoonData,
      getTyphoonDatasources: () => typhoonDatasources
    })

    props.typhoonDatas.forEach(typhoonData => {
      addTyphoonData(typhoonData)
    })

    return () => {
      const children = getChildren(typhoonDatasources)

      return h(
        VcCollectionPrimitive,
        {
          ref: primitiveCollectionRef,
          show: true
        },
        () => children
      )
    }
  }
})
