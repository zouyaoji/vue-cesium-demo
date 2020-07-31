<template>
  <q-toolbar class="no-wrap items-center relative-position q-toolbar-normal">
    <div class="menu-toggle">
      <q-btn flat @click="menuClick">
        <q-icon name="menu" />
      </q-btn>
    </div>
    <q-toolbar-title :padding="1" class="menu-link">
      <q-icon v-show="showcaseStore.icon" style="font-size: 2rem; margin-right: 5px;" :name="showcaseStore.icon" /> {{ $t(showcaseStore.title) }}
    </q-toolbar-title>

    <div class="float-right">
      <div class="row justify-center items-center q-gutter-md">
        <q-btn icon="fab fa-github" dense round size="16px" flat @click="launch"></q-btn>
        <q-icon name="language" size="32px" />
        <q-select radio color="amber" v-model="lang" :options="selectListOptions" emit-value map-options />
      </div>
    </div>
  </q-toolbar>
</template>

<script>
import showcaseStore from 'pages/showcase/showcase-store'
import { openURL } from 'quasar'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'vHeader',
  data () {
    return {
      lang: 'zh-hans',
      selectListOptions: [{
        label: '简体中文',
        value: 'zh-hans'
      },
      {
        label: 'English',
        value: 'en-us'
      }
      ],
      showcaseStore: showcaseStore.state
    }
  },
  computed: {
    ...mapGetters({
      language: 'language'
    })
  },
  mounted () {
    // this.lang = this.$q.cookies.get('language')
  },
  methods: {
    launch () {
      openURL('https://github.com/zouyaoji/vue-cesium-demo')
    },
    menuClick () {
      this.$parent.$parent.$parent.leftDrawerOpen = !this.$parent.$parent.$parent.leftDrawerOpen
    }
  },
  watch: {
    lang (lang) {
      import('quasar/lang/' + lang).then(lang => {
        this.$q.lang.set(lang.default)
      })
      this.$i18n.locale = lang
    }
  }
}
</script>

<style>
  .q-toolbar {
    height: 60px;
    overflow: visible;
  }

  .logo img {
    height: 50px;
    vertical-align: middle;
  }

</style>
