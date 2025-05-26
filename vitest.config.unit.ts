import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    name: "UNIT",
    root: './',
    include: ['src/**/*.spec.ts'],
    environment: 'node',
    setupFiles: ['./test/setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
