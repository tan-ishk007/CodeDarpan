# CodeDarpan — Visual Asset Bible & Frontend Master Prompt (v2)

**Product:** CodeDarpan  
**Tagline:** Understand the code behind the code.  
**Brief:** Interactive codebase architecture and AST explorer.  
**Art direction:** The Astral Cartographer — archival cartography, editorial typography, precise software dependency mapping.  
**Goal:** A distinctive, jury-ready frontend with an actual interactive graph, not a beautiful static mockup.

---

## 0. Honest audit of the current `CodeDarpan-deliverables.zip`

The uploaded package already contains many assets. Do not regenerate everything blindly.

| Existing file | Audit | Recommended action |
|---|---|---|
| `A01-brand-glyph-ink.svg` | Valid SVG, usable ink-color glyph | Keep as the primary light-surface mark, but review at 16, 24 and 32 px. |
| `A01-brand-glyph-inverse.svg` | Valid SVG for dark surfaces | Keep. |
| `A01-brand-glyph-mono.svg` | Valid currentColor variant | Keep for reusable UI contexts. |
| `A02-hero-atlas-4k-upscaled.png` | Attractive but reads more like a fantasy/topographic archipelago than a software dependency atlas; 13.9 MB | Usable as a temporary landing image. For a distinctive technical story, regenerate using A02-V2 below. Convert to AVIF/WebP and downsize to the actual rendered dimensions. |
| `A03-seamless-parchment-4k-upscaled.png` | The texture is usable but 15.4 MB at 3840×3840 is excessive for a subtle background | Keep the visual. Downsize to 1024–2048 square and export WebP/AVIF at moderate quality. A subtle CSS color is often enough; avoid tiling a large texture on every panel. |
| `A04-contour-overlay.svg` | Valid, very small and scalable | Keep. Use at low opacity and only in a few places. Do not cover the graph or code with dense lines. |
| `A05-empty-state-4k-upscaled.png` | Good illustration quality, but a literal rolled parchment map does not specifically say “no repository analyzed”; 8.9 MB | Optional replacement with A05-V2. If retaining it, resize and compress with transparency preserved. |
| `A06-onboarding-route-4k-upscaled.png` | The route concept is relevant, but the edges/background show distracting colored fragments and visual noise; 3.0 MB | Regenerate with A06-V2. A clean SVG route is even better if the route itself must change with data. |
| `A07-social-preview.svg` | Valid SVG with the correct title/tagline and a coherent palette | Keep; check the small-size preview and metadata. It is not essential to the workspace. |
| `A08-progress-seal.svg` | Valid small decorative SVG | Keep for a restrained loading-state accent, but let the actual progress indicator report real analysis stages. |
| `G01-atlas-orrery-4k-upscaled.glb` | Actual GLB, about 3.9 MB; its glTF JSON has one mesh and no embedded material or texture | Optional only. Render-test it. It may appear as a single neutral-colored mesh unless the viewer applies a material. Do not let this delay the real graph. |
| ` .png` | The filename contains a leading space and is not descriptive; image appears to be the Orrery reference render | Rename to `atlas-orrery-reference.png` if you retain it. |

### Three critical corrections

1. **A 3840 px export is not necessarily native 4K detail.** The package README says the raster files were enlarged from smaller generation sources. Do not assume they need to render at 4K in the app.
2. **The data UI must be real.** The dependency graph, heatmap, progress, counts, risk findings and onboarding sequence must be rendered from application data. Never use generated screenshots or generated charts in place of these features.
3. **Do not fill the workspace with illustrations.** The product’s most impressive visuals should be the live graph, source explorer, evidence-backed risk views and clear interactions. Generated artwork is for the landing page, small empty/error states and promotional material.

---

## 1. Locked design system

### Palette

- Parchment: `#F2EBDD`
- Ink: `#1D1A18`
- Oxblood: `#8F3030`
- Brass: `#AF8C57`
- Sage: `#7C8980`
- Paper surface: `#FAF7F0`
- Paper edge/border: `#D8CCB7`
- Muted text: `#6E6961`

### Typography

- Display / landing headline: Instrument Serif or Cormorant Garamond.
- UI / body / controls: DM Sans or Inter.
- Code / paths / metrics / coordinates: IBM Plex Mono or JetBrains Mono.
- Keep the serif out of dense data labels and code.

### Style rules

Premium editorial cartography, archival field notes, fine contour lines, small coordinate ticks, brass route markings, clear architectural groupings, a restrained amount of paper grain and a dark ink graph canvas. The light landing surface and dark graph surface should feel like two parts of the same product.

**Never:** neon, purple gradients, cyberpunk, glow, glassmorphism, fake terminal screenshots, generic AI brain/robot, stock-photo developers, giant meaningless 3D objects, excessive rounded cards, gold-on-gold low contrast, busy paper texture behind code, or constant decorative motion.

