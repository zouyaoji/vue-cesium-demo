import axios from 'axios'
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=utf-8'
let Cesium = window.Cesium
let bubble = null
let viewer = null
let commonScene = {
  makeMaker (appViewer, dom) {
    viewer = appViewer
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    bubble = new Bubble(viewer.scene, dom)
    handler.setInputAction(function (e) {
      let position = viewer.scene.pickPosition(e.position)
      viewer.entities.add({
        position: position,
        billboard: {
          image: 'statics/libs/Cesium/Assets/Textures/maki/grepin.png', // default: undefined
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
      bubble.showAt(position)
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
}

function Bubble (scene, dom) {
  var container = dom
  this.container = container
  this.scenePosition = new Cesium.Cartesian3()
  var _this = this
  scene.postRender.addEventListener(function () {
    var canvasHeight = scene.canvas.height
    var windowPosition = new Cesium.Cartesian2()
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      scene,
      _this.scenePosition,
      windowPosition
    )
    container.style.bottom = canvasHeight - windowPosition.y + 45 + 'px'
    container.style.left = windowPosition.x - 70 + 'px'
    container.style.visibility = 'visible'
    container.style.position = 'absolute'
  })

  this.container.style.visibility = 'hidden'
  this.container.style.display = 'none'

  this.container.children[2].children[0].onclick = function () {
    // 确定
    let entity = viewer.entities.values[viewer.entities.values.length - 1]
    let cartographic = Cesium.Cartographic.fromCartesian(entity.position._value)
    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
    let height = cartographic.height
    if (height < 0) {
      height = 0
    }
    console.log(longitude + ':' + latitude + ':' + height)
    entity.label.text = this.parentElement.parentElement.children[1].children[1].value
    entity.description = this.parentElement.parentElement.children[1].children[3].value
    this.parentElement.parentElement.style.visibility = 'hidden'
    this.parentElement.parentElement.style.display = 'none'
    let url =
      'http://localhost:8090/iserver/services/data-dataWoskspace/rest/data/datasources/data/datasets/makerPoint/features.rjson'
    let data = [
      {
        fieldNames: ['entityID', 'title', 'description', 'height'],
        fieldValues: [
          entity.id,
          this.parentElement.parentElement.children[1].children[1].value,
          this.parentElement.parentElement.children[1].children[3].value,
          height
        ],
        geometry: {
          center: {
            x: longitude,
            y: latitude
          },
          // id: 1,
          partTopo: null,
          parts: [1],
          points: [
            {
              x: longitude,
              y: latitude
            }
          ],
          prjCoordSys: null,
          style: null,
          type: 'POINT'
        }
      }
    ]
    let json = JSON.stringify(data)
    axios
      .post(url, json)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  this.container.children[2].children[2].onclick = function () {
    let entity = viewer.entities.values[viewer.entities.values.length - 1]
    viewer.entities.remove(entity)
    this.parentElement.parentElement.style.visibility = 'hidden'
    this.parentElement.parentElement.style.display = 'none'
  }
}
// 气泡内容修改另外通过获取dom对象修改
Bubble.prototype.showAt = function (position) {
  if (!position) {
    // $(this.container).hide()
    this.container.style.visibility = 'hidden'
    this.container.style.display = 'none'
    return
  }
  // $(this.container).show()
  this.container.style.visibility = 'visible'
  this.container.style.display = 'block'
  this.scenePosition = Cesium.Cartesian3.clone(position)
}
// 设置气泡的可见性
Bubble.prototype.visibility = function (value) {
  if (value === true) {
    // $(this.container).show()
    this.container.style.visibility = 'visible'
    this.container.style.display = 'block'
  }
  else if (value === false) {
    // $(this.container).hide()
    this.container.style.visibility = 'hidden'
    this.container.style.display = 'none'
  }
}

export default commonScene
