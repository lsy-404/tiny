# Findings

- Worktree main was 3 behind origin/main (card editor submodule bumps 40cdca0..5272d50, pushed 2026-10-23). Production already served arknights-card 03897ff, so origin/main is the deployed base.
- build-submodules.mjs runs `git submodule update --init`, so the cassie pointer must be committed before building.
