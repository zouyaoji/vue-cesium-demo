/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-10-27 15:22:31
 * @LastEditTime: 2021-12-29 17:37:52
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\modules\viewer\render.ts
 */
import { remove, findIndex, find } from 'lodash'
import  * as logger from '@src/utils/logger'

export default {
  namespaced: true,
  state: {
    /**
     * 用于动态渲染的数据。
     * @param {RenderData}
     */
    renderDatas: [],
    selectedRenderData: {
      model: undefined, // model 有值说明已经被渲染出来了
      renderingType: undefined,
      restoreHandler: undefined,
      feature: undefined,
      featureInfoListItems: []
    },
    renderingApi: 'entity' // entity primitive
  },
  getters: {
    selectedRenderData(state) {
      return state.selectedRenderData
    },
    renderingApi(state) {
      return state.renderingApi
    }
  },
  mutations: {
    /**
     * 添加渲染数据或渲染数据组
     * @param {*} state
     * @param {RenderData | Array<RenderData>} renderDatas
     */
    addRenderDatas(state, renderDatas) {
      renderDatas = Array.isArray(renderDatas) ? renderDatas : [renderDatas]
      renderDatas.forEach(renderData => {
        if (findIndex(state.renderDatas, v => v.id === renderData.id) !== -1) {
          logger.error(
            `添加渲染数据集失败，原因：id 为【${renderData.id} 】的数据已经存在。`,
            '渲染数据模型：',
            renderData
          )
          return
        }
        state.renderDatas.push(renderData)
      })
    },
    /**
     * 根据 id 移除渲染数据。
     * @param {*} state
     * @param {string} id
     */
    removeRenderDataById(state, id) {
      remove(state.renderDatas, v => v.id === id)
    },
    /**
     * 根据 type 移除渲染数据。
     * @param {*} state
     * @param {string} type
     */
    removeRenderDataByType(state, type) {
      remove(state.renderDatas, v => v.type === type)
    },
    /**
     * 根据 page 移除渲染数据。
     * @param {*} state
     * @param {string} type
     */
    removeRenderDataByPage(state, page) {
      remove(state.renderDatas, v => v.page === page)
    },
    /**
     * 移除所有渲染数据
     * @param {*} state
     */
    removeAllRenderData(state) {
      state.renderDatas.length = 0
    },
    setSelectedRenderData(state, renderData) {
      state.selectedRenderData.model = renderData.model
      state.selectedRenderData.renderingType = renderData.renderingType
      state.selectedRenderData.restoreHandler = renderData.restoreHandler
      state.selectedRenderData.feature = renderData.feature
      state.selectedRenderData.featureInfoListItems = renderData.featureInfoListItems
    }
  },
  actions: {
    /**
     * 根据 id 获取渲染数据。
     * @param {*} param0
     * @param {*} id
     * @returns
     */
    getRenderDataByDatasetId({ state }, id) {
      return find(state.renderDatas, v => v.id === id)
    }
  }
}