### Shared negative prompt for image generation

> No readable text, no random letters or numbers, no logos unless explicitly requested, no watermark, no fake UI dashboard, no fake code screenshot, no neon, no purple, no cyberpunk, no bloom, no lens flare, no glassmorphism, no glowing edges, no floating particles, no excessive distressed paper, no steampunk clutter, no stock-photo people. Restrained editorial cartography; palette limited to parchment #F2EBDD, ink #1D1A18, oxblood #8F3030, brass #AF8C57 and sage #7C8980.

---

# PART A — IMAGE PROMPTS

Use image generation only for the assets listed here. Avoid making one image for every panel or every data visualization.

## A01-V2 — Standalone wordmark lockup (only if a separate wordmark asset is needed)

**Format:** SVG/vector. **Priority:** Medium. The existing glyph files can remain.

**Prompt for a coding/design agent that can output SVG:**

> Create a production-ready standalone SVG wordmark lockup for CodeDarpan. Reuse the existing compass-and-dependency glyph from `A01-brand-glyph-ink.svg`; do not invent a disconnected new logo. Place the glyph to the left of the exact word `CodeDarpan` in a refined editorial serif, with a restrained brass divider/route detail. Create a separate optional tagline lockup reading exactly `Understand the code behind the code.` Use a true SVG viewBox, clean paths where practical, no embedded raster images, no filters, no shadows and no unnecessary background. Provide ink-on-parchment and parchment-on-ink variants. Keep the primary wordmark legible at 180 px wide and the compact glyph alone legible at 16–24 px. The app navigation should preferably render the wordmark as real text in the selected font with the SVG glyph next to it, rather than converting all text to paths.

**Do not ask an image model to spell the brand name.** Render the exact wordmark as HTML/SVG text in the app for dependable typography.

## A02-V2 — Technical Atlas hero (replacement for the current fantasy-map-feeling image)

**Use:** Landing-page hero only. **Priority:** High. **Output:** 16:9 landscape, no text.

**Image prompt:**

> Create a premium editorial hero illustration for CodeDarpan, a serious software architecture and AST exploration product. The visual metaphor is a cartographer mapping a living software repository, not an imaginary fantasy island. Show an elegant dark ink atlas field with a clear, legible constellation of file/module nodes, precise thin directed dependency routes, a few nested architectural clusters, small brass anchor points and fine parchment contour traces. Across part of the composition, the graph transitions into layered parchment strata like the cross-section of a survey map. A small number of oxblood routes indicate a tightly coupled or cyclical area; muted sage groups indicate stable modules. The geometry should feel systematic and technically meaningful: distinct nodes, directionally readable paths, measured spacing, not random decorative lines. Add tiny coordinate ticks only near the edges. Beautiful refined materials, restrained contrast, very fine cartographic engraving, sophisticated editorial art direction, not a fantasy RPG map and not a literal circuit-board illustration. Composition is weighted to the right two-thirds with generous negative space on the left for headline text. Background colors limited to #F2EBDD and #1D1A18, routes in #AF8C57 and #7C8980, restrained #8F3030 accents. No readable labels, no words, no letters, no numbers, no screenshot of a UI, no buildings, no floating islands, no ocean, no glowing particles. Wide 16:9 composition, crisp at a 900 px display width, visually quiet enough not to compete with the headline.

**Quality check:** It must read as software architecture in the first second. If it reads mainly as a fantasy map, regenerate.

## A03 — Parchment texture

**Action:** Use the existing texture unless it has visible seams. Do not regenerate by default.

**If regeneration is necessary:**

> Generate a perfectly seamless, tileable, square archival paper grain texture for a premium technical atlas. Very light warm parchment near #F2EBDD, fine cotton fibers, extremely low-contrast tonal variation, evenly lit, no directional shadow. No stains, folds, torn edges, handwriting, printed lines, vignette or objects. It must tile invisibly on all four edges and remain nearly imperceptible behind interface copy. 2048×2048, no text, no watermark.

**Export note:** Downsize the current `A03-seamless-parchment-4k-upscaled.png` to 1024–2048 square and WebP/AVIF. A flat CSS color is the default; the texture is optional.

## A04 — Contour overlay

**Current asset:** `A04-contour-overlay.svg` is already adequate.

**Prompt for a coding agent if more variety is needed:**

> Create a small set of lightweight, hand-authored inline SVG topographic patterns for CodeDarpan: `contours-sparse.svg`, `contours-corner.svg`, and `coordinate-ticks.svg`. Use smooth nested contour paths, carefully spaced coordinate marks and stroke widths that remain crisp at different scales. Colors must use currentColor or #7C8980/#AF8C57 with low opacity. The SVGs must have no raster images, filters, text, unnecessary fills or dense intersections. Make the shapes tileable where practical. Provide a low-opacity dark-canvas variant. Do not generate a full map; these are quiet interface decorations.

