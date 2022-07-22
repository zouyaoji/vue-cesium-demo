<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-21 10:12:43
 * @LastEditTime: 2022-07-22 23:34:28
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\pages\dynamic-render\datasource\data-list-tree\Index.vue
-->
<template>
  <q-list dense>
    <template v-for="(dataset, index) in datas" :key="index">
      <q-item-label v-if="dataset.isGroup" class="group-caption" caption header>
        {{ dataset.name }}
      </q-item-label>
      <q-expansion-item
        v-if="dataset.hasDetail"
        v-model="dataset.expanded"
        expand-icon="arrow_circle_down"
        expand-separator
        clickable
        dark
        @update:model-value="showOrHideDatasetList($event, dataset)"
      >
        <template #header>
          <q-item-section v-for="n of dataset.level > 0 ? dataset.level - 1 : 0" :key="n" side></q-item-section>
          <q-item-section side>
            <q-checkbox v-model="dataset.checked" dense @update:model-value="addOrRemoveDataset($event, dataset)" />
          </q-item-section>
          <q-item-section side>
            <q-icon size="16px" :class="`spd-icons ${dataset.iconHtV2}`" style="color: #00e472" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ dataset.name }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="getTotalCount(dataset) !== 0" side>
            <q-chip dense dark>{{ getTotalCount(dataset) }} 条</q-chip>
          </q-item-section>
          <q-item-section v-if="dataset.loading" side>
            <loading-ios size="1.5em" dense></loading-ios>
          </q-item-section>
        </template>
        <template v-if="dataset.fetchStr">
          <q-item
            v-for="(feature, subIndex) in dataset.children"
            :key="subIndex"
            v-ripple
            clickable
            active-class="text-amber-6"
            dense
          >
            <q-item-section v-for="n of dataset.level > 0 ? dataset.level : 1" :key="n" side></q-item-section>
            <q-item-section side>
              <q-checkbox
                v-model="feature.properties.checked"
                :disable="dataset.loading || feature.loading || dataset.renderingType === ''"
                @update:model-value="showOrHideFeature($event, dataset, subIndex, feature)"
              />
            </q-item-section>
            <!-- <q-item-section side>
              <q-icon size="16px" :class="`spd-icons ${dataset.iconHtV2}`" style="color: #00e472" />
            </q-item-section> -->
            <q-item-section @click="showFeatureInfo(dataset, feature, subIndex)">
              <q-item-label>{{ feature.properties.name }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="feature.loading" side>
              <loading-ios size="1.5em" dense></loading-ios>
            </q-item-section>
            <q-item-section
              v-if="feature.properties.checked"
              side
              @click.prevent="flyToFeature(dataset, feature, subIndex)"
            >
              <q-icon size="20px" class="location-icon" name="room" />
            </q-item-section>
          </q-item>
        </template>
        <index
          v-if="dataset.children && !dataset.canRenderDirectly"
          :data="dataset.children"
          @addOrRemoveDataset="(show, dataset, subIndex) => $emit('addOrRemoveDataset', show, dataset, subIndex)"
          @flyToFeature="(dataset, feature, subIndex) => $emit('flyToFeature', dataset, feature, subIndex)"
          @showFeatureInfo="(dataset, feature, subIndex) => $emit('showFeatureInfo', dataset, feature, subIndex)"
        >
        </index>
      </q-expansion-item>
      <index
        v-else
        :data="dataset.children"
        @addOrRemoveDataset="(show, dataset, subIndex) => $emit('addOrRemoveDataset', show, dataset, subIndex)"
        @flyToFeature="(dataset, feature, subIndex) => $emit('flyToFeature', dataset, feature, subIndex)"
        @showFeatureInfo="(dataset, feature, subIndex) => $emit('showFeatureInfo', dataset, feature, subIndex)"
      >
      </index>
    </template>
  </q-list>
</template>
<script lang="ts" setup>
import { computed, PropType, watch } from 'vue'
import LoadingIos from '@components/loading/Ios.vue'
import type { VcDataset, VcFeature } from '@src/types/render-data'
import { hasOwn } from 'vue-cesium/es/utils/util'

const props = defineProps({
  nodes: {
    type: Array as PropType<Array<VcDataset>>,
    default: () => []
  },
  filter: String
})

const computedFilterMethod = computed(() => (node, filter) => {
  const filt = filter.toLowerCase()
  const label = node.name || node.properties.name
  return label.toLowerCase().indexOf(filt) > -1
})

const meta = computed(() => {
  const meta = {}

  const travel = (node: VcDataset | VcFeature, parent) => {
    let key
    let isParent
    if (hasOwn(node, 'type') && hasOwn(node, 'properties')) {
      const vcFeature = node as VcFeature
      key = vcFeature.properties.id
      isParent = false
    } else {
      const vcDataset = node as VcDataset
      key = vcDataset.id
      isParent = vcDataset?.children && vcDataset?.children.length > 0
    }
    const m = {
      key,
      parent,
      isParent,
      children: [],
      matchesFilter: props.filter ? computedFilterMethod.value(node, props.filter) : true
    }
    meta[key] = m

    if (isParent === true) {
      const vcDataset = node as VcDataset
      m.children = vcDataset.children.map(n => travel(n, m))
      if (props.filter) {
        if (m.matchesFilter !== true) {
          m.matchesFilter = m.children.some(n => n.matchesFilter)
        }
      }
    }
    return m
  }

  props.nodes.forEach(node => travel(node, null))

  return meta
})

watch(
  () => props.filter,
  v => {
    getChildren(props.nodes, true)
  }
)

const getNode = (node, restore?) => {
  const key = node.id || node.properties.id
  const m = meta.value[key]

  const children = m.isParent === true ? getChildren(node.children) : []

  if (restore) {
    node.children = node._children
  } else {
    node._children = node.children
    node.children = children
  }

  return node
}

const getChildren = (nodes, restore?) => {
  return (props.filter ? nodes.filter(v => meta.value[v.id || v.properties.id].matchesFilter) : nodes).map(v =>
    getNode(v, restore)
  )
}

const datas = computed(() => {
  return getChildren(props.nodes)
})

const emits = defineEmits({
  addOrRemoveDataset: (show: boolean, dataset: VcDataset, subIndex?: number, feature?: VcFeature) => true,
  flyToFeature: (dataset: VcDataset, feature: VcFeature, subIndex?: number) => true,
  showFeatureInfo: (dataset: VcDataset, feature: VcFeature, subIndex?: number) => true,
  showOrHideDatasetList: (show: boolean, dataset: VcDataset) => true
})

const addOrRemoveDataset = (show: boolean, dataset: VcDataset, subIndex?: number, feature?: VcFeature) => {
  emits('addOrRemoveDataset', show, dataset, subIndex, feature)
}

const flyToFeature = (dataset: VcDataset, feature: VcFeature, subIndex?: number) => {
  emits('flyToFeature', dataset, feature, subIndex)
}

const showFeatureInfo = (dataset: VcDataset, feature: VcFeature, subIndex?: number) => {
  emits('showFeatureInfo', dataset, feature, subIndex)
}

const showOrHideFeature = (show: boolean, dataset: VcDataset, subIndex: number, feature: VcFeature) => {
  if (show) {
    if (!dataset.checked) {
      dataset.checked = true
      emits('addOrRemoveDataset', show, dataset, subIndex, feature)
    }
  }
}

const showOrHideDatasetList = (show: boolean, dataset: VcDataset) => {
  emits('showOrHideDatasetList', show, dataset)
}

const getTotalCount = (dataset: VcDataset) => {
  return dataset?.children?.length
}
</script>

<style lang="scss" scoped>
.group-caption {
  font-weight: bold;
  color: rgb(255, 193, 7);
  font-size: 14px;
}
</style>
