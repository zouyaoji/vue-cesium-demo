/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-07-21 17:27:55
 * @LastEditTime: 2022-07-23 15:38:49
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
        id: '555',
        name: '机场',
        icon: '',
        checked: false,
        expanded: false,
        fetchStr: `/datas/work-bench/机场.json`,
        canRenderDirectly: true,
        hasDetail: true,
        renderingType: 'billboard',
        props: {
          billboard: {
            image: `${import.meta.env.BASE_URL}images/飞机场.svg`,
            color: '#ffc10',
            scale: 0.25,
            verticalOrigin: 1,
            scaleByDistance: [1e2, 2, 1.5e5, 0.5],
            distanceDisplayCondition: [0, 3.0e7]
          }
        }
      },
      {
        id: '666',
        name: '水系',
        icon: '',
        checked: false,
        expanded: false,
        fetchStr: `/datas/work-bench/水系.json`,
        canRenderDirectly: true,
        hasDetail: true,
        renderingType: 'polyline',
        props: {
          polyline: {
            width: 1
          }
        }
      },
      {
        id: '777',
        name: '岛屿',
        icon: '',
        checked: false,
        expanded: false,
        fetchStr: `/datas/work-bench/岛屿.json`,
        canRenderDirectly: true,
        hasDetail: true,
        renderingType: 'polygon,polyline,billboard',
        props: {
          billboard: {
            image: `${import.meta.env.BASE_URL}images/岛屿.svg`,
            scale: 0.2,
            verticalOrigin: 1,
            scaleByDistance: [1e2, 2, 1.5e5, 0.5],
            distanceDisplayCondition: [0, 3.0e6]
          },
          polygon: { width: 2, material: 'rgba(137,207,240,0.5)' },
          polyline: { width: 4, material: '#0033ff' }
        }
      },
      {
        id: '888',
        name: 'Tileset 模型',
        icon: '',
        checked: false,
        expanded: false,
        fetchStr: `/datas/work-bench/Tileset模型.json`,
        canRenderDirectly: true,
        hasDetail: true,
        renderingType: 'tileset',
        props: {
          tileset: {}
        }
      },
      {
        id: '999',
        name: 'GLTF 模型',
        icon: '',
        checked: false,
        expanded: false,
        fetchStr: `/datas/work-bench/GLTF模型.json`,
        canRenderDirectly: true,
        hasDetail: true,
        renderingType: 'model',
        props: {
          model: {
            scale: 1
          }
        }
      }
    ]
  }
]