## A05-V2 — Empty atlas / no repository analyzed

**Use:** Intake/empty workspace state. **Priority:** Medium. **Output:** Transparent PNG/WebP, 4:3, about 1200×900 final dimensions.

**Image prompt:**

> Create a refined, minimal editorial illustration for the empty state of CodeDarpan, an interactive software architecture atlas. Show a small cluster of a few separated file-like geometric nodes and two or three unfinished thin brass route segments fading into a wide field of clean parchment space. A tiny compass marker suggests the atlas is ready to begin. The graphic should visually communicate “the repository has not been analyzed yet,” not “an ancient map lying on a table.” Use crisp engraved linework and a carefully controlled silhouette. Palette #F2EBDD, #1D1A18, #AF8C57 and #7C8980; a tiny oxblood detail is acceptable. Transparent background with no background rectangle. The image should feel elegant and intelligent at 360 px wide, with large negative space for a UI message to be placed separately. No text, no labels, no rolled scroll, no buildings, no people, no UI panel, no shadows that create a large dark halo, no glow, no neon, no watermark.

## A06-V2 — Contributor route illustration

**Use:** Optional landing capability card or Onboard introduction. Do not use it as the real route visualization. **Priority:** Medium. **Output:** Transparent wide 3:2 PNG/WebP or hand-authored SVG.

**Image prompt:**

> Create a clean transparent editorial route illustration for CodeDarpan's contributor onboarding feature. One readable continuous brass path travels through four distinct small circular waypoints, with subtle thin contour curves underneath and a minimal file/folder glyph at the destination. One short oxblood segment identifies a point of attention, while a sage secondary route remains subdued. The route must look intentional and technically precise, with no random glowing pixels, chromatic fringe, colorful edge noise or heavy outline. Flat engraving-inspired vector style, minimal detail, consistent stroke widths, transparent background, palette #1D1A18, #AF8C57, #7C8980 and #8F3030. No text, no UI, no fake file names, no detached particles, no gradients, no glow, no neon, no watermark. Plenty of negative space. It must remain clean when displayed at 300×180 px.

**Important:** This illustration is decorative. The actual Onboard screen must draw its route from the backend's ordered file path.

## A07 — Social preview / repository README cover

**Existing asset:** `A07-social-preview.svg` is already valid; keep it unless you want a new composition.

**Prompt for editing or recreation:**

> Make a 1200×630 SVG social-preview cover for CodeDarpan. Left portion: parchment background with the supplied compass dependency glyph and exact wordmark `CodeDarpan`, followed by the exact tagline `Understand the code behind the code.` Right portion: ink-black canvas with a precise abstract dependency graph, thin sage contour paths, restrained brass relationships and one small oxblood cycle. This is a branded promotional graphic, not a screenshot of the product. Use real SVG text for exact wording, accessible contrast and clean vector geometry. Keep essential content away from the outer 5% edges. No fake metrics, no fake dashboard labels, no neon, no purple, no glow, no watermark.

## A08 — Progress seal

**Existing asset:** `A08-progress-seal.svg` is already suitable.

**Use:** Small decoration next to real progress text. Do not turn it into a full-screen loading animation. A real stage label and a determinate progress value are preferable when the backend provides them.

## A09 — Four feature vignettes (optional landing-page assets)

**Priority:** Low to medium. Use only if the landing page has four distinct capability items; do not place these in the dense analysis workspace. Keep the four images in one consistent visual language. Generate separately if the tool cannot produce four clean, independent illustrations.

### A09.1 Explore — dependency atlas

> Minimal transparent editorial vector illustration of a small but structured software dependency graph: 9–12 clearly separated dark-ink nodes grouped into three architectural clusters, with a few thin brass directed routes and one selected node outlined in oxblood. A faint partial contour arc sits behind it. Strong visual hierarchy and precise geometry, flat ink lines, no text, no letters, no numbers, no card, no UI frame, no glow. Palette CodeDarpan: #1D1A18, #AF8C57, #7C8980, #8F3030. Transparent background, landscape 4:3, readable at 240×180 px.

### A09.2 Diagnose — structural risk

> Minimal transparent editorial vector illustration for software architecture diagnosis: a small cluster of precise module nodes, one tightly connected hotspot outlined in muted oxblood, and two thin brass measurement ticks suggesting evidence. The structure should read as a graph cluster with one high-coupling area, not as a warning symbol. Use restrained ink, oxblood, brass and sage; no fire, no hazard triangles, no glow, no labels, no fake metric values, no UI frame. Transparent background, landscape 4:3, crisp at 240×180 px.

### A09.3 Plan — change impact

