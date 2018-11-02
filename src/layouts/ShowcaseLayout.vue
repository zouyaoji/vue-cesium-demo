<template>
  <q-layout ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}" :style="{ backgroundColor: backgroundColor}">
    <q-layout-header>
      <v-header></v-header>
    </q-layout-header>
    <q-layout-drawer  v-model="leftSide" side="left">
      <v-drawer></v-drawer>
    </q-layout-drawer>
    <q-page-container>
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <router-view />
      </transition>
    </q-page-container>
    <!-- <q-layout-footer> -->
      <!-- <v-footer slot="footer"></v-footer> -->
    <!-- </q-layout-footer> -->
    <!-- <q-fixed-position corner="bottom-right" :offset="[18, 18]">
      <q-btn
        v-back-to-top
        round
        color="primary"
        icon="keyboard_arrow_up"
      />
    </q-fixed-position> -->
  </q-layout>
</template>

<script>
import vHeader from '@/components/Header'
import vDrawer from '@/components/Drawer'
import vFooter from '@/components/Footer'
// import categories from './categories'
export default {
  name: 'showcase',
  data () {
    return {
      leftSide: true,
      backgroundColor: 'whitesmoke'
    }
  },
  components: {
    vHeader,
    vDrawer,
    vFooter
  }
}
</script>

<style>

</style>
