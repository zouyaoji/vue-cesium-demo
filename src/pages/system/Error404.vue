<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-01 17:48:18
 * @LastEditTime: 2022-08-31 10:58:20
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\system\Error404.vue
-->
<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">噢. 这儿什么也没有...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        :to="defaultPagePath"
        label="返回主页"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404',
  setup(props, ctx) {
    const defaultPagePath = import.meta.env.VITE_VUE_DEFAULT_PATH
    return {
      defaultPagePath
    }
  }
})
</script>
