import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    name: "INTEGRATION",
    root: './',
    include: ['src/**/*.e2e-spec.ts'],
    environment: 'node',
    setupFiles: ['./test/setup.ts']
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
