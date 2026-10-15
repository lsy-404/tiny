# Findings

- PDF.js render task objects must remain outside Vue deep reactivity; `shallowRef` preserves their class instances and avoids invalid proxied receivers.
- Virtualization retains every page as a normal-flow placeholder while limiting resident canvas bitmaps to pages near the viewport.
- Each overlay slot receives a 1-based `pageNumber`; its width and height match the page wrapper and canvas CSS display dimensions, excluding the page gap.
- The browser regression verifies multi-page scroll/jump, current-page tracking, zoom, deferred rendering, bitmap release, and compact page gaps.