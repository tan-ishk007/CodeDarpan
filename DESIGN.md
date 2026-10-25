# Design system

## Direction

**Astral Cartographer:** archival cartography interpreted as a refined engineering journal. Evidence comes before ornament, with spatial exploration, careful typographic hierarchy and explicit uncertainty.

## Palette

- Parchment `#F2EBDD`: page surfaces and orientation.
- Ink `#1D1A18`: graph field, primary text and focus.
- Oxblood `#8F3030`: brand accent, selection and caution.
- Brass `#AF8C57`: routes, technical markers and focus details.
- Sage `#7C8980`: secondary structure and call relationships.
- Paper `#FAF7F0`: reading panels.
- Border `#D8CCB7`: rules and panel boundaries.
- Muted `#6E6961`: supporting copy; do not use for important content at unreadable sizes.

## Typography

- Instrument Serif for display headlines and section titles.
- DM Sans for interface controls and descriptive copy.
- IBM Plex Mono for code paths, statuses, coordinates and metrics.
- Keep body copy readable and avoid long all-caps text.

## Components and motion

- Landing: restrained header, left editorial intake, supplied technical atlas art at right, ruled capability band and linear four-step flow.
- Workspace: searchable file rail, dominant dark Cytoscape map and source/evidence rail. Below 900 px, use selectable Files/Atlas/Details panel tabs instead of squeezed columns.
- Controls use square corners, clear labels, visible focus and inline states. Keep at least 3:1 UI contrast and readable text contrast; never encode edge kind, confidence or severity by color alone.
- Graph nodes are interactive Cytoscape elements. Import direction is importer to dependency; call direction is caller to callee. Use arrow direction plus distinct solid, dashed and dotted paths; show an adjacent relationship legend.
- Only brief, purposeful 120–200 ms transitions. No autoplay, parallax or attention-seeking motion. Honor `prefers-reduced-motion`.
- Use supplied image assets only in the landing/appropriate empty states, compressed to the rendered size. Data views must not use static graph screenshots.

## Brand voice

Specific, calm and candid. Examples: “The architecture is already there. Make it visible.” “A structural estimate, not a prediction of every runtime failure.”

## Asset usage

The supplied compass/dependency glyph is paired with the serif wordmark. The technical atlas image illustrates the landing page only; the empty-atlas visual is reserved for empty states; contributor route art is retained but not used as fabricated live content. The contour overlay is low-contrast decoration behind the real graph. The optional GLB is not loaded because an interactive 3D ornament would compete with the functional graph and add payload without improving this frontend-only flow.
