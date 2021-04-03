import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes : [
        {path: '/', component: () => import('../components/HelloWorld.vue')},
    ],
})

export default router
