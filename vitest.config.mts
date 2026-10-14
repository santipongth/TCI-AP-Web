import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Forward slashes: Windows backslash paths do not survive alias replacement.
const dir = (p: string) => fileURLToPath(new URL(p, import.meta.url)).replace(/\\/g, '/');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: dir('./src/') },
      { find: /^@content\//, replacement: dir('./content/') },
      { find: /^@messages\//, replacement: dir('./messages/') },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
