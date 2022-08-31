/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-15 11:06:15
 * @LastEditTime: 2022-08-28 14:53:39
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\viewer\layer.ts
 */
import { find, isUndefined } from 'lodash'
import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  VcImageryProviderAmapProps,
  VcImageryProviderBaiduProps,
  VcImageryProviderTencentProps,
  VcImageryProviderTiandituProps
} from 'vue-cesium'

export const useLayerStore = defineStore('layer', {
  // a function that returns a fresh state
  state: () => ({
    baseLayers: [
      {
        name: 'tianditu_img',
        text: '天地图影像',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderTianditu',
            props: {
              mapStyle: 'img_c',
              token: '436ce7e50d27eede2f2929307e6b33c0',
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderTiandituProps
          }
        ]
      },
      {
        name: 'tianditu_vec',
        text: '天地图街道',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderTianditu',
            props: {
              mapStyle: 'vec_c',
              token: '436ce7e50d27eede2f2929307e6b33c0',
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderTiandituProps
          }
        ]
      },
      {
        name: 'baidu_img',
        text: '百度影像',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderBaidu',
            props: {
              mapStyle: 'img',
              projectionTransforms: { from: 'BD09', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderBaiduProps
          }
        ]
      },
      {
        name: 'baidu_vec',
        text: '百度街道',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderBaidu',
            props: {
              mapStyle: 'vec',
              projectionTransforms: { from: 'BD09', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderBaiduProps
          }
        ]
      },
      {
        name: 'baidu_midnight',
        text: '百度街道_午夜蓝',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderBaidu',
            props: {
              mapStyle: 'midnight',
              projectionTransforms: { from: 'BD09', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderBaiduProps
          }
        ]
      },
      {
        name: 'baidu_dark',
        text: '百度街道_黑夜',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderBaidu',
            props: {
              mapStyle: 'dark',
              projectionTransforms: { from: 'BD09', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderBaiduProps
          }
        ]
      },
      {
        name: 'amap_img',
        text: '高德影像',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderAmap',
            props: {
              mapStyle: '6',
              projectionTransforms: { from: 'GCJ02', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderAmapProps
          }
        ]
      },
      {
        name: 'amap_vec',
        text: '高德街道',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderAmap',
            props: {
              mapStyle: '7',
              projectionTransforms: { from: 'GCJ02', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderAmapProps
          }
        ]
      },
      {
        name: 'tencent_img',
        text: '腾讯影像',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderTencent',
            props: {
              mapStyle: 'img',
              projectionTransforms: { from: 'GCJ02', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderTencentProps
          }
        ]
      },
      {
        name: 'tencent_vector',
        text: '腾讯街道',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderTencent',
            props: {
              mapStyle: 'vector',
              projectionTransforms: { from: 'GCJ02', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderTencentProps
          }
        ]
      },
      {
        name: 'tencent_vector_my',
        text: '腾讯街道_墨渊',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderTencent',
            props: {
              mapStyle: 'vector',
              styleId: '4',
              projectionTransforms: { from: 'GCJ02', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderTencentProps
          }
        ]
      },
      {
        name: 'osm',
        text: 'OSM',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderOsm'
          }
        ]
      },
      {
        name: 'arcgis',
        text: 'ArcGIS',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderArcgis'
          }
        ]
      }
    ],
    overlayLayers: [
      {
        name: 'tianditu_cva',
        text: '天地图注记',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 30,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderTianditu',
            props: {
              mapStyle: 'cva_c',
              token: '436ce7e50d27eede2f2929307e6b33c0',
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderTiandituProps
          }
        ]
      },
      {
        name: 'amap_label',
        text: '高德注记',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 30,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderAmap',
            props: {
              mapStyle: '8',
              ltype: '4',
              minimumLevel: 0,
              maximumLevel: 17,
              projectionTransforms: { from: 'GCJ02', to: 'WGS84' }
            } as VcImageryProviderAmapProps
          }
        ]
      },
      {
        name: 'amap_traffictile',
        text: '高德路况',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 30,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderAmap',
            props: {
              url: '/traffictile?v=1.0&x={x}&y={y}&z={z}&t=1',
              minimumLevel: 0,
              maximumLevel: 17,
              projectionTransforms: { from: 'GCJ02', to: 'WGS84' }
            } as VcImageryProviderAmapProps
          }
        ]
      },
      {
        name: 'baidu_traffic',
        text: '百度路况',
        component: 'VcLayerImagery',
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 30,
          show: false
        },
        children: [
          {
            component: 'VcImageryProviderBaidu',
            props: {
              mapStyle: 'traffic',
              projectionTransforms: { from: 'BD09', to: 'WGS84' },
              minimumLevel: 0,
              maximumLevel: 17
            } as VcImageryProviderBaiduProps
          }
        ]
      },
      {
        name: 'admin',
        text: '行政区划',
        component: 'VcDatasourceGeojson',
        props: {
          strokeWidth: 5,
          stroke: '#ffc107',
          fill: 'transparent',
          show: false,
          data: `${import.meta.env.BASE_URL}datas/china.json`
        },
        children: []
      }
    ],
    terrainLayers: [
      {
        name: 'terrain',
        text: '全球地形',
        component: 'VcTerrainProviderCesium',
        props: {
          show: false
        }
      },
      {
        name: 'null',
        text: '不显示地形',
        component: undefined,
        props: {
          show: false
        }
      }
    ]
  }),
  // optional getters
  getters: {},
  // optional actions
  actions: {
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    toggle({ names, show }: { names: string | Array<string>; show: boolean }) {
      const allLayers = [...this.baseLayers, ...this.overlayLayers, ...this.terrainLayers]
      names = Array.isArray(names) ? names : [names]
      names.forEach(name => {
        const layer = find(allLayers, v => v.name === name)
        !isUndefined(layer?.show) && (layer.show = show)
        !isUndefined(layer?.props?.show) && (layer.props.show = show)
      })
    },
    loadDefaultLayers(logined?) {
      const allLayerNames = [...this.baseLayers, ...this.overlayLayers, ...this.terrainLayers].map(v => v.name)
      this.toggle({
        names: allLayerNames,
        show: false
      })
      const showLayerNames = ['tianditu_img', 'admin']
      this.toggle({
        names: showLayerNames,
        show: true
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLayerStore, import.meta.hot))
}
