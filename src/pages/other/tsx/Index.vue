<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-17 21:58:58
 * @LastEditTime: 2022-10-20 01:11:59
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\other\tsx\Index.vue
-->
<template>
  <div class="z-top absolute-center page-test">
    <vc-entity
      :position="[114, 40, 1.0]"
      description="Hello Vue Cesium"
      @click="onEntityEvt1"
      @mouseover="onEntityEvt1"
      @mouseout="onEntityEvt1"
    >
      <vc-graphics-model
        ref="model1"
        uri="https://zouyaoji.top/vue-cesium/SampleData/models/GroundVehicle/GroundVehicle.glb"
      ></vc-graphics-model>
    </vc-entity>
    <vc-entity
      :position="[114.00005, 40, 1.0]"
      description="Hello Vue Cesium"
      @click="onEntityEvt2"
      @mouseover="onEntityEvt2"
      @mouseout="onEntityEvt2"
    >
      <vc-graphics-model
        ref="model2"
        uri="https://zouyaoji.top/vue-cesium/SampleData/models/GroundVehicle/GroundVehicle.glb"
      ></vc-graphics-model>
    </vc-entity>
  </div>
  <tsx-test></tsx-test>
  <q-btn style="position: absolute; top: 500px; left: 500px; z-index: 9999" @click="radarCircle = !radarCircle"
    >asd</q-btn
  >
  <vc-entity
    :show="radarCircle"
    description="Hello Vue Cesium"
    @click="onEntityEvt"
    @mouseover="onEntityEvt"
    @mouseout="onEntityEvt"
  >
    <vc-graphics-rectangle
      ref="rectangle3"
      :coordinates="{ west: -92.0, south: 30.0, east: -82.0, north: 40.0 }"
      material="https://zouyaoji.top/vue-cesium/favicon.png"
      :rotation="getRotationValue"
      :st-rotation="getRotationValue"
      :classification-type="0"
    ></vc-graphics-rectangle>
  </vc-entity>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { VcGraphicsModelRef } from 'vue-cesium'
import TsxTest from '@src/components/tsx-test/index'
import { useVueCesium } from 'vue-cesium'

defineOptions({
  name: 'VcDemoTSXTest'
})

const radarOption = {
  position: [120.539167, 29.523889], //绍兴雷达站经纬度
  radius: 230000,
  interval: 1500,
  color: [255, 255, 0, 255]
}

const $vc = useVueCesium()

const radarCircle = ref(false)
// setTimeout(() => {
//   radarCircle.value = false
// })

const model1 = ref<VcGraphicsModelRef>(null)
const model2 = ref<VcGraphicsModelRef>(null)
const checked = ref(false)
onMounted(() => {
  // Promise.all([model1.value.creatingPromise, model2.value.creatingPromise]).then(([readyObj1, readyObj2]) => {
  //   const viewer = readyObj1.viewer
  //   viewer.zoomTo(viewer.entities)
  //   viewer.zoomTo((readyObj1.cesiumObject as any)._vcParent)
  // })
})

const onEntityEvt1 = e => {
  console.log('onEntityEvt1', e)
  if (e.type === 'onmouseover') {
    e.cesiumObject.model.color = Cesium.Color.RED
  } else {
    e.cesiumObject.model.color = Cesium.Color.WHITE
  }
}

const onEntityEvt2 = e => {
  console.log('onEntityEvt2', e)
  if (e.type === 'onmouseover') {
    e.cesiumObject.model.color = Cesium.Color.GREEN
  } else {
    e.cesiumObject.model.color = Cesium.Color.WHITE
  }
}

const errorEvent = e => {
  console.log(e)
}

const rectangle1 = ref(null)
const rectangle2 = ref(null)
const rectangle3 = ref(null)
const rotation = ref(0)
// methods
const onEntityEvt = e => {
  console.log(e)
}
const onViewerReady = cesiumInstance => {
  console.log('viewer ready')
}
const getRotationValue = () => {
  rotation.value += 0.005
  return rotation.value
}
</script>

<style lang="scss" scoped>
.test {
  position: absolute;
  top: 200px;
  left: 200px;
  .checked {
    border: 1px solid #ffbd0b;
    border-radius: 4px;
    line-height: 1;
    padding: 5px 10px;
    white-space: nowrap;
    img {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .unchecked {
    border: 1px solid rgba(182, 204, 237, 0.26);
    border-radius: 4px;
    line-height: 1;
    padding: 5px 10px;
  }
}
</style>
