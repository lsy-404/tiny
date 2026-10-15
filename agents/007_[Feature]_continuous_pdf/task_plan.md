# Plan

- [x] Replace the single-page PDF canvas with a vertically scrolling page stack while preserving the current PDF.js document lifecycle.
- [x] Render pages within a bounded viewport margin and discard canvas backing stores outside it.
- [x] Keep page navigation, current-page tracking, fit/percentage zoom, and expose page overlay slot data in normalized page wrappers.
- [x] Add a Playwright browser regression for multi-page scroll, jump navigation, active page tracking, zoom, lazy rendering, and tight inter-page spacing.