<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 15:23:46
 * @LastEditTime: 2022-10-29 09:04:47
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\user\Index.vue
-->
<template>
  <q-chip
    v-if="$route.name !== 'login'"
    dense
    rounded
    no-caps
    size="md"
    class="q-mr-sm cursor-pointer"
    auto-close
    icon="person"
    :label="user.info?.username"
  >
    <q-menu>
      <q-list dense>
        <q-item v-close-popup clickable dense @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>注销</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-chip>
</template>

<script lang="ts" setup>
import { store } from '@src/store'
import { useVueCesium } from 'vue-cesium'
import { flyToCamera } from 'vue-cesium/es/utils/cesium-helpers'
import { renderData } from '@src/utils'

const { toggleGlobalLayout } = store.system.useLayoutStore()
const { loadDefaultLayers } = store.viewer.useLayerStore()
const user = store.system.useUserStore()
const $vc = useVueCesium()

const onItemClick = () => {
  store.system
    .useAccountStore()
    .logout({
      confirm: true
    })
    .then(isLogout => {
      if (isLogout) {
        // 注销后默认显示的图层
        loadDefaultLayers(false)

        toggleGlobalLayout({ featureInfo: false, layerManager: false })

        renderData.removeAllRenderData()

        const cameraOptions = {
          position: [105, 30, 21634101],
          heading: 360,
          pitch: -90,
          roll: 0
        }
        $vc?.viewer &&
          flyToCamera($vc?.viewer, cameraOptions, {
            duration: 3
          })
      }
    })
}
</script>
