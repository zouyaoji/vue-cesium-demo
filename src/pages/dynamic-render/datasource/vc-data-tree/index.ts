/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-07 21:23:53
 * @LastEditTime: 2022-09-12 22:53:38
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\datasource\vc-data-tree\index.ts
 */

import { VcDataset, VcFeature } from '@src/types/render-data'
import { QCheckbox, QChip, QExpansionItem, QIcon, QItem, QItemLabel, QItemSection, QList, Ripple } from 'quasar'
import { computed, defineComponent, h, nextTick, onBeforeUpdate, PropType, ref, withDirectives } from 'vue'
import { hasOwn } from 'vue-cesium/es/utils/util'
import LoadingIos from '@components/loading/Ios.vue'

export default defineComponent({
  name: 'VcDataTreeGeojson',
  props: {
    dense: Boolean,
    nodes: {
      type: Array as PropType<Array<VcDataset>>,
      default: () => []
    },
    filter: String,
    tickStrategy: {
      type: String as PropType<'none' | 'strict' | 'leaf-filtered' | 'leaf'>,
      default: 'leaf-filtered'
    },
    selectedColor: String,
    selected: String
    // ticked: Array,
    // expanded: Array,
    // accordion: Boolean
  },
  emits: {
    checked: (checked: boolean, dataset: VcFeature | VcDataset, parent?: VcDataset, index?: number) => true,
    'lazy-load': evt => true,
    'update:selected': (key: string, node: VcFeature, index: number) => true,
    zoomIconClicked: (key: string, node: VcFeature, index: number) => true
  },
  setup(props, ctx) {
    const lazy = ref({})
    // const innerTicked = ref(props.ticked || [])
    // const innerExpanded = ref(props.expanded || [])

    // watch(
    //   () => props.ticked,
    //   val => {
    //     innerTicked.value = val
    //   }
    // )

    let blurTargets = {}

    onBeforeUpdate(() => {
      blurTargets = {}
    })

    const hasSelection = computed(() => props.selected !== void 0)

    const computedFilterMethod = computed(() => (node, filter) => {
      const filt = filter.toLowerCase()
      const label = node.name || node.properties.name
      return label.toLowerCase().indexOf(filt) > -1
    })

    const meta = computed(() => {
      const meta = {}

      const travel = (node: VcDataset | VcFeature, index, parent) => {
        const tickStrategy = parent ? parent.tickStrategy : props.tickStrategy
        let key
        let isParent
        let localLazy
        let name
        let level
        let expanded
        let ticked
        let disabled
        let noTick
        let indeterminate
        let tickable
        if (hasOwn(node, 'type') && hasOwn(node, 'properties')) {
          const vcFeature = node as VcFeature
          key = vcFeature.properties.id
          isParent = false
          localLazy = false
          name = vcFeature.properties.name
          level = parent ? parent.level + 1 : 1
          ticked = vcFeature.properties.checked
          expanded = false
          disabled = vcFeature.properties.disabled
          noTick = vcFeature.properties.noTick
          indeterminate = undefined
          tickable = vcFeature.properties.disabled !== true && vcFeature.properties.tickable !== false
        } else {
          const vcDataset = node as VcDataset
          key = vcDataset.id
          isParent = vcDataset?.children && vcDataset?.children.length > 0
          localLazy = vcDataset.lazy
          name = vcDataset.name
          if (localLazy === true && lazy.value[key] !== void 0 && Array.isArray(vcDataset.children) === true) {
            localLazy = lazy.value[key]
          }
          level = parent ? parent.level + 1 : 1
          ticked = vcDataset.checked
          expanded = vcDataset.expanded
          disabled = vcDataset.disabled
          noTick = vcDataset.noTick
          indeterminate = vcDataset.indeterminate
          tickable = (vcDataset.disabled !== true && vcDataset.tickable !== false) || !vcDataset.children
        }

        const isLeaf = isParent !== true
        const selectable = disabled !== true && hasSelection.value === true
        const hasTicking = tickStrategy !== 'none'
        const strictTicking = tickStrategy === 'strict'
        const leafFilteredTicking = tickStrategy === 'leaf-filtered'
        const leafTicking = tickStrategy === 'leaf' || tickStrategy === 'leaf-filtered'

        if (leafTicking === true && tickable === true && parent && parent.tickable !== true) {
          tickable = false
        }

        const m = {
          index,
          name,
          key,
          parent,
          isParent,
          isLeaf,
          lazy: localLazy,
          disabled,
          level,
          children: [],
          matchesFilter: props.filter ? computedFilterMethod.value(node, props.filter) : true,
          selected: key === props.selected && selectable === true,
          selectable,
          // expanded: isParent === true ? innerExpanded.value.includes(key) : false,
          expanded,
          expandable: true,
          noTick: noTick === true || (strictTicking !== true && localLazy && localLazy !== 'loaded'),
          tickable,
          tickStrategy,
          hasTicking,
          strictTicking,
          leafFilteredTicking,
          leafTicking,
          indeterminate,
          indeterminateNextState: undefined,
          ticked
          // ticked:
          //   strictTicking === true
          //     ? innerTicked.value.includes(key)
          //     : isLeaf === true
          //     ? innerTicked.value.includes(key)
          //     : false
        }
        meta[key] = m

        if (isParent === true) {
          const vcDataset = node as VcDataset
          m.children = vcDataset.children.map((n, index) => travel(n, index, m))
          if (props.filter) {
            if (m.matchesFilter !== true) {
              m.matchesFilter = m.children.some(n => n.matchesFilter)
            } else if (
              m.noTick !== true &&
              m.disabled !== true &&
              m.tickable === true &&
              leafFilteredTicking === true &&
              m.children.every(n => n.matchesFilter !== true || n.noTick === true || n.tickable !== true) === true
            ) {
              m.tickable = false
            }
          }

          if (m.matchesFilter === true) {
            if (m.noTick !== true && strictTicking !== true && m.children.every(n => n.noTick) === true) {
              m.noTick = true
            }
            if (leafTicking) {
              m.ticked = false
              m.indeterminate = m.children.some(node => {
                if (hasOwn(node, 'type') && hasOwn(node, 'properties')) {
                  const s = node as VcFeature
                  return s.properties.indeterminate === true
                } else {
                  return node.indeterminate === true
                }
              })
              m.tickable = m.tickable === true && m.children.some(node => node.tickable)
              if (m.indeterminate !== true) {
                const sel = m.children.reduce((acc, meta) => (meta.ticked === true ? acc + 1 : acc), 0)
                if (sel === m.children.length) {
                  m.ticked = true
                } else if (sel > 0) {
                  m.indeterminate = true
                }
              }
              if (m.indeterminate === true) {
                // m.indeterminateNextState = m.children.every(meta => meta.tickable !== true || meta.ticked !== true)
                m.indeterminateNextState = m.children.every(
                  meta => (meta.tickable !== true || meta.ticked !== true) && meta.indeterminateNextState !== false
                )
              }
            }
          }
        }
        return m
      }

      props.nodes.forEach((node, index) => travel(node, index, null))
      return meta
    })

    const getNodeByKey = key => {
      const reduce = [].reduce

      const find = (result, node) => {
        if (result || !node) {
          return result
        }
        if (Array.isArray(node) === true) {
          return reduce.call(Object(node), find, result)
        }
        if (node?.id === key || node?.properties?.id === key) {
          return node
        }
        if (node.children) {
          return find(null, node.children)
        }
      }

      return find(null, props.nodes)
    }

    const onExpandClick = (expanded: boolean, dataset: VcDataset, meta, keyboard?) => {
      dataset.expanded = expanded
      setExpanded(meta.key, !meta.expanded, dataset, meta)
    }

    const setExpanded = (key, state, dataset: VcDataset, m = meta.value[key]) => {
      if (m.lazy && m.lazy !== 'loaded') {
        if (m.lazy === 'loading') {
          return
        }

        lazy.value[key] = 'loading'
        if (Array.isArray(dataset.children) !== true) {
          dataset.children = []
        }
        ctx.emit('lazy-load', {
          dataset,
          key,
          done: children => {
            lazy.value[key] = 'loaded'
            dataset.children =
              Array.isArray(children) === true ? [...dataset?.children, ...children] : [...dataset?.children]
            nextTick(() => {
              const localMeta = meta.value[key]
              if (localMeta && localMeta.isParent === true) {
                // localSetExpanded(key, true)
              }
            })
          },
          fail: () => {
            delete lazy.value[key]
            if (dataset.children.length === 0) {
              delete dataset.children
            }
          }
        })
      } else if (m.isParent === true && m.expandable === true) {
        // localSetExpanded(key, state)
      }
    }

    const onTickedClick = (state, node: VcDataset | VcFeature, m, parent?: VcDataset) => {
      if (m.indeterminate === true) {
        state = m.indeterminateNextState
      }

      if (m.strictTicking) {
        // setTicked([ meta.key ], state)
      } else if (m.leafTicking) {
        if (state === undefined) {
          state = false
        }
        // 处理子节点
        const travelChildren = (node: VcDataset | VcFeature, parent: VcDataset) => {
          if (hasOwn(node, 'type') && node['type'] === 'Feature') {
            const feature = node as VcFeature

            if (props.filter) {
              const matchesFilter = computedFilterMethod.value(node, props.filter)
              if (matchesFilter) {
                feature.properties.checked = state
              }
            } else {
              feature.properties.checked = state
            }
          } else {
            const vcDataset = node as VcDataset
            vcDataset.checked = state
            vcDataset.indeterminate = undefined
            vcDataset?.children?.forEach(node => travelChildren(node, vcDataset))
          }
        }

        travelChildren(node, parent)
      }

      ctx.emit('checked', state, node, parent, m.index)
    }

    const getTotalCount = (dataset: VcDataset) => {
      let count = 0

      const travel = children => {
        children.forEach(item => {
          if (item.children) {
            travel(item?.children)
          } else {
            count++
          }
        })
      }

      travel(dataset?.children || [])
      return count
    }

    function blur(key) {
      const blurTarget = blurTargets[key]
      blurTarget && blurTarget.focus()
    }

    const onFeatureLocationClick = (node: VcFeature, meta, e, keyboard?) => {
      keyboard !== true && blur(meta.key)

      ctx.emit('zoomIconClicked', meta.key, node, meta.index)
      e.stopPropagation()
    }

    const onFeatureClick = (node: VcFeature, meta, e, keyboard?) => {
      keyboard !== true && blur(meta.key)

      if (hasSelection.value && meta.selectable) {
        ctx.emit('update:selected', meta.key, node, meta.index)
      } else {
        // onExpandClick(node, meta, e, keyboard)
      }

      if (typeof node.properties.handler === 'function') {
        node.properties.handler(node)
      }
    }

    const getNode = (node: VcDataset | VcFeature, parent?: VcDataset) => {
      // Feature
      if (hasOwn(node, 'type') && node['type'] === 'Feature') {
        const feature = node as VcFeature
        const key = feature.properties.id
        const m = meta.value[key]
        const featureRenderContent = []
        // 空白
        for (let i = 0; i < m.level - 1; i++) {
          featureRenderContent.push(h(QItemSection, { side: true }))
        }

        // checkbox
        featureRenderContent.push(
          h(QItemSection, { side: true }, () =>
            h(QCheckbox, {
              modelValue: m.ticked,
              dense: true,
              disable: m.tickable !== true,
              'onUpdate:modelValue': e => onTickedClick(e, feature, m, parent)
            })
          )
        )
        // 图标
        featureRenderContent.push(
          h(QItemSection, { side: true }, () =>
            h(QIcon, {
              size: '16px',
              name: feature.properties.icon || 'circle',
              style: 'color: #00e472'
            })
          )
        )
        // 名称
        featureRenderContent.push(h(QItemSection, {}, () => h(QItemLabel, {}, () => feature.properties.name)))
        // loading 图标
        // if (feature.properties.loading) {
        //   featureRenderContent.push(
        //     h(QItemSection, { side: true }, () => h(LoadingIos, { size: '1.5em', dense: true }))
        //   )
        // }
        if (m.lazy === 'loading' || feature.properties.loading === true) {
          featureRenderContent.push(
            h(QItemSection, { side: true }, () => h(LoadingIos, { size: '1.5em', dense: true }))
          )
        }
        // 定位图标
        if (feature.properties.checked) {
          featureRenderContent.push(
            h(QItemSection, { side: true }, () =>
              h(QIcon, {
                size: '20px',
                name: 'room',
                onClick: e => {
                  onFeatureLocationClick(feature, m, e)
                }
              })
            )
          )
        }
        return withDirectives(
          h(
            QItem,
            {
              clickable: true,
              activeClass: 'text-amber-6',
              dark: true,
              active: m.selected,
              onClick: e => {
                onFeatureClick(feature, m, e)
              }
            },
            () => featureRenderContent
          ),
          [[Ripple]]
        )
      } else {
        const dataset = node as VcDataset
        const key = dataset.id
        const m = meta.value[key]
        const children = m.isParent === true ? getChildren(dataset.children, dataset) : []
        const isParent = children.length > 0 || (m.lazy && m.lazy !== 'loaded')

        if (isParent) {
          const datasetRenderContent = []
          // 空白
          for (let i = 0; i < m.level - 1; i++) {
            datasetRenderContent.push(h(QItemSection, { side: true }))
          }
          // checkbox
          datasetRenderContent.push(
            h(QItemSection, { side: true }, () =>
              h(QCheckbox, {
                modelValue: m.indeterminate === true ? null : m.ticked,
                disable: m.tickable !== true || !dataset?.children,
                dense: true,
                'onUpdate:modelValue': e => onTickedClick(e, dataset, m, parent)
              })
            )
          )
          // 图标
          datasetRenderContent.push(
            h(QItemSection, { side: true }, () =>
              h(QIcon, {
                size: '16px',
                name: 'home',
                style: 'color: #00e472'
              })
            )
          )
          // 名称
          datasetRenderContent.push(h(QItemSection, {}, () => h(QItemLabel, {}, () => dataset.name)))
          // 统计
          const totalCount = getTotalCount(dataset)
          if (totalCount !== 0) {
            datasetRenderContent.push(
              h(QItemSection, { side: true }, () => h(QChip, { dense: true, dark: true }, () => `${totalCount}条`))
            )
          }
          // loading
          if (m.lazy === 'loading' || dataset.loading === true) {
            datasetRenderContent.push(
              h(QItemSection, { side: true }, () => h(LoadingIos, { size: '1.5em', dense: true }))
            )
          }

          return h(
            QExpansionItem,
            {
              modelValue: m.expanded,
              expandIcon: 'arrow_circle_down',
              expandSeparator: true,
              clickable: true,
              dark: true,
              dense: props.dense,
              'onUpdate:modelValue': e => onExpandClick(e, dataset, m)
            },
            {
              header: () => datasetRenderContent,
              default: () => children
            }
          )
        }
      }
    }

    const getChildren = (nodes, parent?: VcDataset) => {
      const children = (
        props.filter ? nodes.filter(v => meta.value[v.id || v.properties.id].matchesFilter) : nodes
      ).map(child => getNode(child, parent))

      return children.length
        ? [
            h(
              QList,
              {
                dense: props.dense
              },
              () => children
            )
          ]
        : []
    }

    return () => {
      const children = getChildren(props.nodes)
      return h(
        'div',
        {
          class: `vc-data-tree ${children.length === 0 ? 'text-center' : ''}`
        },
        children.length === 0 ? (props.filter ? '找不到匹配的数据' : '没有可用数据') : children
      )
    }
  }
})
