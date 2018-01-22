<template>
  <q-toolbar class="no-wrap items-center relative-position q-toolbar-normal">
    <div class="menu-toggle">
          <q-btn flat @click="menuClick">
            <q-icon name="menu" />
          </q-btn>
        </div>
        <!-- <div class="logo">
          <img src="~assets/imgs/supermap.png" class="responsive">
        </div> -->
        <q-toolbar-title :padding="1" class="menu-link">
          Vue Test
        </q-toolbar-title>
         <div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span @click="toggleLanguage('zh')">中文</span>
          &nbsp;/&nbsp;
          <span @click="toggleLanguage('en')">EN</span>
         </div>
  </q-toolbar>
</template>

<script>
export default {
  name: 'vHeader',
  computed: {

  },
  methods: {
    menuClick () {
      this.$parent.toggleLeft()
    },
    toggleLanguage (lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
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
