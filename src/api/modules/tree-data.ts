/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-07-21 17:27:55
 * @LastEditTime: 2022-08-31 22:34:10
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\api\modules\tree-data.ts
 */
import { v4 as uuidv4 } from 'uuid'
export default [
  {
    id: uuidv4(),
    name: 'DataSource',
    label: '数据源',
    icon: '',
    children: [
      {
        id: uuidv4(),
        name: '机场',
        icon: '',
        checked: false,
        expanded: false,
        fetchStr: `/datas/work-bench/机场.json`,
        renderingType: 'billboard',
        lazy: true,
        props: {
          billboard: {
            image: `${import.meta.env.BASE_URL}images/飞机场.svg`,
            color: '#ffc10',
            scale: 0.25,
            verticalOrigin: 1,
            scaleByDistance: [1e2, 2, 1.5e5, 0.5],
            distanceDisplayCondition: [0, 3.0e7]
          }
        },
        selectedProps: {
          billboard: {
            color: 'red',
            scale: 1
          }
        }
      },
      {
        id: uuidv4(),
        name: '水系',
        icon: '',
        checked: false,
        expanded: false,
        fetchStr: `/datas/work-bench/水系.json`,
        renderingType: 'polyline',
        lazy: true,
        props: {
          polyline: {
            width: 1
          }
        },
        selectedProps: {
          polyline: {
            width: 2,
            material: '#ffc107'
          }
        }
      },
      {
        id: uuidv4(),
        name: '岛屿',
        icon: '',
        checked: false,
        expanded: false,
        fetchStr: `/datas/work-bench/岛屿.json`,
        renderingType: 'polygon,polyline,billboard',
        lazy: true,
        props: {
          billboard: {
            image: `${import.meta.env.BASE_URL}images/岛屿.svg`,
            scale: 0.2,
            verticalOrigin: 1,
            scaleByDistance: [1e2, 2, 1.5e5, 0.5],
            distanceDisplayCondition: [0, 3.0e6]
          },
          polygon: { material: 'rgba(137,207,240,0.5)' },
          polyline: { width: 4, material: '#0033ff' }
        },
        selectedProps: {
          billboard: {
            scale: 0.5
          },
          polygon: { material: '#ffc107' },
          polyline: { width: 8, material: 'red' }
        }
      },
      {
        id: uuidv4(),
        name: '模型',
        icon: '',
        checked: false,
        expanded: false,
        renderingType: 'model',
        children: [
          {
            id: uuidv4(),
            name: 'Tileset 模型',
            icon: '',
            checked: false,
            expanded: false,
            fetchStr: `/datas/work-bench/Tileset模型.json`,
            lazy: true,
            renderingType: 'tileset',
            props: {
              tileset: {}
            }
          },
          {
            id: uuidv4(),
            name: 'GLTF 模型',
            icon: '',
            checked: false,
            expanded: false,
            fetchStr: `/datas/work-bench/GLTF模型.json`,
            lazy: true,
            renderingType: 'model',
            props: {
              model: {
                scale: 1
              }
            },
            selectedProps: {
              model: {
                color: 'red'
              }
            }
          },
          {
            id: uuidv4(),
            name: '模型嵌套',
            icon: '',
            checked: false,
            expanded: false,
            renderingType: 'model',
            children: [
              {
                id: uuidv4(),
                name: 'GLTF 模型',
                icon: '',
                checked: false,
                expanded: false,
                lazy: true,
                fetchStr: `/datas/work-bench/GLTF模型.json`,
                renderingType: 'model',
                props: {
                  model: {
                    scale: 1
                  }
                }
              },
              {
                type: 'Feature',
                properties: {
                  name: '飞机',
                  hpr: '[135, 0, 0]',
                  renderingType: 'model',
                  checked: false,
                  props: {
                    model: {
                      uri: '../datas/gltf/Cesium_Air.glb'
                    }
                  },
                  selectedProps: {
                    model: {
                      color: 'red'
                    }
                  }
                },
                geometry: {
                  coordinates: [121.25202608700887, 32.14045397527647],
                  type: 'Point'
                }
              }
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        name: '图层',
        icon: '',
        checked: false,
        expanded: false,
        renderingType: 'imagery',
        children: [
          {
            id: uuidv4(),
            name: '图层嵌套',
            icon: '',
            checked: false,
            expanded: false,
            fetchStr: `/datas/work-bench/图层.json`,
            lazy: true,
            renderingType: 'imagery',
            props: {
              imagery: {}
            }
          },
          {
            type: 'Feature',
            properties: {
              id: uuidv4(),
              checked: false,
              name: 'WMS',
              props: {
                imagery: {
                  alpha: 1,
                  brightness: 1,
                  contrast: 1,
                  sortOrder: 60,
                  children: [
                    {
                      cmpName: 'VcImageryProviderWms',
                      props: {
                        url: 'https://nationalmap.gov.au/proxy/http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows',
                        layers: 'Hydrography:bores',
                        parameters: {
                          format: 'image/png',
                          transparent: true
                        },
                        rectangle: [112, -43, 154, -10]
                      }
                    }
                  ]
                }
              }
            },
            geometry: {
              coordinates: [108.965836, 34.225607],
              type: 'Point'
            }
          }
        ]
      }
    ]
  }
]
