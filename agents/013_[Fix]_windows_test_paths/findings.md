# Findings

- Twelve root-level portal tests formed project paths with `resolve(new URL('..', import.meta.url).pathname)`. Windows URL pathnames add a leading slash before the drive, which resolves to an invalid path such as `C:\C:\...`.
- Each test now converts the file URL through Node `fileURLToPath` before resolving the repository root. Only imports and root-path expressions changed; assertions and game implementation remain intact.
- `test/vocal-score/server.js` and `storage.browser-server.mjs` also use URL `.pathname`, but only to decode HTTP request routes. Those values are URL route paths rather than filesystem paths, so they were left unchanged.
- The 12 affected scripts pass, and `pnpm test` passes end to end after `pnpm install --frozen-lockfile`. Vocal-score totals: 53 pass, 2 expected skips (optional local sample inputs and absent Playwright dependency).
