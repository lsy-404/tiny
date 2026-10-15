# Sidebar navigation refactor

## Objective
Move document and conversion controls into switchable sidebar sections, including analysis, lyrics, and pitch-tuning panels. Keep the score preview as the main workspace and expose an accessible collapsed rail and mobile drawer.

## Scope
`apps/vocal-score/src/App.vue`, `apps/vocal-score/src/layout.css`, `apps/vocal-score/src/i18n.js`, and `apps/vocal-score/src/ui-messages.js` only. Preserve existing control IDs and avoid PDF/layout renderer implementation files.

## Validation
Build the Vite app, run relevant root unit/browser checks, and inspect the responsive navigation behavior in browser automation if available.
