# Windows test path resolution

- [x] Merge the current integration branch into this verification worktree.
- [x] Identify existing portal tests that use URL pathname values as filesystem paths.
- [x] Replace path conversion with `fileURLToPath` without changing test assertions or game source.
- [x] Run affected tests and the full repository test script.
- [x] Commit the isolated test-path repair.