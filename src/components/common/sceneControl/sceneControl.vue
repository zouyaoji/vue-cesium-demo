<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
let Cesium = window.Cesium

export default {
  name: 'sceneControl',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      viewer: 'getViewer',
      scene: 'getScene'
    })
  },
  mounted () {
    if (!this.viewer) {
      let viewer = new Cesium.Viewer('cesiumContainer', {selectionIndicator: false})
      this.setViewer(viewer)
      // var credit = this.viewer.scene.frameState.creditDisplay
      // credit.container.removeChild(credit._imageContainer)
    }
  },
  methods: {
    ...mapActions([
      'setViewer',
      'setScene'
    ])
  },
  beforeDestroy () {
    this.setViewer(null)
  }
}
</script>

<style>
</style>
