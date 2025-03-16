import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: false,
  // 모든 의존성을 번들에 포함
  noExternal: [],
  // 또는 필요한 것만 번들에 포함
  // noExternal: ['@notionhq/client', 'dayjs', 'dotenv', 'node-fetch'],
})