> Minimal transparent editorial vector illustration showing one selected code module and a clean directed route spreading to a small set of downstream dependent nodes. Use a clearly separated direct-impact ring and a lighter transitive route, with a restrained brass main path and sage secondary relationships. Oxblood only for a small uncertainty marker. Precise cartographic strokes, no text, no numbers, no fake charts, no glowing particles, no UI frame. Transparent background, landscape 4:3, readable at 240×180 px.

### A09.4 Onboard — newcomer path

> Minimal transparent editorial vector illustration of a guided path through four architectural modules, with a brass line linking the route in clear order and a small file glyph at the endpoint. The path should be simple enough to understand instantly, calm and precise rather than playful. A faint contour line may sit behind the nodes. CodeDarpan palette only; no labels, no people, no map-scroll, no glow, no UI panel, no watermark. Transparent background, landscape 4:3, readable at 240×180 px.

**Do not put all four images in the same file unless you can crop each one cleanly.** At a deadline, use lucide/SVG icons instead; bespoke vignettes are not core functionality.

## A10 — Failed analysis state illustration (optional)

**Priority:** Low. A small icon is usually enough in a serious developer tool.

**Image prompt:**

> Create a minimal transparent editorial illustration for a failed repository analysis state in CodeDarpan. Show a small interrupted brass route ending at a clear, simple ink node, with one restrained oxblood break mark. The visual should communicate that analysis stopped and needs attention without suggesting data loss or catastrophe. Clean vector-like engraving, very few strokes, generous whitespace, palette #1D1A18, #AF8C57 and #8F3030. No text, no warning triangle, no explosion, no broken computer, no red glow, no UI card, no watermark. Transparent background, square composition, readable at 96×96 px.

---

# PART B — GLB REFERENCE IMAGE PROMPTS

**Strong recommendation:** make at most one 3D model for the first version. Use G01 only if the frontend already works. All models are optional and must be lazy-loaded. Do not render them inside the graph canvas.

## G01-V2 — Atlas Orrery (preferred single GLB)

**Use:** Small optional hero object, not the primary hero and not the workspace graph.

**Reference-image prompt for an image-to-3D tool:**

> Generate one high-quality 3D product-reference image of a modern “Atlas Orrery,” an instrument representing software dependencies. The object is a compact, centered sculptural form with three thin, clearly separated elliptical rings intersecting around one matte deep-ink central sphere. The rings are satin aged brass, with just a few tiny node-like brass markers and two restrained oxblood markers. Add a single subtle parchment-colored curved band inside one ring, resembling a measured survey route. The design must be elegant, contemporary and geometrically plausible, not steampunk, not a toy, not a fantasy artifact. Keep the rings, central sphere and small markers visually distinguishable so a 3D reconstruction can infer depth and parts. No platform, no pedestal, no floor, no extra props. Show the whole object from a front three-quarter view, slightly above eye level, with generous margins and no cropping. Isolated against seamless neutral light gray, soft evenly distributed studio lighting. Matte ink surface, satin brass rings, restrained sage detail. No text, no letters, no numbers, no logo, no UI, no glow, no neon, no purple, no watermark. Clear silhouette, moderate geometric complexity, optimize for a real-time web GLB.

**Conversion notes:** The current GLB has no embedded materials/textures according to its glTF JSON. If your generator again produces one untextured mesh, either apply one material in Three.js or skip the model. Do not assume the original image's colors survive conversion.

## G02 — Topological Data Island (alternative, not in addition to G01)

> Create a single compact architectural maquette representing a software dependency landscape. One physically continuous layered terrain form with thin parchment-colored strata; small dark-ink paths connect several brass nodes; one short oxblood route marks a circular dependency; muted sage layers indicate stable modules. Abstract and geometrically clean, like a museum model of topographic data, not a fantasy island or videogame environment. No buildings, trees, water, separate floating particles, labels, text, logos or platform. Show the complete object from a front three-quarter view slightly above, centered with generous margin, no cropping. Distinct material boundaries and an outer silhouette that will survive conversion to a low-complexity GLB. Neutral light-gray seamless background, diffuse studio light. No neon, no purple, no glow, no watermark.

## G03 — Cartographer's Compass (not recommended unless the logo needs a physical model)

> Create one contemporary precision compass instrument as a single compact 3D object. Shallow circular deep-ink body, four-point brass compass rose inset at the center, a very thin oxblood north marker, restrained fine circular engravings and a tiny sage secondary detail. Premium modern industrial design with archival-cartography character, not an antique prop. Whole object visible from a front three-quarter view, slightly above, centered and not cropped. No hands, no background map, no tabletop objects, no text, no letters, no numbers, no logo, no gears, no glow, no neon, no purple, no watermark. Seamless neutral gray studio background and soft even lighting. Geometry suitable for a lightweight GLB.

## GLB production checklist

