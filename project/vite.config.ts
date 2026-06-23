import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 客户端游戏，无需 SSR——Vite 即可。AI 对话(后置)需要后端时再加 serverless 函数。
export default defineConfig({
  plugins: [react()],
});
