<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-09-12 20:11:20
 * @LastEditTime: 2022-09-15 00:45:47
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\webrtc-player\Index.vue
-->
<template>
  <div class="webrtc-player-container">
    <video ref="webrtcPlayerRef" class="webrtc-player" controls autoplay style="text-align: left">
      Your browser is too old which doesn't support HTML5 video.
    </video>
  </div>
</template>
<script lang="ts" setup>
import * as ZLMRTCClient from '@src/common/ZLMRTCClient'
import RTCEndpoint from '@src/common/ZLMRTCClient/endpoint/endpoint'
import { logger } from '@src/utils'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'VcDemoWebRTCPlayer'
})

const props = defineProps({
  url: String,
  hasaudio: Boolean
})

const $route = useRoute()
const webrtcPlayerRef = ref<HTMLVideoElement>(null)
const url = computed(() => {
  if (props.url) {
    return props.url
  } else {
    return decodeURIComponent($route.params.url as string)
  }
})

let timer = null
let webrtcPlayer: RTCEndpoint

onMounted(() => {
  nextTick(() => {
    play(url.value)
  })

  setTimeout(() => {
    play(url.value)
  }, 1000)
})

onUnmounted(() => {
  webrtcPlayer && webrtcPlayer.offAll()
  clearTimeout(timer)
})

watch(
  () => props.url,
  val => {
    pause()
    play(val)
  }
)

const play = url => {
  webrtcPlayer = new ZLMRTCClient.Endpoint({
    element: webrtcPlayerRef.value,
    debug: true, // 是否打印日志
    zlmsdpUrl: url, //流地址
    simulecast: false,
    useCamera: true,
    audioEnable: true,
    videoEnable: true,
    recvOnly: true
  })

  webrtcPlayer.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR, e => {
    // ICE 协商出错
    eventcallbacK('ICE ERROR', 'ICE 协商出错')
  })

  webrtcPlayer.on(ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS, e => {
    //获取到了远端流，可以播放
    eventcallbacK('playing', '播放成功')
  })

  webrtcPlayer.on(ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, e => {
    // offer anwser 交换失败
    eventcallbacK('OFFER ANSWER ERROR ', 'offer anwser 交换失败')
    if (e.code == -400 && e.msg == '流不存在') {
      timer = setTimeout(() => {
        webrtcPlayer.close()
        play(url)
      }, 100)
    }
  })

  webrtcPlayer.on(ZLMRTCClient.Events.WEBRTC_ON_LOCAL_STREAM, s => {
    // 获取到了本地流
    eventcallbacK('LOCAL STREAM', '获取到了本地流')
  })
}
const pause = () => {
  if (Cesium.defined(webrtcPlayer)) {
    webrtcPlayer.close()
    webrtcPlayer = null
  }
}

const eventcallbacK = (type, message) => {
  logger.debug(`player 事件回调，类型： ${type}， 信息：${message}`)
}
</script>
<style lang="scss" scoped>
.webrtc-player-container {
  width: 100%;

  .webrtc-player {
    width: 100%;
    max-height: 56vh;
    background-color: #000;
  }
}
</style>
