/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-21 15:50:09
 * @LastEditTime: 2022-06-01 16:56:41
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\dynamic-render-data\index.ts
 */
import { defineComponent, h, watch, ref, nextTick } from 'vue'
import { store } from '@src/store'
import { cloneDeep } from 'lodash'
import {
  VcCollectionBillboard,
  VcCollectionPoint,
  VcCollectionPolyline,
  VcCollectionPrimitive,
  VcSelectionIndicator,
  VcDatasourceGeojson,
  VcDatasourceCustom,
  VcOverlayDynamic,
  VcOverlayHeatmap
} from 'vue-cesium'
import { useVueCesium } from 'vue-cesium'
import useTimeout from 'vue-cesium/es/composables/private/use-timeout'
import { clearSelectedRenderData, highlightRenderData } from '@src/utils/render-data'
import { logger } from '@src/utils'
import { VcRenderDataset } from '@src/types/render-data'

const cmpMap = {
  VcCollectionPrimitive,
  VcCollectionBillboard,
  VcCollectionPoint,
  VcCollectionPolyline,
  VcDatasourceGeojson,
  VcDatasourceCustom,
  VcOverlayDynamic,
  VcOverlayHeatmap
}

export default defineComponent({
  name: 'RenderData',
  setup(props, ctx) {
    const $vc = useVueCesium()

    const renderDatas = store.viewer.useRenderStore().renderDatas
    const selectedRenderData = store.viewer.useRenderStore().selectedRenderData
    const selectionIndicatorRef = ref(null)
    let selectedByPick = false
    const { registerTimeout, removeTimeout } = useTimeout()
    const { toggleGlobalLayout } = store.system.useLayoutStore()
    const { setMouseOverlayLabel, clearMouseOverlayLabel } = store.viewer.useOverlayStore()

    // watch
    let canDepart = false
    watch(
      () => cloneDeep(selectedRenderData),
      (val, oldValue) => {
        if (val.model) {
          const featureNew = val.feature
          const featureOld = oldValue.feature
          if (!selectedByPick && featureNew.properties.id !== featureOld?.properties?.id) {
            const positions = val.model.position || [
              Number(featureNew.properties?.longitude),
              Number(featureNew.properties?.latitude)
            ]
            if (val.model && positions && !isNaN(positions[0])) {
              removeTimeout()
              registerTimeout(() => {
                selectionIndicatorRef.value.position.value = Cesium.Cartesian3.fromDegrees(positions[0], positions[1])
                selectionIndicatorRef.value.animateAppear()
                canDepart = true
              }, 1500)
            }
          }
          selectedByPick = false
        } else {
          if (
            (canDepart && !selectedByPick) ||
            (!selectedByPick && selectionIndicatorRef.value.selectedFeature.value)
          ) {
            selectionIndicatorRef.value.animateDepart()
          }
          canDepart = false
        }
      },
      {
        deep: true
      }
    )

    // methods
    const onMouserOver = e => {
      const { viewer } = $vc
      viewer.canvas.setAttribute('style', 'cursor: pointer')
      const {
        defined,
        JulianDate,
        BoundingSphere,
        PointPrimitiveCollection,
        BillboardCollection,
        PolylineCollection,
        PrimitiveCollection,
        GeoJsonDataSource,
        CustomDataSource
      } = Cesium
      let text = ''
      let position
      let pixelOffset = [0, 0]
      if (e.cesiumObject instanceof BillboardCollection || e.cesiumObject instanceof PointPrimitiveCollection) {
        const pickedPrimitive = e.pickedFeature.primitive
        const feature = pickedPrimitive?.feature

        if (defined(feature)) {
          text = feature.properties?.name
          position = pickedPrimitive.position || e.surfacePosition
          pixelOffset = [16, 16]
        }
      } else if (e.cesiumObject instanceof PolylineCollection) {
        const pickedPrimitive = e.pickedFeature.primitive
        const feature = pickedPrimitive?.feature

        if (defined(feature)) {
          text = feature.properties?.name
          const positions = pickedPrimitive.positions
          const boundingSphere = BoundingSphere.fromPoints(positions)
          position = boundingSphere.center
          pixelOffset = [16, 16]
        }
      } else if (e.cesiumObject instanceof PrimitiveCollection) {
        // 一般来说是面图元
        const pickedPrimitive = e.pickedFeature.primitive?._vcParent
        const feature = pickedPrimitive?.feature

        if (defined(feature)) {
          text = feature.properties?.name
          const positions = pickedPrimitive.positions.length
            ? pickedPrimitive.positions
            : pickedPrimitive.polygonHierarchy.positions
          const boundingSphere = BoundingSphere.fromPoints(positions)
          position = boundingSphere.center
          pixelOffset = [16, 16]
        }
      } else if (e.cesiumObject instanceof CustomDataSource || e.cesiumObject instanceof GeoJsonDataSource) {
        const pickedEntity = e.pickedFeature.id
        const feature = pickedEntity?.feature
        if (defined(feature)) {
          const properties = feature.properties
          text = properties?.name
          const actualRenderingType = properties?.actualRenderingType
          let boundingSphere, positions
          switch (actualRenderingType) {
            case 'billboard':
              position = pickedEntity.position.getValue(JulianDate.now())
              break
            case 'polyline':
              // 中心点算法一
              positions = pickedEntity.polyline.positions.getValue()
              boundingSphere = BoundingSphere.fromPoints(positions)
              position = boundingSphere.center
              break
            case 'polygon':
              // 中心点算法一
              positions = pickedEntity.polygon.hierarchy.getValue().positions
              boundingSphere = BoundingSphere.fromPoints(positions)
              position = boundingSphere.center
              break
            case 'geojson': // 区划数据
              // 中心点算法二
              text = pickedEntity.properties.dValue.getValue()
              boundingSphere = new Cesium.BoundingSphere()
              ;(viewer.dataSourceDisplay as any).getBoundingSphere(pickedEntity, true, boundingSphere)
              position = boundingSphere.center
              break
          }

          pixelOffset = [16, 16]
        }
      }
      text &&
        text !== '' &&
        setMouseOverlayLabel({
          position,
          show: true,
          text,
          pixelOffset
        })
    }

    const onMouseOut = e => {
      const { viewer } = $vc
      viewer.canvas.setAttribute('style', 'cursor: auto')
      clearMouseOverlayLabel()
    }

    const onPickEvt = picked => {
      if (picked) {
        if (picked.id !== '__Vc__Pick__Location__') {
          selectedByPick = true
          // 隐藏要素信息面板

          toggleGlobalLayout({
            featureInfo: false
          })
          // 设个延时切换选中对象时，动画效果才能正常
          setTimeout(() => {
            const { viewer } = $vc
            const { defined, JulianDate, BoundingSphere } = Cesium
            // zouyaoji tips
            // 面图元 对象用的 PolygonPrimitive，feature 存 PolygonPrimitive 上面了
            // Cesium 拾取 API直接拾取到的是 PolygonPrimitive._primitive
            // 所以要用 _vcParent 代理一下
            const feature = picked.cesiumObject?.feature || picked.cesiumObject?._vcParent?.feature
            if (defined(feature)) {
              nextTick(() => {
                const { actualRenderingType, datasetId, id, renderingApi } = feature.properties
                highlightRenderData(actualRenderingType, datasetId, id).then(() => {
                  let boundingSphere, positions, position
                  const pickedFeature = picked.cesiumObject
                  switch (actualRenderingType) {
                    case 'billboard':
                      // 从对象取
                      position =
                        renderingApi === 'primitive'
                          ? pickedFeature.position
                          : pickedFeature.position.getValue(JulianDate.now())
                      break
                    case 'polyline':
                      // 从对象取
                      positions =
                        renderingApi === 'primitive'
                          ? pickedFeature.positions
                          : pickedFeature.polyline.positions.getValue()
                      boundingSphere = BoundingSphere.fromPoints(positions)
                      position = boundingSphere.center
                      break
                    case 'polygon':
                      // 从对象取
                      positions =
                        renderingApi === 'primitive'
                          ? pickedFeature._vcParent?.polygonHierarchy.positions
                          : pickedFeature.polygon.hierarchy.getValue().positions
                      boundingSphere = BoundingSphere.fromPoints(positions)
                      position = boundingSphere.center
                      // 从属性取
                      break
                    case 'geojson': // 区划数据
                      // 中心点算法二
                      boundingSphere = new Cesium.BoundingSphere()
                      ;(viewer.dataSourceDisplay as any).getBoundingSphere(pickedFeature, true, boundingSphere)
                      position = boundingSphere.center
                      break
                  }
                })
              })
            }
          }, 100)
        }
      } else {
        clearSelectedRenderData()
        toggleGlobalLayout({
          featureInfo: false
        })
      }
    }

    function setRef(this, el) {
      const dataset = this
      dataset.cmpRef = el
    }

    const getChildRenderContent = (datasets: Array<VcRenderDataset>) => {
      const child = []
      datasets?.forEach(dataset => {
        const cmp = cmpMap[dataset.cmpName]
        if (!cmp) {
          logger.error(
            `添加渲染数据集失败，原因：没要找到渲染组件名【${dataset.cmpName}】。`,
            '渲染集合数据模型：',
            dataset
          )
          return
        }

        child.push(
          h(
            cmp,
            {
              ...dataset.props,
              ref: setRef.bind(dataset),
              onMouseover: onMouserOver,
              onMouseout: onMouseOut
            },
            () => getChildRenderContent(dataset?.children)
          )
        )
      })

      return child
    }

    return () => {
      const renders = []
      // 拾取
      renders.push(
        h(VcSelectionIndicator, {
          ref: selectionIndicatorRef,
          onPickEvt: onPickEvt
        })
      )
      // 动态渲染的组件
      renderDatas.forEach(renderData => {
        renderData?.datasets.forEach(dataset => {
          const cmp = cmpMap[dataset.cmpName]
          if (!cmp) {
            logger.error(
              `添加渲染数据集失败，原因：没要找到渲染组件名【${dataset.cmpName}】。`,
              '渲染集合数据模型：',
              dataset
            )
            return
          }
          renders.push(
            h(
              cmp,
              {
                ...dataset.props,
                ref: setRef.bind(dataset),
                onMouseover: onMouserOver,
                onMouseout: onMouseOut
              },
              () => getChildRenderContent(dataset?.children)
            )
          )
        })
      })
      return renders
    }
  }
})
