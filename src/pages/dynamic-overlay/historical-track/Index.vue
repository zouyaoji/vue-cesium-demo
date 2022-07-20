<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-06-14 11:08:07
 * @LastEditTime: 2022-07-20 13:31:46
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-overlay\historical-track\Index.vue
-->
<template>
  <div class="page-demo-dynamic-overlay absolute z-top"></div>
</template>

<script lang="ts" setup>
import faker from 'faker'
import { onMounted, ref, toRef } from 'vue'
import { store } from '@src/store'
import { addRenderDatas, getRenderDataByDatasetId } from '@src/utils/render-data'
import { VcRenderData } from '@src/types/render-data'
import * as api from '@src/api'
import { VcEntityProps, VcGraphicsRectangleProps, VcOverlayDynamicRef, VcPointProps } from 'vue-cesium'
import { DynamicOverlayOpts, SampledPosition } from 'vue-cesium/es/utils/types'
import { logger } from '@src/utils'
import { useVueCesium } from 'vue-cesium'

const { loadDefaultLayers } = store.viewer.useLayerStore()
const $vc = useVueCesium()
const overlayDynamicRef = ref<any>(null)
const shouldAnimate = ref(false)
const currentTime = ref(null)
const startTime = ref(null)
const stopTime = ref(null)

onMounted(() => {
  loadDefaultLayers(true)
  api.common.getStaticData('/datas/dynamic-overlay.json').then(res => {
    renderDynamicOverlay([res.data])
  })
})

const renderDynamicOverlay = async routes => {
  const renderData = await getRenderDataByDatasetId('DynamicOverlay')

  if (renderData) {
    //
  } else {
    const renderData: VcRenderData = {
      id: 'DynamicOverlay',
      name: '历史轨迹',
      page: '/demo/dynamic-overlay',
      datasets: []
    }

    const { overlays, stops } = generateOverlaysAndStops(routes)

    const props = {
      show: true,
      dynamicOverlays: overlays as DynamicOverlayOpts[]
    }

    renderData.datasets.push({
      cmpName: 'VcOverlayDynamic',
      props: {
        shouldAnimate: shouldAnimate,
        'onUpdate:shouldAnimate': val => {
          shouldAnimate.value = val
        },
        currentTime: currentTime,
        startTime: startTime,
        stopTime: stopTime,
        multiplier: 1000,
        onReady: e => {
          overlayDynamicRef.value = e.vm
        },
        ...props
      }
    })

    renderData.datasets.push({
      cmpName: 'VcCollectionPoint',
      props: {
        points: stops
      }
    })

    addRenderDatas(renderData)
  }
}

const generateOverlaysAndStops = routes => {
  const overlays = []
  const stops: Array<VcPointProps> = []
  routes.forEach(route => {
    const sampledPositions: Array<SampledPosition> = []
    const linePositions = []
    const show = toRef(route, 'checked')
    route.stops.forEach(stop => {
      sampledPositions.push({
        position: [stop.lon, stop.lat],
        time: stop.DATE_TIME,
        id: faker.datatype.uuid()
      })
      linePositions.push([stop.lon, stop.lat])

      stops.push({
        id: faker.datatype.uuid(),
        position: [stop.lon, stop.lat],
        color: 'rgb(255,229,0)',
        show: show,
        ...stop,
        distanceDisplayCondition: [0, 5000000],
        scaleByDistance: [100, 2.0, 2500000, 0.5],
        onMouseover: e => {
          //
        },
        onMouseout: e => {
          //
        }
      })
    })

    let rotation = Cesium.Math.toRadians(30)

    overlays.push({
      id: String(route.TYPHOON_ID),
      show: show as any,
      maxCacheSize: route.stops.length,
      polyline: {
        positions: linePositions,
        width: 3,
        material: route.TYPHOON_CODE ? '#2d8cf0' : '#69B273',
        depthFailMaterial: route.TYPHOON_CODE ? '#2d8cf0' : '#69B273',
        clampToGround: true
      },
      sampledPositions
    })
  })

  return {
    overlays,
    stops
  }
}

const zoomToOverlay = TYPHOON_ID => {
  const renderData = getRenderDataByDatasetId('DynamicOverlay')

  if (renderData) {
    console.log(renderData)
    const cmpRef = renderData.datasets[0].cmpRef as VcOverlayDynamicRef
    cmpRef.zoomToOverlay(String(TYPHOON_ID) as any)
  } else {
    logger.error('定位到该台风失败，原因：台风还未添加。')
  }
}

window.zoomToOverlay = zoomToOverlay
</script>
