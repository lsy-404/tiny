# Progress

- Fast-forwarded `feature/vocal-score-integration` into the clean `verify/vocal-score-tests` worktree.
- Reproduced the multi-measure mapping failure in Edge: the original implementation marked two lyric nodes out of sixteen.
- Updated `staff.js` to traverse measure then staff and use the GraphicalMeasure instrument ID; switched part-name tagging to OSMD graphical labels.
- Added a regression with eight measures, two parts, repeated pitches/lyrics and a part label equal to lyric text. Verified every lyric’s source track and source note index against the corresponding GraphicalMeasure.
- Updated MusicXML note IDs to remain unique across parts, voices, source-note duplicates, tie splits, and decomposition segments; updated jianpu ID parsing and tests.
- Focused converter/jianpu/staff Node tests passed; Edge staff and jianpu fixtures passed. Broad vocal-score test run was partially blocked by missing `vue-i18n` and `pinyin-pro` packages in this worktree.
