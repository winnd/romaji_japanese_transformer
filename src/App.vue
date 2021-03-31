<template>
  <div id="app">
    <img :src="logo" alt="">
    <router-view />
  </div>
</template>

<script>
import logo from './assets/logo.jpg'

export default {
  components: { logo },
  setup () {
    return {
      logo
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  img {
    width: 300px;
    height: 300px;
  }
}

</style>
