<template>
  <q-scroll-area style="width: 100%; height: 100%;" :delay="1500" :thumb-style="{
    right: '2px',
    borderRadius: '5px',
    background: scrollAreaBackground,
    width: '5px',
    opacity: 0.8
  }">
  <!-- logo -->
  <div class="row flex-center bg-white" style="width: 100%; height: 100px;">
    <img src="~assets/imgs/SuperMapLogo.png" class="responsive"/>
    <div style="margin-left: 15px">
      SmCesium v{{ SmCesiumVersion }}
      <a @click="launch">
        <q-icon name="fa-github" size="24px"></q-icon>
      </a>
    </div>
  </div>
  <q-list no-border link inset-separator highlight>
    <q-list-header>Essential Links</q-list-header>
    <q-side-link
      item
      to="/showcase"
      exact
      replace
    >
      <q-item-side icon="home" />
      <q-item-main>{{ $t('categories.showcase') }} </q-item-main>
      <q-item-side right icon="chevron_right" />
    </q-side-link>
    <q-item-separator />
    <template v-for="(category, index) in categories">
      <q-list-header :key="index" :icon="category.icon">
        {{ $t(category.title) }}
      </q-list-header>
      <q-side-link ref="link"
        item
        v-for="(feature, subIndex) in category.features"
        :key="index+'-'+subIndex"
        :to="`/showcase/${category.path}/${feature.path}`"
        replace
      >
        <q-item-side :icon="feature.icon" />
        <q-item-main v-model="test" :label=" $t(feature.title)" />
        <q-item-side right icon="chevron_right" />
      </q-side-link>
      <q-item-separator :key="index+'-'+ 'q'" />
    </template>
  </q-list>
  </q-scroll-area>
</template>

<script>
import SmCesium from 'vue-sm-cesium'
import categories from '@/showcase/categories'
import { openURL } from 'quasar'
export default {
  name: 'drawer',
  data () {
    return {
      SmCesiumVersion: SmCesium.version,
      scrollAreaBackground: '#4e8ca8',
      test: '',
      categories: categories
    }
  },
  mounted () {
  },

  methods: {
    launch () {
      openURL('https://github.com/zouyaoji/vue-quasar-supermapwebgl')
    }
  }
}
</script>

<style>

</style>
