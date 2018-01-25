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
    <q-select radio color="amber" v-model="select" :options="selectListOptions" @change=selectChange />
  </q-toolbar>
</template>

<script>
  import showcaseStore from '@/showcase/showcase-store'
  import {
    mapGetters
  } from 'vuex'
  
  export default {
    name: 'vHeader',
    data () {
      return {
        select: this.$i18n.locale,
        selectListOptions: [{
          label: '简体中文',
          value: 'zh'
        },
        {
          label: 'English',
          value: 'en'
        }
        ],
        showcaseStore: showcaseStore.state
      }
    },
    computed: {
      ...mapGetters({
        language: 'getLanguage'
      })
    },
    methods: {
      menuClick () {
        this.$parent.toggleLeft()
      },
      selectChange (value) {
        this.toggleLanguage(value)
      },
      toggleLanguage (lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
      }
    },
    watch: {
      language: function (oldVal, newVal) {
        console.log(this.$router.options.routes[1].children)
      }
    }
  }
</script>

<style>
  .q-toolbar {
    overflow: visible;
  }

  .logo img {
    height: 50px;
    vertical-align: middle;
  }

</style>
