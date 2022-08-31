<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-17 21:58:58
 * @LastEditTime: 2022-08-31 23:17:00
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
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { VcGraphicsModelRef } from 'vue-cesium'
import TsxTest from '@src/components/tsx-test/index'

defineOptions({
  name: 'VcDemoTSXTest'
})

const model1 = ref<VcGraphicsModelRef>(null)
const model2 = ref<VcGraphicsModelRef>(null)
const checked = ref(false)
onMounted(() => {
  Promise.all([model1.value.creatingPromise, model2.value.creatingPromise]).then(([readyObj1, readyObj2]) => {
    const viewer = readyObj1.viewer
    viewer.zoomTo(viewer.entities)
    viewer.zoomTo((readyObj1.cesiumObject as any)._vcParent)
  })
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
