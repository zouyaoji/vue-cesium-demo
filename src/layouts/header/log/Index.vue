<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:01:39
 * @LastEditTime: 2022-05-31 14:51:14
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\log\Index.vue
-->
<template>
  <q-btn icon="adjust" size="md" flat round @click="handleClick">
    <q-tooltip> {{ tooltipContent }} </q-tooltip>
  </q-btn>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 1440px; max-width: 960px">
      <q-card-section class="row items-center q-pb-none q-pt-xs card-header">
        <div class="text-h6">日志列表</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense>
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section class="theme-card">
        <log-table></log-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import LogTable from './LogTable.vue'
import { store } from '@src/store'

const dialogVisible = ref(false)

const logLength = computed(() => {
  return store.system.useLogStore().length
})
const logLengthError = computed(() => {
  return store.system.useLogStore().lengthError
})

const tooltipContent = computed(() => {
  return logLength.value === 0
    ? '没有日志或异常'
    : `${logLength.value} 条日志${logLengthError.value > 0 ? ` | 包含 ${logLengthError.value} 个异常` : ''}`
})

const handleClick = () => {
  // log.debug('Todo: 显示日志列表。')
  dialogVisible.value = true
}
</script>
