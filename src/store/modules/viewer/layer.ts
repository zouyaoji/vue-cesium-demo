/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-09-15 11:06:15
 * @LastEditTime: 2022-02-06 23:06:58
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\viewer\layer.ts
 */
import { find, isUndefined } from 'lodash'
export default {
  namespaced: true,
  state: {
    /**
     * 底图图层列表
     */
    baseLayers: [
      {
        name: 'tianditu_img',
        text: '天地图影像',
        component: 'VcImageryProviderTianditu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: true,
        props: {
          mapStyle: 'img_c',
          token: '436ce7e50d27eede2f2929307e6b33c0',
          minimumLevel: 0,
          maximumLevel: 17
        }
      },
      {
        name: 'tianditu_vec',
        text: '天地图矢量',
        component: 'VcImageryProviderTianditu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: true,
        props: {
          mapStyle: 'vec_c',
          token: '436ce7e50d27eede2f2929307e6b33c0',
          minimumLevel: 0,
          maximumLevel: 17
        }
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
          customid: 'dark',
          projectionTransforms: { form: 'BD09', to: 'WGS84' }
        }
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
          customid: 'midnight',
          projectionTransforms: { form: 'BD09', to: 'WGS84' }
        }
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
    /**
     * 数据图层列表。
     */
    rasterLayers: [
      {
        name: 'tianditu_cva',
        text: '天地图注记',
        component: 'VcImageryProviderTianditu',
        alpha: 1,
        brightness: 1,
        contrast: 1,
        sortOrder: 20,
        show: true,
        props: {
          mapStyle: 'cva_c',
          token: '436ce7e50d27eede2f2929307e6b33c0',
          minimumLevel: 0,
          maximumLevel: 17
        }
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
          data: './datas/china.json'
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
  },
  mutations: {
    /**
     * 底图切换图层（集合）显隐
     * @param {*} state
     * @param {*} param1
     */
    toggle(state, { names, show }) {
      const allLayers = [...state.baseLayers, ...state.rasterLayers, ...state.vectorLayers]
      names = Array.isArray(names) ? names : [names]
      names.forEach(name => {
        const layer = find(allLayers, v => v.name === name)
        !isUndefined(layer?.show) && (layer.show = show)
        !isUndefined(layer?.props?.show) && (layer.props.show = show)
      })
    }
  },
  actions: {
    /**
     * 加载默认要显示的数据。
     * @param {*} param0
     */
    loadDefaultLayers({ state, dispatch, commit }, logined) {
      const allLayerNames = [...state.baseLayers, ...state.rasterLayers, ...state.vectorLayers].map(v => v.name)
      commit('toggle', {
        names: allLayerNames,
        show: false
      })
      const showLayerNames = ['tianditu_img', 'tianditu_cva', 'admin']
      commit('toggle', {
        names: showLayerNames,
        show: true
      })
    }
  }
}