- One object per reference image, no collages or multi-view contact sheets unless the 3D tool explicitly requests them.
- Full silhouette visible with margin; avoid cropping.
- Prefer distinct rings/parts and medium geometric complexity.
- Use PBR materials where the tool supports them. If not, apply materials in the viewer or omit the GLB.
- Aim for a compressed model under roughly 2–3 MB if practical; 3.9 MB is not automatically unacceptable but must be justified.
- Lazy-load, provide an SVG/CSS fallback and handle WebGL failure.
- Test the model on the actual target laptop and at a mobile viewport.

---

# PART C — GRAPHICS THAT SHOULD BE BUILT IN CODE, NOT GENERATED AS IMAGES

These are just as important as the image prompts. Use the following prompts with your coding agent; the output should be SVG/CSS/React, not raster art.

## C01 — Atlas canvas background (CSS/SVG)

> Implement a lightweight decorative background for the Cytoscape graph canvas using CSS gradients and/or one tiny inline SVG. Deep ink #1D1A18 base, a very low-opacity grid, sparse coordinate ticks near the perimeter and a few subtle topographic contour paths that stay behind the real graph. The graph must remain the highest-contrast layer. Provide light/dark contrast checks, disable decoration on reduced-performance devices if needed, and never let the background intercept pointer events. No image download required, no canvas animation, no glow, no large texture image, no heavy SVG filters.

## C02 — Semantic graph node icon family

> Create a consistent inline-SVG icon family for CodeDarpan graph/tree entities: file, folder/module, function, class, external package and unresolved symbol. Use a shared 24×24 viewBox, consistent 1.6–1.8 stroke widths, `currentColor` wherever possible, rounded joins and no gradients. Each icon must be distinguishable at 14–18 px. The icon is decorative metadata; graph node shape and accessible labels must still identify the entity. Do not introduce a second visual icon style or create raster icons.

## C03 — Dependency relationship legend

> Build an accessible React/SVG legend tied to the actual normalized graph contract. Distinguish imports, calls, contains, exports/extends/implements when exposed by the backend, and unresolved/possible confidence. Use line pattern as well as color: solid for imports, dashed for calls, thin neutral for containment, dotted for unresolved. Confirm edge direction: importer/caller/parent → dependency/callee/child. The labels and controls must reflect actual data, not a decorative illustration. Make the legend keyboard accessible and compact.

## C04 — Four capability icons

> Produce four small consistent SVG/React icons for Explore, Diagnose, Plan and Onboard. Explore = connected modules; Diagnose = a cluster with a measured hotspot; Plan = a selected node with downstream paths; Onboard = ordered waypoints. Use the CodeDarpan palette, crisp 1.7 px lines, 24×24 base viewBox, no glow, no filled gradient, no emojis and no raster assets. Ensure each icon stays recognizable at 16 px. Use the same icon family in landing capability items and workspace tabs.

## C05 — Intake → Parse → Resolve → Explore flow diagram

> Build a compact responsive SVG flow diagram for CodeDarpan using four connected steps: Ingest, Parse, Resolve, Explore. Use small file/archive, AST/tree, linked-node and atlas glyphs from the existing icon family. Thin brass connectors on parchment, ink labels, very small sage metadata. Make it work at 720 px and 320 px widths by wrapping or switching to a vertical flow. Use exact real product steps; no fake timing claims, no generated image, no enormous cards, no motion required.

## C06 — Architectural metrics and charts

> Implement complexity-versus-churn heatmap, health factor breakdown, file risk ranking and impact paths as data visualizations in React/CSS/SVG using actual API values. Include axes, units, legends, accessible labels, tooltips and visible missing-data states. If history is unavailable, show “Git history unavailable” rather than zero churn. Do not use generated chart images, static screenshots or hardcoded invented metrics. The color palette may use oxblood/brass/sage, but labels, line styles and text must also communicate meaning.

## C07 — Favicon and app icon bundle

> From the existing `A01-brand-glyph-ink.svg`, produce clean favicon assets and an app icon bundle: SVG favicon, 32×32, 48×48, 180×180 Apple touch icon and 192×192/512×512 PWA icons if the application needs them. Preserve the silhouette at small sizes; simplify tiny circles/paths if necessary. Use no wordmark on tiny icons. Provide parchment and ink variants as useful, but keep the primary favicon high contrast. Update index.html metadata and verify the icons at actual size. Do not embed the whole large logo lockup into a 16 px icon.

## C08 — Empty, error, loading and unavailable states

> Build reusable React components for empty repository, unsupported file type, no search results, analysis failure, GitHub rate limiting, history unavailable, missing source, partial parse and API unavailable. Use small existing SVG assets only where they add meaning. Each state needs a clear title, one-sentence explanation and a relevant action (retry, change input, select another file, or return to Explore). Distinguish zero from unavailable and failed. Never use one generic illustration for all errors. Respect keyboard navigation and reduced motion. The progress seal may accompany real progress but must not replace stage text.

