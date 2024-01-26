<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2024-01-26 14:42:15
 * @Description: Do not edit
 * @LastEditors: zouyaoji 370681295@qq.com
 * @LastEditTime: 2024-01-26 14:54:26
 * @FilePath: \vue-cesium-demo\src\pages\other\issue\Index.vue
-->
<template>
  <vc-entity description="Hello Vue Cesium" @click="onEntityEvt" @mouseover="onEntityEvt" @mouseout="onEntityEvt">
    <vc-graphics-rectangle
      ref="rectangle3"
      :coordinates="[102.0, 30, 112, 40.0]"
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
import { useVueCesium } from 'vue-cesium'

defineOptions({
  name: 'VcDemoTest'
})

const $vc = useVueCesium()

const rectangle3 = ref(null)
const rotation = ref(0)
// methods
const onEntityEvt = e => {
  console.log(e)
}

$vc.creatingPromise.then(() => {
  console.log('viewer ready')
})

const getRotationValue = () => {
  rotation.value += 0.005
  return rotation.value
}
</script>
