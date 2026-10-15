# Findings
- The project uses Vue I18n with source-language Chinese keys and catalogs for English, Japanese, and Korean.
- The current topbar keeps the tool-specific SVP brand and uses fixed-height navigation offsets on mobile; the new link needs a wrapped mobile row with matching offsets.
- Link destination should be `/` so it returns to Tiny Projects consistently from the nested vocal-score route.