## C09 — Graph motion and micro-interactions

> Add restrained motion only where it improves comprehension: 120–200 ms panel/tab changes, selected-node focus transition, subtle route emphasis on selection and a compact progress indicator. Respect `prefers-reduced-motion`. Do not animate every edge, continuously pulse every node, auto-rotate GLB models or re-run the force layout on every React render. Provide a static, fully usable state with motion disabled.

## C10 — Wordmark/header lockup in app UI

> Use the existing SVG glyph and actual text rendered in the chosen font to build a responsive CodeDarpan header lockup. Keep glyph sizing, baseline, word spacing and tagline alignment optically balanced. Do not screenshot the logo or use generated text; make navigation accessible and keep the brand lockup crisp at 32–200 px widths.

---

# PART D — FINAL FRONTEND MASTER PROMPT

Copy this complete prompt into the coding agent with the existing CodeDarpan source repository open. The asset ZIP is a design resource, not a substitute for inspecting the actual app repository.

---

## MASTER PROMPT START

You are implementing the frontend of CodeDarpan inside the existing source repository. Build a distinctive, high-quality, functional product—not a static design mockup. The product brief, code checklist, existing code, API routes and shared contracts are the source of truth. Inspect them before editing.

### Product promise

CodeDarpan turns a public GitHub repository URL or uploaded ZIP into an evidence-backed, interactive dependency atlas. A developer can explore files/modules/functions, inspect matching source, search and focus relationships, understand architectural health evidence, follow an onboarding path, and estimate structural impact from a public pull request.

Tagline: **Understand the code behind the code.**

### 1. Inspect before you implement

- Inspect the current repository tree, package scripts, dependencies, styles, routing, API routes and shared TypeScript contracts.
- Reuse the existing React/TypeScript/Vite setup, Tailwind configuration and Cytoscape.js if installed. Keep the current backend working.
- Use actual endpoint shapes. Do not invent API endpoints, substitute mock results after a live failure, or rewrite backend modules unless a specific integration blocker requires a minimal change.
- If the backend lacks a route, show a clean, explicit unavailable state. Provide a local interactive fixture only behind a button labelled “Explore sample atlas” and a visible “DEMO DATA” label.
- Inspect the provided asset pack. Keep valid SVGs; regenerate only the hero and onboarding/empty-state assets if the current versions are visually weak. Use compressed raster assets and lazy-load optional GLB.
- Once inspection is complete, start coding immediately. Do not stop after a plan or a checklist.

### 2. Visual identity

Use the exact palette:
- Parchment `#F2EBDD`
- Ink `#1D1A18`
- Oxblood `#8F3030`
- Brass `#AF8C57`
- Sage `#7C8980`
- Paper surface `#FAF7F0`
- Border `#D8CCB7`
- Muted text `#6E6961`

Typography: editorial serif for the main landing headline; clean sans-serif for UI; monospace for paths, source code, metrics and technical metadata. Suitable families: Instrument Serif or Cormorant Garamond; DM Sans or Inter; IBM Plex Mono or JetBrains Mono. Use sensible fallbacks, load fonts efficiently and check line wrapping.

Art direction: the restraint of a high-end engineering journal combined with an archival cartographer's atlas. Use precise alignment, clear type hierarchy, purposeful whitespace, hairline borders, subtle coordinate references, restrained brass route details and a dark ink graph canvas. The light landing page and the dark graph must share the same design system.

Avoid generic SaaS cards, purple, neon, cyan glow, cyberpunk, glassmorphism, random gradients, giant rounded rectangles, overuse of paper grain, static fake dashboards, fake code, fabricated stats, giant decorative 3D, stock people and constant animations.

### 3. Design quality bar

Build this as a real product UI with strong composition, not a marketing-template clone. Make the graph workspace the hero of the product. Use intentional asymmetry, hierarchy, dense but readable data, tight interaction feedback, precise control sizing and meaningful contrast. Every decorative element must support navigation, spatial understanding or the cartographic identity. Do not add sections merely to make the page longer.

Aim for:
- The first landing viewport communicates the value proposition and repository input immediately.
- The first workspace viewport looks like a usable engineering instrument: file tree, graph canvas and code inspector are all visible and balanced.
- No huge blank areas that push the core controls below the fold.
- Small labels and technical metadata are aligned on a consistent spacing/typography system.
- Buttons, filters, hover states, focus states, loading states and errors appear to belong to one product.
- The graph has enough visual space to explore; the source viewer remains readable.

### 4. Landing/intake page

Create `/` (or adapt the existing route) with:

