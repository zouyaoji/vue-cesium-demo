<template>
  <div class="content">
    <sm-cesium-viewer @selectedEntityChanged="selectedEntityChanged" @ready="ready">
    </sm-cesium-viewer>
    
    <div ref="bubbleContainer" id="bubbleContainer" class="bubbleContainer" hidden>
      <div class="bubbleHeader">
        <span></span>
        <label class="header-title">添加标注</label>
      </div>
      <div class="bubbleContent">
        <label class="title-name">标题</label>
        <input id="markerName" class="title-text">
        <label class="description">描述</label>
        <textarea id="markerDes" class="description-text"></textarea>
      </div>
      <div class="bubbleFooter">
        <a id="saveMarkerBtn" class="bubbleOK">确定</a>
        <span>|</span>
        <a id="delMarkerBtn" class="bubbleCancel">取消</a>
      </div>
		</div>
    <div class="row justify-center">
       <div class="absolute-top-left toolbar">
        <q-btn small row round inline flex-center color="amber" icon="location on" @click="makeMaker"/>
        <q-btn small row round inline flex-center color="amber" icon="print" @click="outputSceneToFile"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import commonScene from 'src/api/commonScene.js'
// let Cesium = window.Cesium
// import sceneControl from '@/common/sceneControl/sceneControl'
export default {
  name: 'locationMaker',
  components: {
  },
  computed: {
    ...mapGetters({
      viewer: 'getViewer',
      scene: 'getScene'
    })
  },
  mounted () {
    if (!this.viewer) {
      // let viewer = new Cesium.Viewer('cesiumContainer')
      // this.$store.dispatch('setViewer', {viewer: viewer})
      // this.setViewer(viewer)
      // let imageryLayers = viewer.imageryLayers
      // let labelImagery = new Cesium.TiandituImageryProvider({
      //   mapStyle: Cesium.TiandituMapsStyle.CIA_C // 天地图全球中文注记服务（经纬度投影）
      // })
      // imageryLayers.addImageryProvider(labelImagery)
      // viewer.geocoder.viewModel.geoKey = '79F9yph6kv8c8I9aARQUxtvn'
      // var credit = this.viewer.scene.frameState.creditDisplay
      // credit.container.removeChild(credit._imageContainer)
    }
  },
  methods: {
    ...mapActions([
      'setViewer'
    ]),
    makeMaker () {
      commonScene.makeMaker(this.viewer, this.$refs.bubbleContainer)
    },
    search () {

    },
    outputSceneToFile () {

    },
    ready (e) {
      this.setViewer(e.viewer)
    },
    selectedEntityChanged () {
      console.log('selectedEntityChanged')
    }
  },
  beforeDestroy () {
    this.viewer.destroy()
    this.setViewer(null)
  }
}
</script>

<style>
.content {
    /* min-height: 52px; */
    background-color: #f9f9f9;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* margin-top: 60px; */
}

.toolbar {
  padding-top: 10px;
	padding-left: 20px;
}

.q-btn-round.q-btn-small {
  height: 32px;
  width: 32px;
}

.q-btn-round.q-btn-small .q-icon,
.q-btn-round.q-btn-small .q-spinner {
  height: 24px;
  width: 24px;
  font-size: 24px;
}

/*-------bubble------------------*/
.bubbleContainer {
    /* display: none; */
    width: 400px;
    background-color: #ffffff;
}

.bubbleHeader {
  width: 100%;
  height: 40px;
  background-color: #0083bc;
  margin-top: -5px;
}

.header-title {
  color: #ffffff;
  font-size: 16px;
  margin-left: 23px;
}

.bubbleContent {
  width: 100%;
  height: 180px;
  color: #000000;
}

.title-name {
  margin-left: 26px;
  margin-top: 24px;
  font-size: 14px;
}



label {
  font-size: 15px;
  font-weight: 400;
  line-height: 2.3;
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
}

.bubbleContent input, textarea {
  color: #7c7c7c;
  font-family: "Microsoft YaHei" !important;
  font-size: 14px;
  padding: 0 0 0 6px;
  text-indent: 1px;
}

.title-text {
  margin-left: 10px;
  width: 320px;
  height: 33px;
  border-radius: 3px;
  border: 1px solid #d7dade;
  outline: none;
  resize: none;
}

.description {
    margin-left: 26px;
    margin-top: 21px;
}

.description-text {
    width: 320px;
    height: 89px;
    margin-left: 8px;
    border-radius: 3px;
    border: 1px solid #d7dade;
    margin-top: 22px;
    outline: none;
    resize: none;
    position: absolute;
}

.bubbleFooter {
  height: 37px;
  margin-top: 13px;
}

.bubbleOK {
  text-decoration: none;
  font-size: 15px;
  margin-left: 60%;
  cursor: pointer;
  color: #0083cb;
  background-color: transparent;
  padding: 5.5px 23px;
  border-radius: 4px;
}

.bubbleCancel {
  text-decoration: none;
  font-size: 15px;
  cursor: pointer;
  color: #7c7c7c;
  background-color: transparent;
  padding: 5.5px 23px;
  border-radius: 4px;
}

/*-------bubble  end------------------*/
</style>
