# Findings and Constraints

- The portal source does not yet include `apps/vocal-score`; the implementation agent will add it separately. Migrated source tests cannot run until that source lands.
- The source tool accepts optional samples through `SVP_SAMPLE_FILES`; verification reads them in place and does not copy them.
- Portal deployment root is `dist`; the preview server must serve the build at `/projects/vocal-score/`.
