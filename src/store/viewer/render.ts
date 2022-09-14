/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-05-25 19:56:26
 * @LastEditTime: 2022-09-13 22:49:36
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\store\viewer\render.ts
 */
import { remove, findIndex, find } from 'lodash'
import { defineStore, acceptHMRUpdate } from 'pinia'
import * as logger from '@src/utils/logger'
import { VcFeature } from '@src/types/render-data'

export const useRenderStore = defineStore('render', {
  // a function that returns a fresh state
  state: () => ({
    renderDatas: [],
    selectedRenderData: {
      model: undefined, // model 有值说明已经被渲染出来了
      renderingType: undefined,
      restoreHandlers: [],
      feature: undefined as VcFeature,
      featureInfoListItems: []
    }
  }),
  // optional getters
  getters: {},
  // optional actions
  actions: {
    /**
     * 添加渲染数据或渲染数据集合
     * @param renderDatas
     */
    addRenderDatas(renderDatas) {
      renderDatas = Array.isArray(renderDatas) ? renderDatas : [renderDatas]
      renderDatas.forEach(renderData => {
        if (findIndex(this.renderDatas, v => v.id === renderData.id) !== -1) {
          logger.error(
            `添加渲染数据集失败，原因：id 为【${renderData.id} 】的数据已经存在。`,
            '渲染数据模型：',
            renderData
          )
          return
        }
        this.renderDatas.push(renderData)
      })
    },
    /**
     * 根据 id 移除渲染数据。
     * @param id
     */
    removeRenderDataById(id) {
      remove(this.renderDatas, v => v.id === id)
    },
    /**
     * 根据 type 移除渲染数据。
     * @param type
     */
    removeRenderDataByType(type) {
      remove(this.renderDatas, v => v.type === type)
    },
    /**
     * 根据 page 移除渲染数据。
     * @param page
     */
    removeRenderDataByPage(page) {
      remove(this.renderDatas, v => v.page === page)
    },
    /**
     * 移除所有渲染数据。
     */
    removeAllRenderData() {
      this.renderDatas.length = 0
    },
    /**
     * 设置选中的渲染数据。
     * @param renderData
     */
    setSelectedRenderData(renderData, clearRestoreHandlers?: boolean) {
      this.selectedRenderData.model = renderData.model
      this.selectedRenderData.renderingType = renderData.renderingType
      this.selectedRenderData.feature = renderData.feature
      this.selectedRenderData.featureInfoListItems = renderData.featureInfoListItems
      if (clearRestoreHandlers) {
        this.selectedRenderData.restoreHandlers = []
      } else {
        this.selectedRenderData.restoreHandlers.push(...renderData.restoreHandlers)
      }
    },
    /**
     * 根据 id 获取渲染数据。
     * @param id
     * @returns
     */
    getRenderDataByDatasetId(id) {
      return find(this.renderDatas, v => v.id === id)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRenderStore, import.meta.hot))
}
