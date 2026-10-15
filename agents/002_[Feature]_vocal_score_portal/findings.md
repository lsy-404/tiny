# Findings

- The source tool is clean at commit `4f759fd`; source paths are `src/`, `public/`, `index.html`, `vite.config.js`, and `README.md`. The requested destination `apps/vocal-score` and generated destination `projects/vocal-score` do not exist.
- The tool pins Vue, Vue I18n, jsPDF, PDF.js, and pinyin-pro as runtime dependencies, and Vite plus the Vue plugin as build dependencies. The root package already pins pnpm 10.34.6.
- The standalone Vite config uses relative asset URLs, suitable for a nested static route. The generated folder will be ignored and copied into portal `dist` by the existing catalog-driven build.
- No tests were found under `test/vocal-score` during initial inspection; another task is responsible for migrating them. Root test-script behavior will be recorded after dependency installation/build validation.
- `pnpm view` showed PDF.js 6.4.299 requires Node `>=22.13.0`; Vite and its Vue plugin require `^20.19.0 || >=22.12.0`. The root minimum is set to Node 22.13.
- `pnpm run build` passed and generated the expected nested entry/assets and portal copy. Static checks confirmed the built viewer references its colocated PDF worker with `import.meta.url` and the portal cover exists.
- `pnpm run test` stops at the existing first test on Windows because `legend-runtime-assets.test.mjs` uses `execFile('npm')`, while npm is exposed here only as a command shim (`spawn npm ENOENT`). No tests or assertions were changed. The migrated `test/vocal-score/*.test.js` directory is not present in this worktree yet.
- Independently run `build-output`, `worker-config`, `cassandri-v7-compat`, and `save-import-export` tests passed. Build output validation reported three catalog entries and the static portal shell.
