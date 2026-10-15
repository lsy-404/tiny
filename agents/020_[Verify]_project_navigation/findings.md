# Findings

- The portal catalog drives `test/build-output.test.mjs`; adding CASSIE checks must account for `projects/cassie` and the shared dist copy.
- Release verification compares live resources against `dist` by SHA-256 and checks redirect routes. CASSIE assets should be discovered from its emitted HTML so hashed filenames are covered.
- The checked-out integration branch does not yet contain `projects/cassie`; runtime checks must wait for the coordinating build update.
