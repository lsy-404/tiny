# Progress
- `git merge --ff-only origin/main` -> 5272d50; apps/cassie checkout 6ecf961; commit c2455c2 "Allow CASSIE announcements up to 300 seconds".
- `pnpm run build` -> "Built 6 entries and 1662 static files"; built render worker contains `t>144e5` / "exceeds the 300-second limit".
- `pnpm dlx wrangler deploy` -> uploaded 5 changed files (1656 unchanged), tiny.leisiyu.dev version 5563940f-15de-4e94-8ae2-3e8c912485cb.
- Production check: /projects/cassie/assets/render.worker-D05I-wW_.js serves the 300-second limit; ?data= 2027-char announcement renders 0:00.0 / 4:34.1 with no error.
