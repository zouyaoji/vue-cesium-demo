<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:02:05
 * @LastEditTime: 2022-01-10 16:43:03
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\log\LogTable.vue
-->
<template>
  <q-table class="log-table-list" :rows="logs" :columns="columns" :pagination="initialPagination">
    <template #body="props">
      <q-tr :props="props">
        <q-td key="time" class="text-center">
          {{ props.row.time }}
        </q-td>
        <q-td key="message" class="text-center">
          {{ props.row.message }}
        </q-td>
        <q-td key="url" class="text-center">
          {{ props.row.meta.url }}
        </q-td>
        <q-td key="more" class="text-center">
          <q-btn icon="more" rounded @click="handleShowMore(props.row)" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { Notify } from 'quasar'
import * as logger from '@src/utils/logger'
const webStoragePrefix = import.meta.env.VITE_VUE_APP_PREFIX

const $store = useStore()
const initialPagination = reactive({
  sortBy: 'desc',
  descending: false,
  rowsPerPage: 10
})

const columns = ref<any>([
  {
    id: 'time',
    label: '时间',
    field: 'time',
    align: 'center'
  },
  {
    id: 'message',
    label: '信息',
    field: 'message',
    align: 'center'
  },
  {
    id: 'url',
    label: '触发页面',
    field: 'url',
    align: 'center'
  },
  // {
  //   id: 'tag',
  //   label: '触发组件',
  //   field: 'tag',
  //   align: 'center'
  // },
  {
    id: 'more',
    label: '查看详情',
    align: 'center'
  }
])

const logs = computed(() => {
  return $store.state.system.log.log
})

const handleShowMore = log => {
  // 打印一条日志的所有信息到控制台
  Notify.create({
    type: 'info',
    caption: '日志详情',
    message: '完整的日志内容已经打印到控制台'
  })
  logger.capsule(webStoragePrefix, '日志详情', 'primary')
  console.group(log.message)
  console.log('time: ', log.time)
  console.log('type: ', log.type)
  console.log(log.meta)
  console.groupEnd()
}
</script>

<style lang="scss">
.theme-#{$theme-name} {
  .log-table-list {
    width: 100%;

    .q-btn.active {
      color: $theme-color;
    }
  }
}
</style>
