# Plan

- Replace the single-page PDF canvas with a vertically scrolling page stack while preserving the current PDF.js document lifecycle.
- Render pages within a bounded viewport margin and discard canvas backing stores outside it.
- Keep page navigation, current-page tracking, fit/percentage zoom, and expose page overlay slot data in normalized page wrappers.
- Add a Playwright browser regression for multi-page scroll, jump navigation, active page tracking, zoom, lazy rendering, and tight inter-page spacing.