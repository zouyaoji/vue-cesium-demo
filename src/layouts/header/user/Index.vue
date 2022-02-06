<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 15:23:46
 * @LastEditTime: 2022-01-20 11:47:29
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\user\Index.vue
-->
<template>
  <q-btn dense rounded no-caps size="md" class="q-mr-sm" auto-close icon="person" :label="user.info?.sysUser?.username">
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
  </q-btn>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useVueCesium } from 'vue-cesium'
import { flyToCamera } from 'vue-cesium/es/utils/cesium-helpers'
import { layer, layout, renderData } from '@src/utils'

const $store = useStore()
const user = $store.state.system.user
const $vc = useVueCesium()

const onItemClick = () => {
  $store
    .dispatch('system/account/logout', {
      confirm: true
    })
    .then(isLogout => {
      if (isLogout) {
        // 注销后默认显示的图层
        layer.loadDefaultLayers(false)

        layout.toggleIndexPageLayout({ leftPanel: false })
        layout.toggleGlobalLayout({ featureInfo: false, layerManager: false })

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
