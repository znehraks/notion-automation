import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: false,
  bundle: true,
  dts: false,
  platform: 'node',
  noExternal: [
    '@notionhq/client',
    'dayjs',
    'dayjs/locale/ko',
    'dayjs/plugin/weekOfYear',
    'dayjs/plugin/isoWeek',
    'dayjs/plugin/isSameOrBefore',
    'dayjs/plugin/isSameOrAfter',
    'node-fetch',
    'dotenv',
  ],
})
