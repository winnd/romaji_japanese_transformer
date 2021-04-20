<template>
  <div id="app">
    <img class="logo" :src="logo" alt="">
    <router-view/>
    <img class="refer1" :src="refer" alt="">
  </div>
</template>

<script>
import logo from './assets/logo.jpg'
import refer from './assets/refer1.png'

export default {
  components: { logo, refer },
  setup () {
    return {
      logo,
      refer,
    }
  },
}
</script>

<style lang="scss">
@import "./css/default.css";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;

  img {
    &.logo {
      width: 100px;
      height: 100px;
      margin-bottom: 20px;
    }

    &.refer1 {
      margin-top: 20px;
      border-top: 1px solid #ddd;
    }
  }
}

</style>
