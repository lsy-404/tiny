import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
// Projects with a build step; the static games are copied straight from their submodules by build.mjs.
const apps = [
  { dir: 'apps/cassie', outDir: '../../projects/cassie' },
  { dir: 'apps/vocal-score', outDir: '../../projects/vocal-score' }
];

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('git', ['submodule', 'update', '--init']);
for (const { dir, outDir } of apps) {
  const cwd = resolve(root, dir);
  run('pnpm', ['install', '--frozen-lockfile'], cwd);
  run('pnpm', ['run', 'build', '--outDir', outDir, '--emptyOutDir'], cwd);
}
