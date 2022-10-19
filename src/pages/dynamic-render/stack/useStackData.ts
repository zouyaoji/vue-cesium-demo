/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-09-20 10:02:26
 * @LastEditTime: 2022-10-20 01:13:15
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\stack\useStackData.ts
 */
import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'
export default function () {
  const stackDatas = reactive([
    {
      id: uuidv4(),
      label: '农用地',
      checked: false,
      data: `/datas/work-bench/TDLY农用地.json`,
      renderingType: 'polygon',
      entityProps: {
        polygon: {
          material: 'rgba(127,194,105,0.8)'
        }
      },
      entitySelectedProps: {
        polygon: {
          material: 'rgba(137,207,240,0.8)'
        }
      }
    },
    {
      id: uuidv4(),
      label: '住宅用地',
      checked: false,
      data: `/datas/work-bench/TDLY住宅用地.json`,
      renderingType: 'polygon',
      entityProps: {
        polygon: {
          material: 'rgba(238,241,160,0.8)'
        }
      },
      entitySelectedProps: {
        polygon: {
          material: 'rgba(137,207,240,0.8)'
        }
      }
    },
    {
      id: uuidv4(),
      label: '集体建设用地',
      checked: false,
      data: `/datas/work-bench/TDLY集体建设.json`,
      renderingType: 'polygon',
      entityProps: {
        polygon: {
          material: 'rgba(227,108,9,0.8)'
        }
      },
      entitySelectedProps: {
        polygon: {
          material: 'rgba(137,207,240,0.8)'
        }
      }
    },
    {
      id: uuidv4(),
      label: '工业用地',
      checked: false,
      data: `/datas/work-bench/TDLY工业用地.json`,
      renderingType: 'polygon',
      entityProps: {
        polygon: {
          material: 'rgba(216,216,216,0.8)'
        }
      },
      entitySelectedProps: {
        polygon: {
          material: 'rgba(137,207,240,0.8)'
        }
      }
    }
  ])
  return {
    stackDatas
  }
}
