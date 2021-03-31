import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes : [
        {path: '/', component: import('../components/HelloWorld.vue')},
        {path: '/selected', component: import('../components/select/Select.vue')},
        {path: '/n', component: import('../components/new/n.vue')},
    ],
})

export default router
