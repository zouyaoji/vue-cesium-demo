<template>
  <q-page class="flex flex-center viewer">
    <vc-viewer :camera.sync="cesiumCamera">
      <!-- 导航罗盘控件 -->
      <vc-navigation></vc-navigation>
      <template v-for="(item, index) in layers[0].children">
        <template v-for="(subItem, subIndex) in item.children">
          <!-- 天地图 -->
          <vc-layer-imagery
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'tianditu' && subItem.show"
          >
            <vc-provider-imagery-tianditu
              :mapStyle="subItem.mapStyle"
              :token="subItem.token"
            ></vc-provider-imagery-tianditu>
          </vc-layer-imagery>
          <!-- arcgis mapserver -->
          <vc-layer-imagery
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'arcgis' && subItem.show"
          >
            <vc-provider-imagery-arcgis-mapserver
              :enablePickFeatures="false"
              :url="subItem.url"
            ></vc-provider-imagery-arcgis-mapserver>
          </vc-layer-imagery>
          <!-- bingmaps -->
          <vc-layer-imagery
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'bingmaps' && subItem.show"
          >
            <vc-provider-imagery-bingmaps
              :mapStyle="subItem.mapStyle"
              :url="subItem.url"
              :bmKey="subItem.token"
            ></vc-provider-imagery-bingmaps>
          </vc-layer-imagery>
          <!-- mapboxstyle -->
          <vc-layer-imagery
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'mapboxstyle' && subItem.show"
          >
            <vc-provider-imagery-style-mapbox
              :url="subItem.url"
              :username="subItem.username"
              :styleId="subItem.styleId"
              :accessToken="subItem.token"
            ></vc-provider-imagery-style-mapbox>
          </vc-layer-imagery>
          <!-- openstreetmap -->
          <vc-layer-imagery
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'openstreetmap' && subItem.show"
          >
            <vc-provider-imagery-openstreetmap
              :url="subItem.url"
            ></vc-provider-imagery-openstreetmap>
          </vc-layer-imagery>
          <!-- supermap -->
          <vc-layer-imagery
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'supermap' && subItem.show"
          >
            <vc-provider-imagery-supermap
              :url="subItem.url"
            ></vc-provider-imagery-supermap>
          </vc-layer-imagery>
          <!-- urltemplate  -->
          <vc-layer-imagery
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'urltemplate' && subItem.show"
          >
            <vc-provider-imagery-urltemplate
              :url="subItem.url"
            ></vc-provider-imagery-urltemplate>
          </vc-layer-imagery>
          <!-- wmts  -->
          <vc-layer-imagery
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'wmts' && subItem.show"
          >
            <vc-provider-imagery-wmts
              :url="subItem.url"
              :subdomains="subItem.subdomains"
              :layer="subItem.layer"
              :style="subItem.style"
              :format="subItem.format"
              :tileMatrixSetID="subItem.tileMatrixSetID"
              :tileMatrixLabels="subItem.tileMatrixLabels"
            ></vc-provider-imagery-wmts>
          </vc-layer-imagery>
          <!-- terrain  -->
          <vc-provider-terrain-cesium
            :key="'layer' + index + '-' + subIndex"
            v-if="item.name === 'terrain' && subItem.show"
          ></vc-provider-terrain-cesium>
        </template>
      </template>
    </vc-viewer>
    <div class="absolute-top-left row q-col-gutter-sm layer-tree">
      <q-scroll-area
        style="max-height: 700px; min-height: 200px; width: 280px"
        :style="{ height: qScrollHeight + 'px' }"
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
      >
        <div class="row q-pa-md q-col-gutter-sm">
          <q-tree
            ref="qtree"
            dark
            :nodes="layers"
            node-key="name"
            :ticked.sync="ticked"
            :selected.sync="selected"
            :expanded.sync="expanded"
            tick-strategy="leaf"
            selected-color="teal-3"
            @update:ticked="tickedMethod"
            @update:selected="selectedMethod"
            @update:expanded="expandedMethod"
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div class="text-weight-bold">
                  {{ $t(prop.node.caption) }}
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
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script>
const shows = ['ChinaOnlineStreetPurplishBlue', 'amapRoad']
export default {
  data () {
    return {
      qScrollHeight: 0,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      },
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
      layers: [
        {
          caption: 'terrainAndImagery.layerControl',
          name: 'layerControl',
          children: [
            {
              name: 'tianditu',
              caption: 'terrainAndImagery.tianditu.groupCaption',
              children: [
                {
                  name: 'img_c',
                  caption: 'terrainAndImagery.tianditu.imagery',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  mapStyle: 'img_c',
                  show: shows.indexOf('img_c') > -1,
                  token: '436ce7e50d27eede2f2929307e6b33c0'
                },
                {
                  name: 'vec_c',
                  caption: 'terrainAndImagery.tianditu.vector',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  mapStyle: 'vec_c',
                  show: shows.indexOf('vec_c') > -1,
                  token: '436ce7e50d27eede2f2929307e6b33c0'
                },
                {
                  name: 'cia_c',
                  caption: 'terrainAndImagery.tianditu.text',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  mapStyle: 'cia_c',
                  show: shows.indexOf('cia_c') > -1,
                  token: '436ce7e50d27eede2f2929307e6b33c0'
                }
              ]
            },
            {
              name: 'arcgis',
              caption: 'terrainAndImagery.arcgis.groupCaption',
              children: [
                {
                  name: 'World_Imagery',
                  caption: 'terrainAndImagery.arcgis.imagery',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url:
                    'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                  show: shows.indexOf('World_Imagery') > -1
                },
                {
                  name: 'ChinaOnlineStreetGray',
                  caption: 'terrainAndImagery.arcgis.chinaOnlineStreetGray',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url:
                    'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer',
                  show: shows.indexOf('ChinaOnlineStreetGray') > -1
                },
                {
                  name: 'ChinaOnlineStreetPurplishBlue',
                  caption:
                    'terrainAndImagery.arcgis.chinaOnlineStreetPurplishBlue',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url:
                    'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                  show: shows.indexOf('ChinaOnlineStreetPurplishBlue') > -1
                },
                {
                  name: 'ChinaOnlineStreetWarm',
                  caption: 'terrainAndImagery.arcgis.chinaOnlineStreetWarm',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url:
                    'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer',
                  show: shows.indexOf('ChinaOnlineStreetWarm') > -1
                }
              ]
            },
            {
              name: 'bingmaps',
              caption: 'terrainAndImagery.bingmaps.groupCaption',
              children: [
                {
                  name: 'Aerial',
                  caption: 'terrainAndImagery.bingmaps.aerial',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url: 'https://dev.virtualearth.net',
                  mapStyle: 'Aerial',
                  token:
                    'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-',
                  show: shows.indexOf('Aerial') > -1
                },
                {
                  name: 'Road',
                  caption: 'terrainAndImagery.bingmaps.road',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url: 'https://dev.virtualearth.net',
                  mapStyle: 'Road',
                  token:
                    'AgcbDCAOb9zMfquaT4Z-MdHX4AsHUNvs7xgdHefEA5myMHxZk87NTNgdLbG90IE-',
                  show: shows.indexOf('Road') > -1
                }
              ]
            },
            {
              name: 'mapboxstyle',
              caption: 'terrainAndImagery.mapboxstyle.groupCaption',
              children: [
                {
                  name: 'mapbox-zouyaoji',
                  caption: 'terrainAndImagery.mapboxstyle.customStyle',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url: 'https://api.mapbox.com/styles/v1',
                  username: 'zouyaoji',
                  styleId: 'ckd49hwdn0u641irz36komsmt',
                  token:
                    'pk.eyJ1Ijoiem91eWFvamkiLCJhIjoiY2tjdjlha3pzMDIxeDJ1bWxhaWNnaGNkdSJ9.WaGuuQT8YcWTPx3KNQfF7A',
                  show: shows.indexOf('mapbox-zouyaoji') > -1
                }
              ]
            },
            {
              name: 'openstreetmap',
              caption: 'terrainAndImagery.openstreetmap.groupCaption',
              children: [
                {
                  name: 'tile',
                  caption: 'terrainAndImagery.openstreetmap.vector',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url: 'https://a.tile.openstreetmap.org',
                  show: shows.indexOf('tile') > -1
                }
              ]
            },
            {
              name: 'wmts',
              caption: 'terrainAndImagery.wmts.groupCaption',
              children: [
                {
                  // https://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/WMTS/1.0.0/WMTSCapabilities.xml
                  name: 'World_Topo_Map',
                  caption: 'terrainAndImagery.wmts.argis',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url:
                    'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/WMTS/tile/1.0.0/World_Topo_Map/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
                  // subdomains: '',
                  layer: 'World_Topo_Map',
                  style: 'default',
                  format: 'image/jpeg',
                  tileMatrixSetID: 'default028mm',
                  show: shows.indexOf('World_Topo_Map') > -1
                }
              ]
            },
            {
              name: 'supermap',
              caption: 'terrainAndImagery.supermap.groupCaption',
              children: [
                {
                  name: 'China_4326',
                  caption: 'terrainAndImagery.supermap.china4236',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url:
                    'https://www.supermapol.com/realspace/services/map-china400/rest/maps/China_4326',
                  show: shows.indexOf('China_4326') > -1
                }
              ]
            },
            {
              name: 'urltemplate',
              caption: 'terrainAndImagery.urltemplate.groupCaption',
              children: [
                {
                  name: 'google',
                  caption: 'terrainAndImagery.urltemplate.google',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url: 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
                  show: shows.indexOf('google') > -1
                },
                {
                  name: 'amapImagery',
                  caption: 'terrainAndImagery.urltemplate.amapImagery',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url:
                    'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                  show: shows.indexOf('amapImagery') > -1
                },
                {
                  name: 'amapVector',
                  caption: 'terrainAndImagery.urltemplate.amapVector',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  url:
                    'https://webst01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',
                  show: shows.indexOf('amapVector') > -1
                },
                {
                  name: 'amapRoad',
                  caption: 'terrainAndImagery.urltemplate.amapRoad',
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  // url: 'https://tm.amap.com/trafficengine/mapabc/traffictile/?v=1.0&x={x}&y={y}&z={z}&t=1',
                  url: '/traffictile?v=1.0&x={x}&y={y}&z={z}&t=1',
                  show: shows.indexOf('amapRoad') > -1
                }
              ]
            },
            {
              name: 'terrain',
              caption: 'terrainAndImagery.terrain.groupCaption',
              children: [
                {
                  name: 'cesiumTerrain',
                  caption: 'terrainAndImagery.terrain.cesiumTerrain',
                  show: shows.indexOf('cesiumTerrain') > -1
                }
              ]
            }
          ]
        }
      ],
      selected: '',
      ticked: shows,
      expanded: ['layerControl', 'arcgis', 'urltemplate']
    }
  },
  mounted () {
    this.qScrollHeight = this.$refs.qtree.$el.offsetHeight
    window.vm = this
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
              v.show = this.$refs.qtree.isTicked(v.name)
            })
          }
        })
      }

      getTree(layers)
    },
    expandedMethod (e) {
      if (this.$refs.qtree) {
        setTimeout(() => {
          this.qScrollHeight = this.$refs.qtree.$el.offsetHeight
        }, 250)
      }
    },
    selectedMethod (e) {}
  }
}
</script>

<style lang="scss" scoped>
.layer-tree {
  background-color: $bg-color;
}
</style>