- CodeDarpan symbol + wordmark.
- Restrained nav: Explore, How it works and Open workspace.
- Hero headline: “The architecture is already there. Make it visible.”
- Tagline “Understand the code behind the code.”
- Concise explanatory copy without claims that are not proven.
- GitHub URL field and optional ref/branch field.
- Prominent Analyze repository action.
- ZIP upload/drop zone with file validation, upload feedback and clear errors.
- Explicit “Explore sample atlas” action that selects a labelled demo fixture.
- Technical atlas artwork on the right, or a lightweight inline SVG/CSS fallback.
- Compact capability row for Explore, Diagnose, Plan and Onboard.
- A small responsive flow: Ingest → Parse → Resolve → Explore.
- Compact footer; no invented user counts, testimonials, benchmark claims or unsupported AI marketing.

The landing page must be attractive but compact. Do not let artwork delay the user from submitting a repository.

### 5. Workspace shell and information architecture

The workspace is the main deliverable. Target desktop at 1440×900 and make it sensible at 1280×800. On mobile, switch side panels to drawers/tabs instead of squeezing all panels into tiny columns.

Workspace header:
- Brand mark and repository name.
- Actual branch/commit/revision when returned.
- Actual analysis status.
- Global search for files/functions/symbols.
- Explore, Diagnose, Onboard and Impact mode tabs.
- Compact layout, filter, fit/reset and legend controls.

Summary strip below header:
- Actual scanned files, node count, edge count, warnings and measured durations only when provided.
- Architectural health score only if returned by the backend.
- Clearly distinguish zero from missing/unavailable values.

Explore workspace layout:
- Left file tree around 220–260 px: searchable directories, file types, expand/collapse and selection.
- Center graph canvas: dominant flexible region, deep ink field, subtle low-opacity coordinate grid/contours, real graph data.
- Right inspector/source panel around 340–440 px: selected entity metadata, read-only syntax-highlighted source with line numbers, metrics and dependency details.
- Use resizable panels only if easy and reliable; do not waste time on complicated window management.

Keep file tree, graph selection, search selection, source panel and dependency lists synchronized.

### 6. Real Cytoscape graph — not an image

Use Cytoscape.js with normalized API data and existing node/edge contracts. Support pan, zoom, select, hover details, fit-to-view, one stable layout and filtering. Add hierarchical layout only if it can be done robustly within the existing stack.

- Respect node kinds, edge kinds, direction and confidence.
- Import edges point importer → imported dependency; call edges point caller → callee; impact traversal follows reverse relationships to find consumers.
- Group by returned modules/folders/clusters where data permits.
- Distinguish edge kinds using line style as well as color. Use a visible legend.
- Selected node gets strong emphasis; direct dependencies/dependents are highlighted; unrelated nodes are subdued but remain visible.
- Searching a result must select it, center/focus it and highlight relevant relationships.
- Clicking a tree row, dependency or issue-path step must focus the corresponding graph node.
- Graph controls must work: filters, edge type, depth, layout, fit and reset.
- Create/cleanup Cytoscape instances and event handlers correctly. Do not restart layout on every React render. Do not animate every edge or run continuous force physics unnecessarily.
- Provide empty, loading, error, partial and large-graph states.

The graph's visual quality and interaction responsiveness matter more than the optional 3D object.

### 7. Code explorer and inspector

For the selected entity, display the actual matching source from the API, not fabricated code. Show:
- Correct repository-relative path, entity kind and language.
- Line numbers and relevant source range.
- Token count with its actual counting convention if available.
- LOC and cyclomatic complexity only when supported.
- Imports/outgoing dependencies and incoming dependents.
- Relationship confidence: resolved, possible or unresolved when supplied.
- Parser warnings, unsupported-language and missing-source states.

Dependency rows must be clickable and synchronize the tree, graph and source. Keep source text readable using Shiki or the existing lightweight highlighter. Do not build a full IDE or editor.

### 8. Diagnose mode

Use actual API findings only. Include:
- Health score and confidence only if returned.
- Transparent factor breakdown and definitions where available.
- Circular dependency list with click-to-focus behavior.
- Hotspots/god files with evidence such as complexity, fan-in/out and churn when available.
- Complexity-versus-churn heatmap from actual values.
- Missing history, unsupported metrics, partial results and unavailable states.

