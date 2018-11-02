<template>
  <q-scroll-area style="width: 100%; height: 100%;" :delay="1500" :thumb-style="{
    right: '2px',
    borderRadius: '5px',
    background: scrollAreaBackground,
    width: '5px',
    opacity: 0.8
  }">
  <div class="row flex-center bg-white" style="width: 100%; height: 100px;">
    <img alt="Vue Cesium logo" src="https://zouyaoji.top/vue-cesium/favicon.png" style="height: 100px">
    <div class="caption q-ml-md">Vue Cesium {{VueCesiumVersion}}</div>
    <q-btn icon="fab fa-github" dense round size="16px" flat @click="launch"></q-btn>
  </div>
  <q-list no-border link inset-separator highlight>
    <!-- <q-list-header>Essential Links</q-list-header> -->
    <q-item to="/showcase" exact replace>
      <q-item-side icon="home"/>
      <q-item-main>{{ $t('categories.showcase') }} </q-item-main>
      <q-item-side right icon="chevron_right" />
    </q-item>

    <q-item-separator />
    <template v-for="(category, index) in categories">
      <q-list-header :key="index" :icon="category.icon">
        {{ $t(category.title) }}
      </q-list-header>
      <q-item :to="`/showcase/${category.path}/${feature.path}`" exact replace :key="index+'-'+subIndex" v-for="(feature, subIndex) in category.features">
        <q-item-side :icon="feature.icon" />
        <q-item-main :label=" $t(feature.title)" />
        <q-item-side right icon="chevron_right" />
      </q-item>
      <q-item-separator :key="index+'-'+ 'q'" />
    </template>
  </q-list>
  </q-scroll-area>
</template>

<script>
import VueCesium from 'vue-cesium'
import categories from '@/pages/showcase/categories'
import { openURL } from 'quasar'
export default {
  name: 'drawer',
  data () {
    return {
      VueCesiumVersion: VueCesium.version,
      scrollAreaBackground: '#4e8ca8',
      categories: categories
    }
  },
  mounted () {
  },
  methods: {
    launch () {
      openURL('https://github.com/zouyaoji/vue-cesium')
    }
  }
}
</script>

<style>
.caption {
  color: #424242;
  letter-spacing: 0;
  line-height: 24px;
  padding: 0;
  font-weight: 300;
}
</style>
