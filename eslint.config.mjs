import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
const config = [
  ...nextVitals,
  ...nextTypescript,
  { settings: { next: { rootDir: ['apps/web/', 'apps/preview/'] } } },
  {
    ignores: [
      '**/.next/**',
      '**/out/**',
      '**/node_modules/**',
      '**/next-env.d.ts',
      '**/.turbo/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
];
export default config;
