import { cp, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const web = new URL('apps/web/', root);
const bundle = new URL('.next/standalone/apps/web/', web);
const portFlag = process.argv.indexOf('--port');
const port = portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || '3000';
if (!port || !/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  throw new Error('Supply a valid port between 1 and 65535');
}
await mkdir(new URL('.next/', bundle), { recursive: true });
await cp(new URL('.next/static/', web), new URL('.next/static/', bundle), { recursive: true });
await cp(new URL('public/', web), new URL('public/', bundle), { recursive: true });
const child = spawn(process.execPath, [fileURLToPath(new URL('server.js', bundle))], {
  stdio: 'inherit',
  env: { ...process.env, PORT: port, HOSTNAME: '0.0.0.0' },
});
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill(signal));
child.on('error', () => {
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
