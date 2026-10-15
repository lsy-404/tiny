# Progress

- Read the agent-mode skill, portal `agents/project.md`, and `agents/local.instructions.md`.
- Confirmed target branch `verify/vocal-score-tests` in the isolated portal worktree and clean source tool `main` at `4f759fd`.
- Migrated all 16 source test and fixture files into `test/vocal-score`; source unit tests now import from portal `apps/vocal-score/src`.
- The preview server serves portal-root `dist`, defaults to port 4190, and prints `/projects/vocal-score/`; browser scripts default to this URL and honor `PREVIEW_URL` overrides.
- Jianpu and browser-storage fixture runners each serve app modules from the portal source tree on an ephemeral local port and close their child server in `finally`.
- All migrated JavaScript modules passed `node --check`, and `git diff --cached --check` passed.
- The migrated unit tests are not runnable until `apps/vocal-score` is merged into this worktree. No SVP sample files were copied or committed.
