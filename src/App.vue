<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app" class="my-demo">
     <q-transition enter="fadeIn" leave="fadeOut" mode="out-in" :duration="300" @leave="resetScroll">
      <router-view />
    </q-transition>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {
  name: 'q-app',
  methods: {
    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    }
  }
}
</script>

<style>
.content {
    background-color: #f9f9f9;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

</style>
