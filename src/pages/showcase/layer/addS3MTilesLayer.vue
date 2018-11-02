<template>
  <div class="content">
    <cesium-viewer @ready="ready"></cesium-viewer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      baseLayerPicker: false,
      camera: {
        position: {
          longitude: 104.06,
          latitude: 30.67,
          height: 2000
        },
        heading: 360,
        pitch: -90,
        roll: 0
      }
    }
  },
  components: {
    // smViewer
  },
  mounted () {

  },
  methods: {
    ready (param) {
      this.baseLayerPicker = true
      this.camera.position.longitude = 116.46
      this.camera.position.latitude = 39.92
      this.camera.position.height = 500
    }
  }
}
</script>

<style>

</style>
