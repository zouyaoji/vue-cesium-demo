/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-15 11:06:15
 * @LastEditTime: 2022-07-04 16:44:32
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
        component: 'VcImageryProviderTianditu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'img_c',
          token: '436ce7e50d27eede2f2929307e6b33c0',
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderTiandituProps
      },
      {
        name: 'tianditu_vec',
        text: '天地图电子',
        component: 'VcImageryProviderTianditu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'vec_c',
          token: '436ce7e50d27eede2f2929307e6b33c0',
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderTiandituProps
      },
      {
        name: 'baidu_img',
        text: '百度影像',
        component: 'VcImageryProviderBaidu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'img',
          projectionTransforms: { form: 'BD09', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderBaiduProps
      },
      {
        name: 'baidu',
        text: '百度电子',
        component: 'VcImageryProviderBaidu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'vec',
          projectionTransforms: { form: 'BD09', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderBaiduProps
      },
      {
        name: 'baidu_midnight',
        text: '百度地图_午夜蓝',
        component: 'VcImageryProviderBaidu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'midnight',
          projectionTransforms: { form: 'BD09', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderBaiduProps
      },
      {
        name: 'baidu_dark',
        text: '百度地图_黑夜',
        component: 'VcImageryProviderBaidu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'dark',
          projectionTransforms: { form: 'BD09', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderBaiduProps
      },
      {
        name: 'amap_img',
        text: '高德影像',
        component: 'VcImageryProviderAmap',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: '6',
          projectionTransforms: { form: 'GC02', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderAmapProps
      },
      {
        name: 'amap_vec',
        text: '高德地图',
        component: 'VcImageryProviderAmap',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: '7',
          scl: '2',
          projectionTransforms: { form: 'GC02', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderAmapProps
      },
      {
        name: 'tencent_img',
        text: '腾讯影像',
        component: 'VcImageryProviderTencent',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'img',
          projectionTransforms: { form: 'GC02', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderTencentProps
      },
      {
        name: 'tencent_vec',
        text: '腾讯电子',
        component: 'VcImageryProviderTencent',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'vector',
          projectionTransforms: { form: 'BD09', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderTencentProps
      },
      {
        name: 'tencent_my',
        text: '腾讯电子_墨渊',
        component: 'VcImageryProviderTencent',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'vector',
          projectionTransforms: { form: 'BD09', to: 'WGS84' } as any,
          styleId: '4',
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderTencentProps
      },
      {
        name: 'osm',
        text: 'OSM',
        component: 'VcImageryProviderOsm',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false
      },
      {
        name: 'arcgis',
        text: 'ArcGIS',
        component: 'VcImageryProviderArcgis',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false
      }
    ],
    overlayLayers: [
      {
        name: 'tianditu_cva',
        text: '天地图注记',
        component: 'VcImageryProviderTianditu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 30,
        show: false,
        props: {
          mapStyle: 'cva_c',
          token: '436ce7e50d27eede2f2929307e6b33c0',
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderTiandituProps
      },
      {
        name: 'amap_label',
        text: '高德注记',
        component: 'VcImageryProviderAmap',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 30,
        show: false,
        props: {
          mapStyle: '8',
          ltype: '4',
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderAmapProps
      },
      {
        name: 'amap_traffictile',
        text: '高德路况',
        component: 'VcImageryProviderAmap',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 30,
        show: false,
        props: {
          url: '/traffictile?v=1.0&x={x}&y={y}&z={z}&t=1',
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderAmapProps
      },
      {
        name: 'baidu_traffic',
        text: '百度路况',
        component: 'VcImageryProviderBaidu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: false,
        props: {
          mapStyle: 'traffic',
          projectionTransforms: { form: 'BD09', to: 'WGS84' } as any,
          minimumLevel: 0,
          maximumLevel: 17
        } as VcImageryProviderBaiduProps
      }
    ],
    vectorLayers: [
      {
        name: 'admin',
        text: '行政区划',
        component: 'VcDatasourceGeojson',
        props: {
          strokeWidth: 5,
          stroke: '#ffc107',
          fill: 'transparent',
          show: false,
          data: '/datas/china.json'
        }
      },
      {
        name: 'terrain',
        text: '全球地形',
        component: 'VcTerrainProviderCesium',
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
    toggle({ names, show }) {
      const allLayers = [...this.baseLayers, ...this.overlayLayers, ...this.vectorLayers]
      names = Array.isArray(names) ? names : [names]
      names.forEach(name => {
        const layer = find(allLayers, v => v.name === name)
        !isUndefined(layer?.show) && (layer.show = show)
        !isUndefined(layer?.props?.show) && (layer.props.show = show)
      })
    },
    loadDefaultLayers(logined?) {
      const allLayerNames = [...this.baseLayers, ...this.overlayLayers, ...this.vectorLayers].map(v => v.name)
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
