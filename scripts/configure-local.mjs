import { randomBytes } from 'node:crypto';
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const localFile = new URL('.env', root);
async function exists(url) {
  try {
    await access(url, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
if (!(await exists(localFile))) {
  const example = await readFile(new URL('.env.example', root), 'utf8');
  await writeFile(
    localFile,
    example.replace(/^AUTH_SECRET=$/m, `AUTH_SECRET=${randomBytes(48).toString('base64url')}`),
    { flag: 'wx', mode: 0o600 },
  );
  console.log('Created local development configuration with a random session secret.');
}
const webFile = new URL('apps/web/.env.local', root);
if (!(await exists(webFile)))
  await writeFile(webFile, await readFile(localFile), { flag: 'wx', mode: 0o600 });
console.log(
  `Local configuration preserved in ${fileURLToPath(root)}. Never use this local configuration in a public deployment.`,
);
