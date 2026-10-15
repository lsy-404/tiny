import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const cassie = resolve(root, 'apps/cassie');

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('git', ['submodule', 'update', '--init', '--', 'apps/cassie']);
run('pnpm', ['install', '--frozen-lockfile'], cassie);
run('pnpm', ['run', 'build', '--outDir', '../../projects/cassie', '--emptyOutDir'], cassie);
