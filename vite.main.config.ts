import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    commonjsOptions: {
      include: [/src\/main\/repositories\/prisma\/generated/, /node_modules/],
    },
  },
});
