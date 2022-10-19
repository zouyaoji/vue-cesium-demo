import type { Feature, Geometry, Properties } from '@turf/turf'
import type { VcCamera, VcCesiumObject } from 'vue-cesium/es/utils/types'

/**
 * 渲染要素属性
 */
export interface VcProperties extends Properties {
  /**
   * 要素 id
   */
  id: number | string
  /**
   * 渲染类型。
   * 约定渲染多个类型用英文 , 隔开。
   */
  renderingType: string
  /**
   * 要素名称
   */
  name?: string
  /**
   * 是否勾选（勾选即 UI 界面显示勾选状态，且该要素在场景中可见，反之亦然）
   */
  checked?: boolean
  /**
   * 实际渲染类型。
   */
  actualRenderingType?: string
  /**
   * 所属数据集的id。（自动赋值）
   */
  datasetId?: number | string
  /**
   * 所属数据集的Name。（自动赋值）
   */
  datasetName?: string
  /**
   * 是否处于loading状态
   */
  loading?: boolean
  /**
   * 定位时的相机参数
   */
  vcCamera?: VcCamera
}

export interface VcFeature<T = Geometry> extends Feature<T> {
  type: 'Feature'
  properties: VcProperties
}

export interface VcDataset {
  id: number | string
  name?: string
  /**
   * 是否展开
   */
  expanded?: boolean
  /**
   * 是否勾选（勾选即 UI 界面显示勾选则所有子要素勾选，并添加到场景，反之亦然）
   */
  checked?: boolean
  /**
   * 是否处于加载状态
   */
  loading?: boolean
  props?: any
  /**
   * 数据集渲染类型。非渲染类型的数据集 renderingType 填空字符串 ''
   */
  renderingType: string
  /**
   * 子要素集合
   */
  children?: Array<VcFeature | VcDataset>
  /**
   * 实际渲染的 cesium 对象。
   */
  cesiumObjects?: Array<VcCesiumDemoObject>
  /**
   * 数据集子要素的请求地址或者请求方法
   */
  fetchStr?: string | VcDatasetGetMethod
  /**
   * 是否是懒加载
   */
  lazy?: boolean
  /**
   * 列表 UI 所用的 iconfont 或者 svg 图标
   */
  icon?: string
  /**
   * 是否是分组标题
   */
  group?: boolean
  /**
   * 是否可以直接渲染
   */
  canRenderDirectly?: boolean
  [key: string]: any
}

// eslint-disable-next-line @typescript-eslint/member-delimiter-style
export type VcCesiumDemoObject = VcCesiumObject & { datasetId?: string | number }

export type VcDatasetGetMethod = () => Promise<{
  code: number
  data: any
  msg: string
}>

/**
 * 渲染数据模型
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface VcRenderData<
  T = {
    [key: string]: any
  }
> {
  /**
   * VcRenderData 唯一 id
   */
  id: string | number
  /**
   * 名称
   */
  name?: string
  /**
   * 所属页面
   */
  page: string
  /**
   * 类型
   */
  type?: string
  /**
   * 渲染数据集
   */
  datasets: Array<VcRenderDataset<T>>
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface VcRenderDataset<T = {}> {
  /**
   * 唯一 id。
   */
  id?: string | number
  /**
   * 渲染数据集的组件名字
   */
  cmpName: string
  /**
   * 渲染数据集的模板引用
   */
  cmpRef?: T
  /**
   * 渲染数据集的 props
   */
  props: {
    [key: string]: any
  }
  feature?: VcFeature
  children?: Array<VcRenderDataset>
}

export interface VcSelectedRenderData {
  /**
   * 选中对象 feature
   */
  feature: VcFeature
  /**
   * 选中对象的属性列表
   */
  featureInfoListItems: Array<{
    [key: string]: any
  }>
  /**
   * 选中对象渲染 model
   */
  model:
    | undefined
    | {
        [key: string]: any
      }
  renderingType: string
  restoreHandlers: Array<() => void>
}

export interface VcDatasourceCategory {
  id: string | number
  code: string
  name: string
  checked: boolean
  expanded: boolean
  children?: Array<VcDataset>

  [key: string]: any
}
