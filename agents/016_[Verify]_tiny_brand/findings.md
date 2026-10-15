# Findings

- Existing build-output checks expected the Chinese Mini Projects brand in both game return links and the portal home. Updated those existing assertions to expect `返回 Tiny Projects` and `Tiny Projects`.
- Updated only the release-check default base URL. `RELEASE_URL` remains available for explicit overrides.
- Kept the Worker name assertion at `minigames`; added a strict single-route expectation for `tiny.leisiyu.dev` with `custom_domain: true`, which also rules out a lingering `mini.leisiyu.dev` route.
- Parent-owned portal source and Wrangler configuration were not changed in this task, so integrated output/config tests await those changes.
