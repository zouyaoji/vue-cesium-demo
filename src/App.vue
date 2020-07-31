<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted () {
    setTimeout(() => {
      document.body.removeChild(document.getElementById('StartLoading'))
    }, 200)
  }
}
</script>
