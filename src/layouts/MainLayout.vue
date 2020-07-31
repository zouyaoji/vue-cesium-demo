<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <v-header></v-header>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <v-drawer></v-drawer>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import vHeader from 'components/Header'
import vDrawer from 'components/Drawer'
// import vFooter from 'components/Footer'

export default {
  name: 'MainLayout',
  components: { vHeader, vDrawer },
  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>

<style>
.viewer {
  height: calc(100vh - 60px);
}
</style>
