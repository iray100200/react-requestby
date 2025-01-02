import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./src/fetch/index.ts"),
      name: "react-requester",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React"
        }
      }
    },
    sourcemap: false,
    emptyOutDir: true
  },
  plugins: [react(), dts({ rollupTypes: true })]
})