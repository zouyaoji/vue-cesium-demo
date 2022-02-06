<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 17:20:35
 * @LastEditTime: 2022-01-04 17:22:38
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\common-panel\Index.vue
-->
<template>
  <q-card class="common-panel">
    <q-bar class="header" :class="titleClass">
      <div v-if="title !== ''" class="text-weight-bold">{{ title }}</div>
      <slot name="header-left"></slot>
      <q-space />
      <slot name="header-right"></slot>
      <q-btn v-if="showCloseBtn" v-close-popup dense flat icon="close" @click="onClose">
        <q-tooltip>{{ closeTip }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-separator v-if="separatorOpts.show" v-bind="separatorOpts" />
    <div class="content">
      <slot></slot>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
// props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  titleClass: {
    type: String,
    default: ''
  },
  closeTip: {
    type: String,
    default: '关闭'
  },
  showCloseBtn: {
    type: Boolean,
    default: true
  },
  separatorOpts: {
    type: Object,
    default: () => ({
      show: true,
      dark: true,
      color: 'white',
      size: '1px'
    })
  }
})
// state
const emit = defineEmits(['close'])

const onClose = evt => {
  emit('close', evt)
}
</script>
