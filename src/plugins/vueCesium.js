import VueCesium from 'vue-cesium'

export default ({
  Vue
}) => {
  Vue.use(VueCesium, {
    // cesiumPath is the path of the Cesium library, such as
    cesiumPath: '/statics/Cesium'
    // use online reference for http
    // cesiumPath: 'http://support.supermap.com.cn:8090/webgl/Build'
    // use online reference for https
    // cesiumPath: 'https://zouyaoji.top/vue-supermap-cesium'
  })
}
