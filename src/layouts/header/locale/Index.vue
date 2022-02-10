<!--
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-05 10:59:35
 * @LastEditTime: 2022-02-09 15:13:41
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\layouts\header\locale\Index.vue
-->
<template>
  <q-btn-dropdown v-model="menu" dense color="#fff" fab-mini size="md" dropdown-icon="language" flat>
    <q-list>
      <q-item v-close-popup clickable @click="onChangeLocale('zh-CN')">
        <q-item-section>
          <q-item-label>简体中文</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-close-popup clickable @click="onChangeLocale('en-US')">
        <q-item-section>
          <q-item-label>English</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script lang="ts" setup>
import { setLocalStorage } from '@utils/web-storage'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const menu = ref(false)
const onChangeLocale = (lang: string) => {
  locale.value = lang
  setLocalStorage('locale', lang)
}
</script>
