<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-09-04 09:26:15
 * @LastEditTime: 2022-09-14 22:27:09
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\jessibuca-player\Index.vue
-->
<template>
  <div ref="palyerContainerRef" class="jessibuca-player" @dblclick="fullscreenSwich">
    <div id="buttonsBox" ref="buttonsBoxRef" class="buttons-box">
      <div class="buttons-box-left">
        <i v-if="!playing" class="iconfont icon-play jessibuca-btn" @click="playBtnClick"></i>
        <i v-if="playing" class="iconfont icon-pause jessibuca-btn" @click="pause"></i>
        <i class="iconfont icon-stop jessibuca-btn" @click="destroy"></i>
        <i v-if="isNotMute" class="iconfont icon-audio-high jessibuca-btn" @click="mute()"></i>
        <i v-if="!isNotMute" class="iconfont icon-audio-mute jessibuca-btn" @click="cancelMute()"></i>
      </div>
      <div class="buttons-box-right">
        <span class="jessibuca-btn">{{ kBps }} kb/s</span>
        <!--          <i class="iconfont icon-file-record1 jessibuca-btn"></i>-->
        <!--          <i class="iconfont icon-xiangqing2 jessibuca-btn" ></i>-->
        <i
          class="iconfont icon-camera1196054easyiconnet jessibuca-btn"
          style="font-size: 1rem !important"
          @click="screenshot"
        ></i>
        <i class="iconfont icon-shuaxin11 jessibuca-btn" @click="playBtnClick"></i>
        <i v-if="!fullscreen" class="iconfont icon-weibiaoti10 jessibuca-btn" @click="fullscreenSwich"></i>
        <i v-if="fullscreen" class="iconfont icon-weibiaoti11 jessibuca-btn" @click="fullscreenSwich"></i>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// import Jessibuca from '@src/types/jessibuca'
import { logger } from '@src/utils'
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'VcDemoJessibucaPlayer'
})

const props = defineProps({
  url: String,
  error: String,
  hasAudio: {
    type: Boolean,
    default: true
  }
})

const $route = useRoute()
const playing = ref(false)
const isNotMute = ref(true)
const quieting = ref(false)
const fullscreen = ref(false)
const loaded = ref(false) // mute
const speed = ref(0)
const performance = ref('') // 工作情况
const kBps = ref(0)
const videoInfo = ref(null)
const volume = ref(1)
const rotate = ref(0)
const vod = ref(true) // 点播
const err = ref('')
const forceNoOffscreen = ref(false)
const palyerContainerRef = ref(null)
const buttonsBoxRef = ref(null)
let jessibucaPlayer: {
  [key: string]: Jessibuca
} = {}

const instance = getCurrentInstance()

onMounted(() => {
  let url = props.url
  const paramUrl = decodeURIComponent($route.params.url as string)
  nextTick(() => {
    updatePlayerDomSize()
    window.onresize = () => {
      updatePlayerDomSize()
    }
    if (typeof url == 'undefined') {
      url = paramUrl
    }
    // this.btnDom = document.getElementById('buttonsBox')
    console.log('初始化时的地址为: ' + url)
    play(url)
  })
})

onUnmounted(() => {
  if (jessibucaPlayer[instance.uid]) {
    jessibucaPlayer[instance.uid].destroy()
  }
  playing.value = false
  loaded.value = false
  performance.value = ''
})

watch(
  () => props.url,
  val => {
    play(val)
  }
)

const updatePlayerDomSize = () => {
  let dom = palyerContainerRef.value
  let width = dom.parentNode.clientWidth
  let height = (9 / 16) * width

  const clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
  if (height > clientHeight) {
    height = clientHeight
    width = (16 / 9) * height
  }

  dom.style.width = width + 'px'
  dom.style.height = height + 'px'
}

const play = (url: string) => {
  logger.debug(`开始播放视频流：${url}`)
  if (jessibucaPlayer[instance.uid]) {
    destroy()
  }

  create()
  jessibucaPlayer[instance.uid].on('play', () => {
    playing.value = true
    loaded.value = true
    quieting.value = (jessibucaPlayer[instance.uid] as any).quieting
  })
  if (jessibucaPlayer[instance.uid].hasLoaded()) {
    jessibucaPlayer[instance.uid].play(url)
  } else {
    jessibucaPlayer[instance.uid].on('load', () => {
      console.log('load 播放')
      jessibucaPlayer[instance.uid].play(url)
    })
  }
}

