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
      <q-icon name="language" size="32px" />
    </div>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <q-select stack-label="国际化" radio color="amber" v-model="lang" :options="selectListOptions" />
  </q-toolbar>
</template>

<script>
import showcaseStore from '@/pages/showcase/showcase-store'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'vHeader',
  data () {
    return {
      lang: '',
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
    this.lang = this.$q.cookies.get('language')
  },
  methods: {
    menuClick () {
      this.$parent.$parent.$parent.leftSide = !this.$parent.$parent.$parent.leftSide
    }
  },
  watch: {
    lang (lang) {
      import(`quasar-framework/i18n/${lang}`).then(lang => {
        this.$q.i18n.set(lang.default)
      })
      this.$i18n.locale = lang
      this.$q.cookies.set('language', lang)
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
