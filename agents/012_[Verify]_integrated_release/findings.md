# Findings

- Integrated branch provides the production code and migrated browser tests. User SVP sample paths must remain external and must never be copied into the repository.
- README still used standalone npm commands and described a single 220 DPI PDF path; current workspace uses root pnpm scripts, continuous PDF preview, and direct score-text editing.
- `pnpm install --frozen-lockfile` succeeded with pnpm 10.34.6. Production Vite and portal build completed.
- `pnpm check` stopped in the pre-existing `test/loot-auto-select.test.mjs` path setup: `new URL(...).pathname` produces `/C:/...` on Windows, which `path.resolve` turns into `C:\C:\...`. The file itself exists at the correct worktree path. This task did not alter tests.
- `node --test test/vocal-score/*.test.js` passed all 56 tests with both external `F:\OneDrive\Files\SV` samples configured; neither sample was copied.
- Against the isolated production preview on port 4191, `state.browser.mjs`, `jianpu.browser.mjs`, and `storage.browser.mjs` all passed.
