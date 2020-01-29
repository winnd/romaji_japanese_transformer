import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Select from '@/components/select/selectedExample'
import n from '@/components/new/n'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', name: 'HelloWorld', component: HelloWorld},
    {path: '/selected', name: 'Selected', component: Select},
    {path: '/n', name: 'n', component: n}
  ]
})
