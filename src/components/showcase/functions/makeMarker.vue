<template>
  <div class="makeMaker">
    <div id="cesiumContainer"></div>
    <div class="row justify-center">
       <div class="absolute-top-left toolbar">
        <q-btn small row round inline flex-center color="amber" icon="location on" @click="makeMaker"/>
        <q-btn small row round inline flex-center color="amber" icon="search" @click="search"/>
        <q-btn small row round inline flex-center color="amber" icon="print" @click="outputSceneToFile"/>
      </div>
    </div>
   
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import sceneApi from '@/api/scene.js'
let Cesium = window.Cesium
// import sceneControl from '@/common/sceneControl/sceneControl'
export default {
  name: 'markerup',
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
      let viewer = new Cesium.Viewer('cesiumContainer')
      this.setViewer(viewer)
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
      'setViewer',
      'setScene'
    ]),
    makeMaker () {
      sceneApi.makeMaker(this.viewer)
    },
    search () {

    },
    outputSceneToFile () {

    }
  },
  beforeDestroy () {
    this.setViewer(null)
  }
}
</script>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}


.cesium-viewer-navigationContainer {
  display: block;
  position: absolute;
  top: 30px;
  right: 30px;
  padding: 0;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  height: 300px;
  width: 128px;
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
</style>