For ZIP input without Git history, show “Git history unavailable” (or the backend's exact wording), never zero churn. Do not create random mock scores or decorative risk charts.

### 9. Onboard mode

- Show the ordered contributor path returned by the backend.
- Each step needs a short evidence-based reason and a link to the file/module.
- Clicking a step opens that file in the graph/source explorer.
- Show public good-first-issue/help-wanted items only when available; provide title, labels, link, candidate files and evidence where returned.
- If issue lookup fails or no issue is relevant, state that clearly and allow repository exploration to continue.

### 10. Impact mode

- Support selected-file impact when the endpoint exists.
- Support a public pull-request URL flow where the backend exposes it.
- Show changed files, direct/transitive dependents, related tests, unresolved relationships and uncertainty/caveats if available.
- Clicking a result focuses the corresponding graph node and source.
- Communicate private/unavailable/malformed/different-repository PR limitations honestly.
- Describe this as a structural blast-radius estimate, not a prediction of every runtime failure.

### 11. API, upload and progress behavior

Use the actual project API client and contracts. Submit URL/ref and ZIP through real supported endpoints. Use real SSE stage events where available; otherwise use the documented polling fallback. Clean up subscriptions and prevent duplicate requests/stale selections.

Show truthful queued, validating, ingesting, filtering, parsing, resolving, analyzing, ready, cancelled, failed, rate-limited, invalid-input and network-error states as applicable. Show server error stage and message when returned. Add retry only where it is safe.

Never claim success before a successful response. Never switch to fixture data after a failed live request. Never fake a progress percentage to 100%. When an endpoint is not implemented, show “Not available in this build” or a specific honest message.

### 12. Asset policy

Use existing SVG assets when appropriate. Use the hero artwork only in landing/intake. Use a paper texture sparingly or omit it. Use contour SVG only at low opacity behind nonessential areas. Optional GLB may be loaded lazily in the landing hero and must have an SVG/CSS fallback. Do not add GLB to the workspace graph.

Do not use static generated graph images, generated charts, fake code snippets or generated dashboard screenshots as substitutes for the actual product interface.

For raster assets, resize and compress for the actual rendered size; do not ship every 4K PNG unchanged. Use transparent formats only where transparency is needed. Add meaningful alt text for informative artwork and empty alt text for purely decorative art.

### 13. Accessibility and motion

Keyboard accessible tabs, inputs, file upload, graph controls and menus. Visible focus styles, suitable ARIA labels and legible contrast. Do not rely on color alone to communicate edge kinds, severity or confidence. Provide reduced-motion behavior.

Use short transitions around 120–200 ms only when they aid comprehension. No autoplay video, long parallax, constant node pulsing or unnecessary 3D rotation.

### 14. Visual QA and finish

After implementing:
1. Run the real dev command and production build/type-check; run available tests.
2. If a browser/Playwright is available, inspect screenshots at 1440×900 and 390×844. Make at least one visual refinement pass after inspecting the screenshots.
3. Check the first landing viewport, repository submission, graph canvas, node selection, search-to-center, code panel, all mode tabs, and empty/error states.
4. Verify the interface is not overflowing, controls are not clipped, text is not too small, graph labels remain readable, and the source panel is usable.
5. Verify reduced-motion/mobile layouts.
6. Report exactly what was tested, what connects to real endpoints, what is demo-only and what remains unavailable. Never claim a test passed unless it ran successfully.

### Definition of done, in order

1. Landing page and GitHub/ZIP intake work or return clear truthful errors.
2. Workspace shows a real API graph or a clearly labeled interactive demo fixture.
3. Pan/zoom/select/filter and search-to-center/highlight work.
4. Graph, file tree, selected source, metrics and dependencies stay synchronized.
5. Loading, empty, error, unsupported and partial states exist.
6. Diagnose/Onboard/Impact are wired to real API routes when available and honestly report unavailable endpoints.
7. Responsive behavior, keyboard access and reduced-motion support are checked.
8. Production build/type-check succeeds.
9. Only then polish the hero, add one optional GLB and refine minor decoration.

Start by inspecting the repository and then implement the frontend directly. The result should feel like a designed, coherent engineering product—not a component-library demo—and the actual interactive atlas must remain the centerpiece.

## MASTER PROMPT END

---

# PART E — Suggested generation and implementation order

Use this order so asset work does not consume the time needed for frontend delivery.

1. **Keep existing A01 mark, A04 contours, A07 social preview and A08 progress seal.** Audit the brand mark at small sizes and fix filenames.
2. **Regenerate A02-V2 hero** only if time allows; it should read as a code dependency atlas, not generic fantasy cartography.
3. **Regenerate A06-V2 onboarding route** because the current image has distracting artifacts. Or draw the route as SVG directly.
4. **Optionally replace A05 with A05-V2** if the current rolled-scroll empty-state art feels wrong for the product.
5. **Compress A02/A03/A05/A06**. Do not ship the 4K-upscaled PNGs at their current 9–15 MB sizes.
6. **Do not make another GLB by default.** Test G01 in the app; if it lacks useful color/material separation, apply one material or skip it.
7. Implement landing page and repository intake.
8. Implement the graph workspace, source synchronization, search and interactions.
9. Implement Diagnose, Onboard and Impact using real API data and truthful unavailable states.
10. Run build/tests and inspect screenshots. Spend remaining time on visual refinement, not collecting more assets.

## Final rule

A memorable frontend is not the one with the most assets. It is the one where brand, typography, spacing, live graph, code inspection, evidence and interaction all feel like the same carefully designed product. The graph and code explorer are CodeDarpan's signature visuals; generated artwork is supporting material only.
