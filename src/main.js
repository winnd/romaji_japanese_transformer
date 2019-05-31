// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Input, Autocomplete} from 'element-ui'

Vue.config.productionTip = false

/* eslint-disable no-new */

Vue.use(Input)
Vue.use(Autocomplete)

new Vue({
  el        : '#app',
  router,
  components: {App},
  template  : '<App/>'
})
