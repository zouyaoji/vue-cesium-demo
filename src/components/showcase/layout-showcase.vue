<template>
  <q-layout ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}" :style="{ backgroundColor: backgroundColor}">
    <v-header slot="header"></v-header>
    <v-drawer slot="left" class="drawer1"></v-drawer>
    <q-transition enter="fadeIn" leave="fadeOut" mode="out-in" :duration="300">
      <router-view />
    </q-transition>
    <q-ajax-bar ref="bar" color="red" size="5px" :delay="0" />
    <!-- <v-footer slot="footer"></v-footer> -->
    <q-fixed-position corner="bottom-right" :offset="[18, 18]">
      <q-btn
        v-back-to-top
        round
        color="primary"
        icon="keyboard_arrow_up"
      />
    </q-fixed-position>
  </q-layout>
</template>

<script>
import vHeader from '@/common/header/header'
import vDrawer from '@/common/drawer/drawer'
import vFooter from '@/common/footer/footer'
// import categories from './categories'
export default {
  name: 'showcase',
  data () {
    return {
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