const create = () => {
  logger.debug(`hasAudio: ${props.hasAudio}`)

  jessibucaPlayer[instance.uid] = new Jessibuca({
    container: palyerContainerRef.value,
    videoBuffer: 0.2, // 最大缓冲时长，单位秒
    isResize: true,
    decoder: `${import.meta.env.BASE_URL}libs/jessibuca/decoder.js`,
    useMSE: false,
    showBandwidth: false,
    isFlv: true,
    // text: "WVP-PRO",
    // background: "static/images/zlm-logo.png",
    loadingText: '加载中',
    hasAudio: props.hasAudio,
    debug: false,
    supportDblclickFullscreen: false, // 是否支持屏幕的双击事件，触发全屏，取消全屏事件。
    operateBtns: {
      fullscreen: false,
      screenshot: false,
      play: false,
      audio: false
      // recorder: false
    },
    // record: 'record',
    // vod: this.vod,
    forceNoOffscreen: forceNoOffscreen.value,
    isNotMute: isNotMute.value
  })

  let jessibuca = jessibucaPlayer[instance.uid]
  jessibuca.on('load', function () {
    console.log('on load init')
  })

  jessibuca.on('log', function (msg) {
    console.log('on log', msg)
  })
  jessibuca.on('record', function (msg) {
    console.log('on record:', msg)
  })
  jessibuca.on('pause', function () {
    playing.value = false
  })
  jessibuca.on('play', function () {
    playing.value = true
  })
  jessibuca.on('fullscreen', function (msg) {
    console.log('on fullscreen', msg)
    fullscreen.value = msg
  })

  jessibuca.on('mute', function (msg) {
    console.log('on mute', msg)
    isNotMute.value = !msg
  })
  jessibuca.on('audioInfo', function (msg) {
    // console.log("audioInfo", msg);
  })

  jessibuca.on('videoInfo', function (msg) {
    // this.videoInfo = msg;
    console.log('videoInfo', msg)
  })

  jessibuca.on('bps', function (bps) {
    // console.log('bps', bps);
  })
  let _ts = 0
  jessibuca.on('timeUpdate', function (ts) {
    // console.log('timeUpdate,old,new,timestamp', _ts, ts, ts - _ts);
    _ts = ts
  })

  jessibuca.on('videoInfo', function (info) {
    console.log('videoInfo', info)
  })

  jessibuca.on('error', function (error) {
    console.log('error', error)
  })

  jessibuca.on('timeout', function () {
    console.log('timeout')
  })

  jessibuca.on('start', function () {
    console.log('start')
  })

  jessibuca.on('performance', function (val) {
    let show = '卡顿'
    if (val === 2) {
      show = '非常流畅'
    } else if (val === 1) {
      show = '流畅'
    }
    performance.value = show
  })
  jessibuca.on('buffer', function (buffer) {
    // console.log('buffer', buffer);
  })

  jessibuca.on('stats', function (stats) {
    // console.log('stats', stats);
  })

  jessibuca.on('kBps', function (val) {
    kBps.value = Math.round(val)
  })

  // 显示时间戳 PTS
  jessibuca.on('videoFrame', function () {
    //
  })

  //
  jessibuca.on('metadata', function () {
    //
  })
}

const fullscreenSwich = () => {
  let isFull = isFullscreen()
  jessibucaPlayer[instance.uid].setFullscreen(!isFull)
  fullscreen.value = !isFull
}

const isFullscreen = () => {
  return (
    document.fullscreenElement ||
    (document as any).msFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).webkitFullscreenElement ||
    false
  )
}

const playBtnClick = () => {
  play(props.url)
}

const pause = () => {
  if (jessibucaPlayer[instance.uid]) {
    jessibucaPlayer[instance.uid].pause()
  }
  playing.value = false
  err.value = ''
  performance.value = ''
}

const destroy = () => {
  if (jessibucaPlayer[instance.uid]) {
    jessibucaPlayer[instance.uid].destroy()
  }
  if (buttonsBoxRef.value == null) {
    palyerContainerRef.value.appendChild(buttonsBoxRef.value)
  }
  jessibucaPlayer[instance.uid] = null
  playing.value = false
  performance.value = ''
}

const mute = () => {
  if (jessibucaPlayer[instance.uid]) {
    jessibucaPlayer[instance.uid].mute()
  }
}

const cancelMute = () => {
  if (jessibucaPlayer[instance.uid]) {
    jessibucaPlayer[instance.uid].cancelMute()
  }
}

const screenshot = () => {
  if (jessibucaPlayer[instance.uid]) {
    jessibucaPlayer[instance.uid].screenshot('截图', 'png', 0.5)
  }
}
</script>
<style lang="scss" scoped>
.jessibuca-player {
  width: 100%;
  height: 100%;
  background-color: #000000;
  margin: 0 auto;

  .buttons-box {
    width: 100%;
    height: 28px;
    background-color: rgba(43, 51, 63, 0.7);
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    left: 0;
    bottom: 0;
    user-select: none;
    z-index: 10;
  }

  .jessibuca-btn {
    width: 20px;
    color: rgb(255, 255, 255);
    line-height: 27px;
    margin: 0px 10px;
    padding: 0px 2px;
    cursor: pointer;
    text-align: center;
    font-size: 0.8rem !important;
  }

  .buttons-box-right {
    position: absolute;
    right: 0;
  }
}
</style>
