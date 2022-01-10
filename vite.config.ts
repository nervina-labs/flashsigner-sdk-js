/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `flashsigner.${format}.js`,
      name: 'Flashsigner',
    },
    rollupOptions: {
      external: ['@nervosnetwork/ckb-sdk-utils'],
    },
  },
})
