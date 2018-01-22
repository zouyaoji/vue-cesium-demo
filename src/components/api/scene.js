let Cesium = window.Cesium

let scene = {
  makeMaker (viewer) {
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (e) {
      let position = viewer.scene.pickPosition(e.position)

      viewer.entities.add({
        position: position,
        billboard: {
          image: 'statics/imgs/grepin.png', // default: undefined
          pixelOffset: new Cesium.Cartesian2(0, -30),
          scale: 0.5
        },
        label: {
          text: '标注',
          font: '24px sans-serif',
          horizontalOrigin: 1,
          outlineColor: new Cesium.Color(0, 0, 0, 1),
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(17, -30),
          style: Cesium.LabelStyle.FILL
        }
      })

      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
}

export default scene
