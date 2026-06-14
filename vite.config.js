import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/my-shop-front/',
  plugins: [vue()],
  compilerOptions: {
    // ...
    types: ['element-plus/global'],
  },
});
