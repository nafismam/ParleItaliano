import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: new URL('../..', import.meta.url).pathname,
  transpilePackages: ['@parle/contracts', '@parle/database', '@parle/platform', '@parle/ui'],
  poweredByHeader: false,
};
export default config;
