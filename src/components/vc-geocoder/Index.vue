<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-06-13 00:21:49
 * @LastEditTime: 2022-07-23 00:18:09
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\vc-geocoder\Index.vue
-->
<template>
  <div class="vc-geocoder q-gutter-md row z-fab">
    <q-select
      outlined
      :model-value="model"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      label="输入关键字搜索位置"
      style="width: 250px"
      dense
      hide-dropdown-icon
      @filter="filterFn"
      @input-value="setModel"
      @update:model-value="modelUpdated"
    >
      <template #prepend>
        <q-icon name="place" color="white" />
      </template>
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey"> 没有结果 </q-item-section>
        </q-item>
      </template>
      <template #append>
        <q-icon v-if="model !== null" name="cancel" class="cursor-pointer" @click.stop="onClear" />
        <q-icon name="search" color="orange" />
      </template>
    </q-select>
  </div>
  <vc-datasource-custom ref="datasoureceRef" :entities="entities"></vc-datasource-custom>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import * as api from '@src/api'
import { useVueCesium, VcDatasourceCustomRef } from 'vue-cesium'
import { gcj02towgs84 } from 'vue-cesium/es/utils/coordtransform'

const $vc = useVueCesium()
const model = ref(null)
const options = ref([])
const datasoureceRef = ref<VcDatasourceCustomRef>(null)
const entities = ref([])

const filterFn = async (val, update, abort) => {
  val = val === '' ? model.value : val
  const query = {
    keywords: val,
    // city: '610500',
    citylimit: true,
    output: 'json',
    key: import.meta.env.VITE_VUE_APP_AMAP_KEY
  }
  const res = await api.common.getLocationList(query)
  let results = []
  if (res.status === '1') {
    const result = res.pois
    const arr = []
    result.forEach(item => {
      arr.push({
        value: item.id,
        label: item.name,
        pname: item.pname,
        cityname: item.cityname,
        adname: item.adname,
        address: item.address,
        location: item.location,
        type: item.type
      })
    })
    results = [...new Set(arr)]
  }

  update(() => {
    const needle = val?.toLocaleLowerCase()
    options.value = results.filter(v => v.label.toLocaleLowerCase().indexOf(needle) > -1)
  })
}

const setModel = val => {
  model.value = val
}

const onClear = () => {
  model.value = null
  entities.value.length = 0
}

const modelUpdated = val => {
  if (val) {
    const positions = gcj02towgs84(Number(val.location.trim().split(',')[0]), Number(val.location.trim().split(',')[1]))
    const position = {
      lng: positions[0],
      lat: positions[1],
      address: val.address
    }
    zoomToMyLocation(position, val)
  } else {
    entities.value.length = 0
  }
}

const zoomToMyLocation = (position, detail?) => {
  const longitude = position.lng
  const latitude = position.lat
  const address = position.address
  const { Rectangle, sampleTerrain } = Cesium
  const { viewer } = $vc
  entities.value.length = 0
  entities.value.push({
    position: [longitude, latitude],
    point: {
      color: '#08ABD5',
      pixelSize: 12,
      outlineWidth: 3,
      outlineColor: '#fff'
    },
    properties: {
      ...detail
    },
    description: describeWithoutUnderscores({
      经度: longitude,
      纬度: latitude,
      地址: address
    })
  })

  const options: any = {
    duration: 3,
    offset: new Cesium.HeadingPitchRange(0, 0, 3000)
  }

  // west, south, east, north, result
  const factor = 0.01
  const rectangle = Rectangle.fromDegrees(longitude - factor, latitude - factor, longitude + factor, latitude + factor)
  const camera = viewer.scene.camera
  // Work out the destination that the camera would naturally fly to
  const destinationCartesian = camera.getRectangleCameraCoordinates(rectangle)
  const destination = viewer.scene.globe.ellipsoid.cartesianToCartographic(destinationCartesian)
  const terrainProvider = viewer.scene.globe.terrainProvider
  const level = 6 // A sufficiently coarse tile level that still has approximately accurate height
  const positions = [Rectangle.center(rectangle)]

  // Perform an elevation query at the centre of the rectangle
  sampleTerrain(terrainProvider, level, positions).then(function (results) {
    // Add terrain elevation to camera altitude
    const finalDestinationCartographic: any = {
      longitude: destination.longitude,
      latitude: destination.latitude,
      height: destination.height + results[0].height
    }
    const finalDestination = viewer.scene.globe.ellipsoid.cartographicToCartesian(finalDestinationCartographic)

    camera.flyTo({
      duration: 3,
      destination: finalDestination
    })
  })
}

const describeWithoutUnderscores = (properties, nameProperty?) => {
  let html = ''
  if (properties instanceof Cesium.PropertyBag) {
    // unwrap the properties from the PropertyBag
    properties = properties.getValue(Cesium.JulianDate.now())
  }
  for (let key in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      if (key === nameProperty) {
        continue
      }
      let value = properties[key]
      if (typeof value === 'object') {
        value = describeWithoutUnderscores(value)
      } else {
        // value = formatPropertyValue(value)
      }
      key = key.replace(/_/g, ' ')
      if (Cesium.defined(value)) {
        html += '<tr><th>' + key + '</th><td>' + value + '</td></tr>'
      }
    }
  }
  if (html.length > 0) {
    html = '<table class="cesium-infoBox-defaultTable"><tbody>' + html + '</tbody></table>'
  }
  return html
}
</script>

<style lang="scss" scoped>
.vc-geocoder {
  position: absolute;
  top: 23px;
  right: 380px;
}
</style>
