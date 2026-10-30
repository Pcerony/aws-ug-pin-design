# 2027 Accessory Plaque Implementation Plan

**Goal:** Preserve the owner's manually corrected pixels, split three transparent assets, integrate the gallery and an adjustable extruded front plaque with an independently extended base front.

**Architecture:** Use the active publication checkout identified by AGENTS.md. Keep approved V0.12 files unchanged. Add optional draft baseFrontExtension (legacy imports default to zero). Keep accessory presentation settings separate from approved house parameters. Generate contour metadata from crop alpha, use THREE.ExtrudeGeometry for the body and matching UV-mapped front face. Positive Z is the house front; extra base area goes toward positive Z only.

**Tech Stack:** Existing buildless HTML, Three.js r128, JSCAD, Node tests; Pillow/OpenCV for explicitly requested crop and transparent silhouette extraction.

1. Add failing tests for asymmetric base bounds/volume/SVG, legacy import compatibility and accessory placement/rotation/validation.
2. Archive source without replacing it; crop three individual PNGs, extract alpha silhouettes and normalized contour metadata; visually verify all text and outer edges.
3. Implement optional base extension and its UI/export integration. Verify back edge and house slots remain fixed.
4. Implement accessory geometry and viewer mesh, load the three owner-provided textures locally, persist independent controls; avoid stale texture loads.
5. Add the three assets to the homepage without regenerating or replacing the accepted main series.
6. Run full Node regressions, desktop/mobile Playwright screenshots, canvas pixel checks, role switching, thickness/position/rotation/extension changes and reload persistence. Do not publish or change production-ready flags.

## Verification Receipt

- Completed in the publication checkout; original approved files have no diff.
- `node --test tests/*.test.cjs`: 63 passed, 0 failed.
- Playwright desktop and 390px mobile: gallery/lightbox, all three role textures, hide/show, out-of-bounds warning, adjustable width/thickness/position/three-axis rotations, orbit interaction, reset, reload persistence and JSON export/import verified.
- Desktop canvas contained 12,699 orange pixels after parameter changes; mobile 7,899, with document width exactly 390px and no horizontal overflow. Browser error console empty.
- Evidence under ignored `output/playwright/accessory-*.png` and `accessory-export.json`.
- A legacy test invoked the old site generator against the working homepage. Isolated generator output into a temporary directory for that test and restored the accepted homepage plus the new accessory section. Full rerun preserves the working homepage.
- No online publication or manufacturing approval performed.
