<template>
  <q-toolbar>
    <q-toolbar-title>
      Layout Footer
    </q-toolbar-title>
    <div class="gt-sm">Copyright &copy; {{getYear}} SuperMap All Rights Reserved</div>
  </q-toolbar>
</template>

<script>
export default {
  name: 'vFooter',
  computed: {
    getYear () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style>

</style>
