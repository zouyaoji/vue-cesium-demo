<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 15:25:04
 * @LastEditTime: 2022-01-05 17:28:13
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\theme\ThemeList.vue
-->
<template>
  <q-table class="theme-table-list" :rows="rows" hide-header hide-pagination :columns="columns">
    <template #body="props">
      <q-tr :props="props">
        <q-td key="title">{{ props.row.title }}</q-td>
        <q-td key="preview">{{ props.row.preview }}</q-td>
        <q-td key="handler">
          <q-btn v-if="activeName === props.row.name" class="active" icon="done" rounded outline>已激活</q-btn>
          <q-btn v-else rounded outline @click="handleSelectTheme(props.row.name)">使用</q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
const $store = useStore()

const columns = ref<any>([
  {
    id: 'title',
    label: '名称',
    field: 'title',
    align: 'center'
  },
  {
    id: 'preview',
    label: '预览',
    field: 'preview',
    align: 'center'
  },
  {
    id: 'handler',
    label: '操作',
    align: 'center'
  }
])
const rows = computed(() => {
  return $store.state.system.theme.list
})
const activeName = computed(() => {
  return $store.state.system.theme.activeName
})

const handleSelectTheme = name => {
  $store.dispatch('system/theme/set', name)
}
</script>

<style lang="scss">
.theme-#{$theme-name} {
  .theme-table-list {
    width: 100%;

    .q-btn.active {
      color: $theme-color;
    }
  }
}
</style>
