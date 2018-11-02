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
    /* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
    String.prototype.format = function (args) {
      let result = this
      if (arguments.length > 0) {
        if (arguments.length === 1 && typeof args === 'object') {
          for (let key in args) {
            if (args[key] !== undefined) {
              let reg = new RegExp('({' + key + '})', 'g')
              result = result.replace(reg, args[key])
            }
          }
        } else {
          for (let i = 0; i < arguments.length; i++) {
            if (arguments[i] !== undefined) {
              let reg = new RegExp('({)' + i + '(})', 'g')
              result = result.replace(reg, arguments[i])
            }
          }
        }
      }
      return result
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
