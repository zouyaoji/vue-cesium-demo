<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-22 09:46:50
 * @LastEditTime: 2022-08-31 16:16:49
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\expansion\typhoon\Index.vue
-->
<template>
  <div class="page-dynamic-render-typhoon">
    <vc-datasource-custom name="vc_warnLine" :entities="warnLineEntities"></vc-datasource-custom>
    <vc-typhoon v-if="typhoonDatas.length" ref="typhoonRef" :typhoon-datas="typhoonDatas"></vc-typhoon>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as api from '@src/api'
import VcTyphoon from '@src/components/vc-typhoon/Index'

defineOptions({
  name: 'VcDemoPageDynamicRenderTyphoon'
})

const typhoonDatas = ref([])
const typhoonRef = ref<typeof VcTyphoon>(null)
const warnLineEntities = [
  {
    position: [127, 34],
    // label: {
    //   text: '24小时警戒线'
    // },
    polyline: {
      width: 1,
      positions: [
        [127, 34],
        [127, 22],
        [119, 18],
        [119, 11],
        [113, 4.5],
        [105, 0]
      ],
      material: 'rgba(255, 0, 0, 0.8)'
    }
  },
  {
    polyline: {
      width: 1,
      positions: [
        [105, 0],
        [120, 0],
        [132, 15],
        [132, 34]
      ],
      material: {
        fabric: {
          type: 'PolylineDash',
          uniforms: {
            color: 'rgba(255, 165, 0, 0.8)',
            dashLength: 10,
            dashPattern: 5
          }
        }
      }
    }
  }
]

onMounted(() => {
  getData()
})

const getData = () => {
  typhoonDatas.value.length = 0
  const promises = [
    api.common.getStaticData('/datas/typhoon/202209.json'),
    api.common.getStaticData('/datas/typhoon/202210.json')
  ]
  Promise.all(promises).then(([res1, res2]) => {
    typhoonDatas.value = [...res1.data, ...res2.data]
  })

  // setTimeout(() => {
  //   api.common.getStaticData('/datas/typhoon/202205.json').then(res => {
  //     typhoonRef.value.addTyphoonData(...res.data)
  //   })
  // }, 5000)
}
</script>

<style lang="scss" scoped>
.page-dynamic-render-typhoon {
  top: 70px;
  position: absolute;
  width: 100%;
  height: calc(100% - 70px);
  pointer-events: none;
  z-index: $z-fab;
  & > div {
    pointer-events: auto;
  }
}
</style>
