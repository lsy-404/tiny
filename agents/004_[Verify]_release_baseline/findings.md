# Release baseline verification

## Objective

Compare the pinned portal source at `origin/main` (`3989904af1a29154b443fefd4a97a53dc1f9104e`) with the live portal, record routing behavior, and establish post-release checks without changing or deploying application assets.

## Scope

Read-only inspection of existing portal and its two catalog projects. Existing audio was probed with HEAD only; no private song data was fetched or copied. The forthcoming vocal-score app worker is not part of this pinned source baseline and requires post-build and post-deploy checks.

## Verification

See `work/minigames/reports/vocal-score-release-baseline.md` for the 21-resource SHA-256 manifest and `work/minigames/capture-vocal-release.mjs` for the reproducible fetch/hash command. All 21 portal and existing-project resources matched the pinned source bytes exactly. Existing project page requests canonicalize to trailing-slash paths and return 200. Audio paths returned 200 to HEAD without retrieving bodies. Current live responses had no Content-Security-Policy header.

The configured Cloudflare `html_handling: auto-trailing-slash` explains the canonical redirects: directory paths resolve to their trailing-slash `index.html`; direct `index.html` paths redirect to the directory route. This is suitable for relative project assets when links are resolved from the final trailing-slash URL. Wrangler also uses 404-page handling, so an absent worker can yield a 404 page and must be checked directly after deployment.

The new PDF.js module worker does not exist in the pinned baseline. Its emitted URL, response status, and JavaScript MIME type remain unverified here. After the app build, inspect the emitted `?url` worker asset and verify it returns 200 with a JavaScript MIME type. Then test PDF rendering and Blob-backed SVG conversion in a browser against the deployed app. The observed absence of a CSP header means current live responses do not impose a server-supplied worker/img policy; it does not establish behavior under browser extensions or a later CSP change.

## Commands

From the release worktree, rerun the baseline capture with:

```powershell
node 'C:\Users\User\Documents\Codex\2026-10-14\zhe\work\minigames\capture-vocal-release.mjs'
```

The script compares `origin/main` resources against current live bytes, writes the report outside the repository, and uses HEAD-only checks for audio. After release, compare the same existing-resource hashes, then add the built vocal-score entry, JS/CSS chunks, worker URL, and required data assets to a separate post-release check. Test `/projects/vocal-score/`, its direct `index.html` canonical route, and each emitted worker/data URL; confirm the expected 200 response and content type.

## Limits

This is a deployment baseline, not validation of the unmerged vocal-score build or PDF.js runtime. No deployment or source mutation was performed.
