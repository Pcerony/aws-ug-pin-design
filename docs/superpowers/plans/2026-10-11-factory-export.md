# Factory Export Implementation Plan

**Goal:** User-approved separate metal/puzzle PNG sheets, each containing 1/3/6/9/12, optional dimensions.

**Architecture:** A static export page reads BadgeApprovedSpec and BadgeArtwork collections. A pure layout module places fixed-scale surfaces and annotation commands; browser rendering uses the existing approved-contour canvasFor API. Badge 12 consists of separate left/right surfaces at the approved gap. No editable workbench dimensions enter the export.

**Tech Stack:** Existing vanilla JS, Canvas 2D, Node tests, Playwright.

## Tasks

- [ ] Write failing tests for one-sheet IDs, six surfaces, common scale, exact roof gap, annotations toggled, palette isolation and immutable input.
- [ ] Implement assets/js/badge-factory-export.js with layout, rendering, PNG saving and browser controls. Reject unsupported collections, missing surfaces and failed image loads.
- [ ] Add factory-export.html and assets/css/factory-export.css with two independent download buttons, preview selection, puzzle palette, dimension checkbox, busy/error states.
- [ ] Link the exporter from homepage and dimension workbench without changing existing geometry or art.
- [ ] Verify four collections with dimensioned/clean outputs, browser downloads and desktop/mobile layout. Save dimensioned metal and orange puzzle sample PNGs locally.
- [ ] Update factory communication docs. Publish only intended files in the verified publication checkout and confirm Pages commit and live downloads.

## Approved Scope

4800 × 3200 px white-background sheets, five groups in a 3+2 arrangement; 12 shows two faces, not two badges. Width/height and nominal thickness in mm; roof total width, per-panel width and 2 mm connection region. Printed ruler and fixed scale when dimensioned; without dimensions no size annotations. Always identify collection, V0.12 and factory communication / not manufacturing approval. Raster artwork remains raster. No factory order or productionReady change.
