<!--
 * @Author: cweibo legend2weibo@gmail.com
 * @Date: 2022-08-19 17:43:33
 * @LastEditors: zouyaoji
 * @LastEditTime: 2022-08-22 23:34:56
 * @FilePath: \vue-cesium-demo\src\components\nice-checkbox\Index.vue
-->
<template>
  <div class="nice-checkbox-container" :class="{ checked: modelValue }" @click="onClicked">
    {{ label }}
    <div v-if="modelValue" class="check-mark-background"></div>
    <div v-if="modelValue" class="check-mark">&#10003;</div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props
const props = defineProps({
  modelValue: Boolean,
  height: {
    type: String,
    default: '26px'
  },
  padding: {
    type: String,
    default: '0 23px 0 10px'
  },
  color: {
    type: String,
    default: '#fff'
  },
  border: {
    type: String,
    default: '1px solid #ffbd0b'
  },
  borderRadius: {
    type: String,
    default: '4px'
  },
  label: {
    type: String,
    default: ''
  }
})
const style = computed(() => {
  const style = {
    ...props
  }
  if (!props.modelValue) {
    style.padding = '0 10px 0 10px'
    style.border = '1px solid #b6cced'
  }
  return style
})
const emits = defineEmits({
  'update:modelValue': (e: boolean) => true
})

const onClicked = () => {
  emits('update:modelValue', !props.modelValue)
}
</script>
<style lang="scss" scoped>
.nice-checkbox-container {
  width: unset;
  cursor: pointer;
  position: relative;
  height: v-bind('style.height');
  line-height: v-bind('style.height');
  padding: v-bind('style.padding');
  // border: 1px solid #ffbd0b;
  border: v-bind('style.border');
  border-radius: v-bind('style.borderRadius');
  box-sizing: content-box;
  color: v-bind('style.color');
  display: inline-block;
  min-width: 50px;

  .check-mark-background {
    position: absolute;
    width: 0;
    height: 0;
    bottom: 0;
    right: 0;
    border-width: 0 0 20px 23px;
    border-style: solid;
    border-color: transparent transparent #ffbd0b;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .check-mark {
    position: absolute;
    width: 11px;
    height: 9px;
    line-height: 9px;
    right: 0;
    bottom: 3px;
    text-align: center;
    color: v-bind('style.color');
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
