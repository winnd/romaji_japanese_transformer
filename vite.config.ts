import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    // mode: 'development',
    base: './',
    server: {
        port: 3020,
        open: '/',
    },
    build: {
        rollupOptions: {
            input: resolve(__dirname, 'index.html'),
        },
    },
})
