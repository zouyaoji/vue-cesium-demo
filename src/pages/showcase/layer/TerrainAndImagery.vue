<template>
  <q-page class="flex flex-center viewer">
    <vc-viewer :camera.sync="cesiumCamera">
      <!-- 导航罗盘控件 -->
      <vc-navigation></vc-navigation>
      <!-- 天地图影像图层 -->
      <!-- <vc-layer-imagery>
        <vc-provider-imagery-tianditu
          :mapStyle="mapStyle"
          token="436ce7e50d27eede2f2929307e6b33c0"
        ></vc-provider-imagery-tianditu>
      </vc-layer-imagery> -->
      <!-- 智图 ArcGISServer 中国区午夜图在线影像服务图层 火星坐标系GCJ02 -->
      <vc-layer-imagery>
        <vc-provider-imagery-arcgis-mapserver
          :enablePickFeatures="false"
          :url="arcgisMapServerUrl"
        ></vc-provider-imagery-arcgis-mapserver>
      </vc-layer-imagery>
      <!-- <vc-layer-imagery>
        <vc-provider-imagery-urltemplate url="http://192.168.1.247/raster/{z}/{x}/{y}.png"></vc-provider-imagery-urltemplate>
      </vc-layer-imagery> -->
    </vc-viewer>
    <div class="absolute-top-left row q-col-gutter-sm layer-tree">
      <div class="row q-pa-md q-col-gutter-sm">
        <q-tree
          ref="qtree"
          dark
          :nodes="layers"
          node-key="label"
          default-expand-all
          :ticked.sync="ticked"
          :selected.sync="selected"
          tick-strategy="leaf"
          selected-color="teal-5"
          @update:ticked="tickedMethod"
          @update:selected="selectedMethod"
        >
          <template v-slot:default-header="prop">
            <div class="row items-center">
              <div class="text-weight-bold">
                {{ prop.node.label }}
                <q-menu touch-position context-menu>
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section>属性...</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>
          </template>
        </q-tree>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      urlTileYC:
        'http://192.168.1.247/cesium/3DTiles/ycBlue-noLOD/tileset.json',
      cesiumCamera: {
        position: {
          lng: 105.926727,
          lat: 29.356524,
          height: 50000
        },
        heading: 360,
        pitch: -90,
        roll: 0
      },
      arcgisMapServerUrl:
        'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
      layers: [
        {
          label: '图层管理',
          children: [
            {
              label: 'Good food'
            },
            {
              label: '天地图',
              children: [
                {
                  label: '影像'
                }
                // { label: '透明度', noTick: true, value: 1 },
                // { label: '亮度', noTick: true, value: 1 },
                // { label: '对比度', noTick: true, value: 1 }
              ]
            },
            {
              label: 'Pleasant surroundings',
              children: [
                { label: 'Happy atmosphere' },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
              ]
            }
          ]
        }
      ],
      selected: 'Pleasant surroundings',
      ticked: ['Good table presentation']
    }
  },
  methods: {
    tickedMethod (e) {
      const { layers } = this
      const getTree = tree => {
        tree.forEach(v => {
          if (v.children) {
            getTree(v.children)
          } else {
            this.$nextTick(() => {
              v.checked = this.$refs.qtree.isTicked(v.label)
              console.log(v)
            })
          }
        })
      }

      getTree(layers)

      // console.log(e)
      // e.reduce((pre, cur) => {
      //   console.log(this.$refs.qtree.getNodeByKey(cur))
      // }, [])
    },
    selectedMethod (e) {
      console.log(e)
      console.log(this.$refs.qtree.getNodeByKey(e))
      console.log(this.$refs.qtree.getTickedNodes())
    }
  }
}
</script>

<style lang="scss" scoped>
.layer-tree {
  background-color: $bg-color;
}
</style>
