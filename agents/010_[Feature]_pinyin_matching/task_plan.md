# Pinyin matching for lyric completion

## Objective
Fill Chinese characters into existing pinyin lyric notes by pronunciation, supporting partial passages and explicit choice for repeated matches.

## Scope
Update LyricEditor.vue, add a focused lyric-alignment module, four-locale copy, and root tests. Preserve note timing and pitch; zero matches must not mutate lyrics.

## Validation
Test contextual and polyphonic reading, normalization, markers, empty slots, unique/repeated/no matches, then build and run focused browser checks.
