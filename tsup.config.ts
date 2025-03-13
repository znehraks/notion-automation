import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: false,
  // 외부 모듈 설정 (이 모듈들은 번들에 포함되지 않음)
  external: ['@notionhq/client'],
  // Node.js 런타임 환경에 존재하는 모듈들
  noExternal: ['dayjs'],
})
