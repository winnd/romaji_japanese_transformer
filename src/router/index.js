import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes : [
        {path: '/', component: () => import('../page/main.vue')},
        {path: '/s', component: () => import('../components/SelectMenu.vue')},
    ],
})

export default router
