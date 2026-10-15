# Staff page layout repair

- [x] Inspect existing SVG/PDF geometry and OSMD rendering entry point.
- [x] Verify OSMD source-to-graphical note/lyric relationships from maintained API docs.
- [x] Replace synthetic SVG page dimensions with actual viewBox or explicit dimensions.
- [x] Extract staff rendering into a reusable module and tag exact lyric text targets.
- [x] Tag numbered-score lyrics and part names with the same source identity.
- [x] Add browser regression checks for SVG bounds, renderer options, and text target identity.
- [x] Run focused Node tests and browser fixtures; real target visual QA remains unavailable in this checkout. Commit.
