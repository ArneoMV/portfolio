# Project Overview — Arneo Portfolio

Last Updated: 2026-05-22

This document is a complete technical handoff for the Next.js portfolio site in this repository. It is written to be consumed by another engineer or an AI assistant with no prior context.

## 1. Project Metadata

- **Project name:** portfolio (Arneo)
- **Owner / Author:** Arneo (authoring comments and ©Arneo2026 in code)
- **Purpose:** Personal portfolio / case studies site showcasing product and web design work.

Tech stack
- **Framework:** Next.js (App Router)
- **Next.js version:** 16.2.2 (see package.json)
- **Language:** TypeScript (strict) + React 19
- **Styling:** SCSS (Sass) with a structured folder under `app/styles/` (core tokens, layout, sections, components)
- **Animation / Interaction libraries:** GSAP (gsap) + custom animation helpers + react-three for 3D assets
- **3D / WebGL:** three, @react-three/fiber, @react-three/drei, @react-three/rapier
- **Image processing:** sharp (dev dependency)
- **Fonts / fontstack:** CSS tokens define `--font-sans: "Source Sans 3", sans-serif; --font-display: "Young Serif", serif; --font-tech: "VT323", monospace`

Runtime / Tooling
- **Node engines:** not specified in package.json (no `engines` field).
- **Package manager:** npm (repository contains `package-lock.json`).
- **Build / Deployment target:** not specified explicitly (no `vercel.json`, no deployment config). Uses Next.js standard build output; typical targets: Vercel, Netlify, static hosting, or custom server.

## 2. package.json Highlights

Scripts (from `package.json`):

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```
- `dev`: Launches Next.js dev server.
- `build`: Builds the production site (Next.js build).
- `start`: Starts the production server after `build`.
- `lint`: Runs ESLint (config in `eslint.config.mjs`).

Main dependencies (grouped)
- Framework / core: `next` 16.2.2, `react` 19.2.4, `react-dom` 19.2.4
- Styling / utilities: `clsx` 2.1.1, `tailwind-merge` 3.5.0 (Tailwind utilities merging), `sass` (dev)
- Animation / 3D: `gsap` 3.15.0, `three` 0.184.0, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`
- Image / build helpers: `sharp` (dev)
- Types / tooling (dev): `typescript` ^5, `@types/*` packages, `eslint` and `eslint-config-next` configured.

Notable versions
- Next.js: 16.2.2
- React: 19.2.4
- TypeScript: ^5

No peerDependencies are declared.

## 3. Folder Structure (overview)

Top-level (selected):
```
app/
public/
lib/
styles/  (mostly under app/styles/)
components/ (under app/components)
features/
data/
tsconfig.json
next.config.ts
package.json
eslint.config.mjs
PROJECT_OVERVIEW.md
```

app/ (App Router root)
- Contains routes, global layout, styles and local components used by pages.
- Note: There is an `(site)` route group used for the public site pages: `app/(site)/...`

public/
- Static assets (images, icons, fonts, gifs, glb files).

app/components/
- atoms/ — smallest UI primitives (buttons, headings, icons, tag, text)
- molecules/ — small composed components (work-card, nav-link, section-header, contact-card)
- organisms/ — page-level or large composition components (hero, header, footer, project-detail components)
- templates/ — page templates (HomeTemplate, PageShell)

app/data/
- site and project data (`project-details.data.ts`, `neogov-project.data.ts`, `site-config.ts`, `social-links.ts`, `navigation.ts`)

app/features/
- `homepage` (hooks, utils, data)
- `projects` (types, data, helpers)

app/styles/
- `core/` (tokens, mixins, breakpoints, animations)
- `layout/` (container, header, footer-toolbar, grid)
- `base/` (reset, globals, typography)
- `components/` (buttons, modals, section-header)
- `sections/` (hero, project-detail, projects, services, work, etc.)

Key top-level config files
- `next.config.ts` — Next image formats (avif, webp)
- `tsconfig.json` — baseUrl `.`, path alias `@/*` -> `./*` (so imports use `@/`)
- `eslint.config.mjs` — ESLint extends Next.js core web vitals + typescript rules

## 4. Routing Map (app/(site) routes)

Files in `app/(site)/` produce the public site routes. Routes discovered:

- `/` — app/(site)/page.tsx
  - File: [app/(site)/page.tsx](app/(site)/page.tsx#L1)
  - Description: Homepage (renders `HomeTemplate` and multiple feature sections: hero, marquee, services, work preview, about, FAQ, footer).

- `/work` — app/(site)/work/page.tsx
  - File: [app/(site)/work/page.tsx](app/(site)/work/page.tsx#L1)
  - Description: Work listing page — vertical hover-expand project list. Uses `WORK_PROJECTS` from `app/features/projects/data/projects.data.ts`.

- `/work/[slug]` — app/(site)/work/[slug]/page.tsx
  - File: [app/(site)/work/[slug]/page.tsx](app/(site)/work/[slug]/page.tsx#L1)
  - Description: Individual project detail page. Implements branching:
    - If `slug === 'neogov'` → render the dedicated `NeogovProjectPage` (custom page backed by `NEOGOV_PROJECT` in `app/data/neogov-project.data.ts`).
    - Otherwise → resolve project from `PROJECT_DETAILS` (app/data/project-details.data.ts) and render `ProjectDetailTemplate` with `project` + `otherProjects`.
  - Special routing logic:
    - `generateStaticParams()` emits paths from `PROJECT_DETAILS` (so `neogov` path is emitted there as well).
    - `generateMetadata()` builds OG/Twitter metadata using the project's shared fields.

- `/about` — app/(site)/about/page.tsx — About page
- `/coaching` — app/(site)/coaching/page.tsx — Coaching page
- `/contact` — app/(site)/contact/page.tsx — Contact page
- `/lab` — app/(site)/lab/page.tsx — Lab page

Notes about /work/[slug] branching (Neogov):
- Rationale: Neogov is the signature project that requires design freedom and will diverge from the shared template. Branching at the route level allows `NeogovProjectPage` to evolve independently while still returning identical visual output today.
- Data split: `NEOGOV_PROJECT` (app/data/neogov-project.data.ts) is the source of truth for the /work/neogov page. A minimal Neogov entry remains in `PROJECT_DETAILS` solely to show Neogov in listing / other-work cards and to emit the static param.

## 5. Component Inventory

Location: `app/components/`

Atoms (selected)
- `ScrollTriggerCleanup.tsx` — helper that ensures ScrollTrigger is cleaned up on unmount.
- `button/Button.tsx` — clickable Button with `variant` and `size` props (link support).
- `heading/Heading.tsx` — typographic headings.
- `icon/Icon.tsx` — inline SVG icon component.
- `tag/Tag.tsx` — simple tag label.
- `text/Text.tsx` — textual primitive.

Molecules
- `work-card/WorkCard.tsx` — project preview card used elsewhere.
- `nav-link/NavLink.tsx` — nav link with active logic.
- `timeline-card/TimelineCard.tsx` — timeline item.
- `instagram-story/InstagramStory.tsx` — Instagram-style story component.
- `section-header/SectionHeader.tsx` — section heading with optional subtitle.
- `contact-card/ContactCard.tsx` — contact info card.

Organisms (selected)
- `about-home/AboutSection.tsx` — About block on homepage
- `contact-home/ContactSection.tsx`, `ContactScene.tsx` — contact + 3D scene / interactions
- `faq-home/FAQSection.tsx` — FAQ accordion
- `footer-home/FooterSection.tsx` — homepage footer
- `footer-toolbar/FooterToolbar.tsx` — bottom toolbar used across site
- `header/Header.tsx` — site header
- `hero/HeroSection.tsx` — homepage hero with preloader and GSAP timeline
- `lab/LabScene.tsx` — lab page 3D scene
- `projects-home/ProjectsSection.tsx` — homepage projects marquee
- `services-home/ServicesSection.tsx` — homepage services kanban
- `task-side-panel/TaskSidePanel.tsx` — dev/test side panel
- `project-detail/*` — set of components that render `/work/[slug]` pages (detailed next)

Project detail organisms (expanded)

Files (under `app/components/organisms/project-detail/`):
- `project-detail.types.ts` — shared TS types for project detail data (quoted in Section 7)
- `ProjectDetailTemplate.tsx` — shared page template (server component)
  - Props: `{ project: ProjectDetail; otherProjects: ProjectDetail[] }`
  - Renders order: `ProjectHeroSection` → `ProjectDarkSection` → optional `ProjectLightSection` → `OtherWorkSection` → `SiteFooter`.
  - Server component (no `use client`).

- `NeogovProjectPage.tsx` — dedicated Neogov page (server component)
  - No props; reads `NEOGOV_PROJECT` and `getOtherProjects` internally.
  - Contains its own `NEOGOV_FOOTER_LINKS` local constant.

- `ProjectHeroSection.tsx` — hero + metadata + introduction (server component)
  - Props: `{ project: ProjectDetail }`
  - Renders project title (`h1`), a 2-col label/description row, hero image (Next `Image` with `fill`, `priority`), meta grid (`ProjectMetaGrid`), and introduction row.
  - No local state, no effects. Uses `sizes` and `priority` for next/image.

- `ProjectMetaGrid.tsx` — meta grid (server)
  - Props: `{ meta: ProjectDetailMeta }`
  - Renders Responsibility, Project Type, Industry, Year as `<dt>/<dd>` pairs.

- `ProjectDarkSection.tsx` — dark band with sticky left + scroll-driven behaviour (client)
  - Marked with `"use client"` at top.
  - Props: `{ project: ProjectDetail }`
  - Internal state: `isStickyActive: boolean` (React state) and `sectionRef` ref.
  - Effects: `useEffect` sets up a scroll listener with requestAnimationFrame throttle to compute whether the section's top has reached the header bottom; sets `.is-sticky-active` class when appropriate. Functional `setState` is used to bail out early when state would be unchanged.
  - Renders: left lead text and right column blocks (text or image types). For image blocks it handles three variants (`illustration`, `mockup-on-frame`, `responsive`) with Next `Image` rendering specifics (width/height props for `illustration`, capped widths for `mockup-on-frame`, `sizes` hints for responsive).

  Key snippet (scroll listener core):
  ```ts
  const updateStickyState = () => {
    const rect = section.getBoundingClientRect();
    const shouldActivate = rect.top <= headerHeight && rect.bottom > headerHeight;
    setIsStickyActive((prev) => (prev === shouldActivate ? prev : shouldActivate));
  };
  window.addEventListener('scroll', () => requestAnimationFrame(updateStickyState), { passive: true });
  ```

- `ProjectLightSection.tsx` — optional follow-on editorial section (server)
  - Props: `{ lightSection: ProjectDetailLightSection }`
  - Renders per-block rows (5fr/7fr grid at ≥900px) or `full-width` image blocks that escape the grid. Reuses the same `project-detail-dark-image--*` modifier classes so CSS is shared.

- `OtherWorkSection.tsx` and `OtherWorkCard.tsx` — show two other projects with images and descriptions.
  - `OtherWorkCard` props: `{ project: ProjectDetail; variant: 'tall' | 'short' }`.

Client vs Server components summary for project-detail set
- `ProjectDarkSection` — client (has scroll listeners / hooks)
- `ProjectHeroSection`, `ProjectLightSection`, `ProjectMetaGrid`, `OtherWorkSection`, `OtherWorkCard`, `ProjectDetailTemplate`, `NeogovProjectPage` — server components (no `use client`).

## 6. Data Layer

Files of interest under `app/data/` and `app/features/*/data/` (selected):

- `app/data/project-details.data.ts`
  - Exports: `PROJECT_DETAILS: ProjectDetail[]`
  - Description: Per-project case-study data for the `/work/[slug]` pages; serves as the source for the work listing and "Other Work" cards. NOTE: Contains a minimal Neogov entry that is retained for listing/static param emission but is not the canonical data for the Neogov detail page.

- `app/data/neogov-project.data.ts`
  - Exports: `NEOGOV_PROJECT: NeogovProjectData` and `NeogovProjectData` interface.
  - Description: Dedicated source-of-truth for Neogov page content. Mirrors `ProjectDetail` structure to remain assignable to shared section components while allowing future Neogov-only fields.

- `app/features/projects/data/projects.data.ts`
  - Exports: `WORK_PROJECTS` (used by `/work` listing) — contains `Project` entries with `slug`, `title`, `description`, `images`, etc.

- `app/features/homepage/data/home.data.ts`
  - Exports: homepage content (hero copy, marquee images, feature content used by the home template).

- `app/data/site-config.ts`, `app/data/social-links.ts`, `app/data/navigation.ts`
  - Exports: global site config, social link arrays, top navigation items.

Duplication / sync notes (KNOWN ISSUES)
- Neogov content currently exists in two places:
  - `PROJECT_DETAILS` (app/data/project-details.data.ts) — retained minimal listing entry for `/work` listing and `generateStaticParams()`.
  - `NEOGOV_PROJECT` (app/data/neogov-project.data.ts) — canonical detail page data for `/work/neogov`.
- Fields that must be kept in sync across these two files for consistent listing + detail behaviour: `slug`, `title`, `heroImage`, `heroImageAlt`, `description`, `tags`.
- Fields that intentionally don't sync (and are allowed to diverge): `darkSection`, `lightSection`, `meta`, `introduction` — these can be Neogov-specific in `NEOGOV_PROJECT`.

## 7. Type System (key types)

Quoted: `app/components/organisms/project-detail/project-detail.types.ts`

```ts
export interface ProjectDetailMeta {
  responsibility: string;
  projectType: string;
  industry: string;
  year: string;
}

export type ProjectDetailDarkImageVariant =
  | "illustration"
  | "responsive"
  | "mockup-on-frame"
  | "full-width";

export type ProjectDetailDarkBlock =
  | { type: "text"; content: string }
  | {
      type: "image";
      variant?: ProjectDetailDarkImageVariant;
      src?: string;
      alt?: string;
      height?: number;
      backgroundColor?: string;
    };

export interface ProjectDetailDarkSection {
  leftText: string;
  rightBlocks: ProjectDetailDarkBlock[];
}

export interface ProjectDetailLightSection {
  rightBlocks: ProjectDetailDarkBlock[];
}

export interface ProjectDetail {
  slug: string;
  title: string;
  typeOfWorkLabel?: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
  meta: ProjectDetailMeta;
  introduction: string;
  darkSection: ProjectDetailDarkSection;
  lightSection?: ProjectDetailLightSection;
  tags?: string[];
}
```

Also: `NeogovProjectData` (in `app/data/neogov-project.data.ts`) is an interface that mirrors `ProjectDetail` fields and uses the `ProjectDetailMeta`, `ProjectDetailDarkSection`, and `ProjectDetailLightSection` sub-types.

RightBlock union is `ProjectDetailDarkBlock` above (discriminated by `type: 'text' | 'image'`).

Image variant union is `ProjectDetailDarkImageVariant` (illustration, responsive, mockup-on-frame, full-width).

## 8. Styling System (SCSS)

SCSS organization (files under `app/styles/`):
- `core/` — `_tokens.scss`, `_mixins.scss`, `_breakpoints.scss`, `_animations.scss`, `_z-index.scss`
- `base/` — `_globals.scss`, `_reset.scss`, `_root.scss`, `_typography.scss`
- `layout/` — `_container.scss`, `_header.scss`, `_footer-toolbar.scss`, `_grid.scss`, `_page.scss`
- `components/` — `_buttons.scss`, `_modals.scss`, `_section-header.scss`
- `sections/` — `_hero.scss`, `_project-detail.scss`, `_projects.scss`, `_services.scss`, `_work.scss`, `_about.scss`, `_faq.scss`, `_footer.scss`, `_contact.scss`
- `utils/` — `_spacing.scss`, `_cursor.scss`, `_state.scss`, `_visibility.scss`

Main entry point: `app/styles/main.scss` (import chain) — this is the global SCSS entry used by the app. `app/globals.css` also exists to include global CSS (Next.js global stylesheet).

Design tokens (from `app/styles/core/_tokens.scss`) — exact CSS custom properties:
- Color scales: `--color-primary-10 .. --color-primary-100`, `--color-neutral-10 .. --color-neutral-100`, and semantic aliases like `--color-background`, `--color-text-primary`, `--color-brand`, etc.
- Font families: `--font-sans`, `--font-display`, `--font-tech`.
- Typography sizes (semantic tokens):
  - `--text-xxl: 38px; --text-xl: 30px; --text-lg: 26px; --text-md: 21px; --text-sm: 18px; --text-xs: 16px; --text-caption: 14px;`
  - Heading sizes: `--h2-size: 60px` (project detail H2), `--h3-size: 44px`, etc.
- Spacing tokens: `--space-xxs: 4px` ... `--space-5xl: 128px` (full scale provided)
- Header height: `--header-height: 124px`

Requested token mapping (project tokens → requested names):
- The project uses tokens like `--h2-size` / `--text-lg` / `--text-md` rather than `--heading-h2` or `--base-large`. Map as:
  - `--heading-h2` ≈ `--h2-size` (60px)
  - `--base-xlarge` ≈ `--text-xl` (30px)
  - `--base-large` ≈ `--text-lg` (26px)
  - `--base-medium` ≈ `--text-md` (21px)
  - `--base-small` ≈ `--text-caption` (14px)

Typography tokens with exact values (from `_tokens.scss`):
- `--h2-size`: 60px
- `--text-xl`: 30px
- `--text-lg`: 26px
- `--text-md`: 21px
- `--text-caption`: 14px

Color tokens (neutral scale and brand)
- Neutral range: `--color-neutral-10: #ffffff` ... `--color-neutral-100: #2d333a`
- Brand: `--color-primary-80: #2e69b6` (alias `--color-brand`), darker `--color-primary-100: #143a6b`.

Spacing tokens: `--space-sm: 12px` ... `--space-5xl: 128px` (see `_tokens.scss` for full list).

Container max-width and header
- `.container` / section containers use `max-width: 1100px` across project-detail and other pages (see `_project-detail.scss` and other section scss files).
- Horizontal padding per breakpoint: 64px (desktop), 48px (medium), 16px (mobile). Implemented via container classes and negative margins for rail-to-rail elements.
- Header height token: `--header-height: 124px` (used by sticky logic and layout offsets).

SCSS patterns
- Use of BEM-like modifier classes (e.g., `.project-detail-row--intro`, `.project-detail-other-card--tall`)
- Shared modifier classes for image variants (`project-detail-dark-image--illustration`, `--responsive`, `--mockup-on-frame`)
- Compound selectors to increase specificity vs reset / preflight.
- Responsive breakpoints handled with media queries (mobile-first).

Tailwind
- Tailwind is present as a dependency (`tailwindcss` v4 and `@tailwindcss/postcss`) but the codebase is primarily SCSS-driven. Tailwind utilities may be used in some components or to complement existing styles; no global `tailwind.config.js` inspected in this scan.

## 9. Image Variant System

The project uses a discriminated union for right-column blocks with four image variants. Implementation spans `project-detail.types.ts`, `ProjectDarkSection.tsx`, `ProjectLightSection.tsx`, and `_project-detail.scss`.

Variants (behaviour + SCSS / JSX details):

1. illustration
   - Behaviour: Transparent PNG/illustration with fixed pixel height (data provides `height`), width auto and centered.
   - JSX: `Image` rendered with explicit `width`/`height` (width often `height * 2`) and wrapper `style={{ height: `${height}px` }}`. CSS overrides image width to `auto`.
   - SCSS rules (excerpt):
     ```scss
     .project-detail-dark-image--illustration img.project-detail-dark-image-content {
       width: auto;
       height: 100%;
       max-width: 100%;
       object-fit: contain;
     }
     ```

2. responsive
   - Behaviour: Photo/mockup image that fills the slot width; height auto, responsive to parent width.
   - JSX: `Image` with `width={1200}` / `height={800}` fallback and `sizes="(max-width: 767px) 100vw, 50vw"` or similar to hint srcset. Rendered inside `.project-detail-dark-image--responsive`.
   - SCSS rules (excerpt):
     ```scss
     .project-detail-dark-image--responsive img.project-detail-dark-image-content {
       width: 100%;
       height: auto;
       display: block;
     }
     ```

3. mockup-on-frame
   - Behaviour: Mockup image capped at ~400px width with a coloured frame behind at ~60% of image height; the image visually floats above the frame.
   - JSX: Wrapper includes a `.project-detail-dark-image-frame` element with `backgroundColor` inline style, and `Image` rendered with `width={400}` / `height={300}`.
   - SCSS rules (excerpt):
     ```scss
     .project-detail-dark-image-frame {
       position: absolute; top: 50%; left: 0; width: 100%; height: 60%; transform: translateY(-50%);
     }
     .project-detail-dark-image--mockup-on-frame img.project-detail-dark-image-content {
       width: 400px; height: auto; max-width: 100%;
     }
     ```

4. full-width
   - Behaviour: Composite image that escapes the 5fr/7fr grid and spans the full container width (max 1100px) — used only in light sections currently (Elite Digital mockups composite).
   - JSX: Special-case rendering in `ProjectLightSection` that renders the image inside `.project-detail-light-fullwidth` and uses `sizes="(max-width: 1099px) 100vw, 1100px"`.
   - SCSS: `.project-detail-light-fullwidth img.project-detail-dark-image-content { width: 100%; height: auto; }`

How JSX picks variants
- Data block shape: `{ type: 'image', variant?: 'illustration'|'responsive'|'mockup-on-frame'|'full-width', src?, alt?, height?, backgroundColor? }`.
- `ProjectDarkSection`/`ProjectLightSection` use `const variant = block.variant ?? 'responsive'` and branch based on the variant.

## 10. Animations & Interactions

Files of interest: `lib/gsap/gsap-init.ts`, `lib/gsap/scroll-trigger.ts`, `app/components/organisms/hero/*`, various homepage hooks under `app/features/homepage/hooks`.

Notable interactive behaviours:
- Hero cursor-follow slideshow + scroll-to-scale (homepage)
  - Implemented in `app/features/homepage/hooks/useHeroCursor.ts` and cursor images under `public/images/home/cursor_image_*`.
  - Cursor slideshow tracks mouse position and swaps images; also responds to scroll to create scale/zoom illusions.

- Projects marquee (homepage)
  - Horizontal marquee implemented in `ProjectsSection.tsx` with CSS and JS helpers (hooks under homepage).

- Services kanban (homepage)
  - `ServicesSection.tsx` implements a card/kanban-like layout. Interactions may be CSS hover + JS for drag-like behaviour (see `services-data.ts`).

- Work section sticky reveal with CRT monitor mask (homepage)
  - `work-home/CrtScreen.tsx` and `WorkSection.tsx` implement a CRT monitor visual and reveal effects.

- Dark section sticky leftText behavior (project detail)
  - Implemented in `ProjectDarkSection.tsx` (client component) using a scroll listener with `requestAnimationFrame` throttling.
  - Key behaviour: compute `rect.top <= headerHeight && rect.bottom > headerHeight` to set `.is-sticky-active` class. Uses functional `setState` to avoid redundant state updates.

- GSAP / ScrollTrigger usage
  - `lib/gsap/gsap-init.ts` and `lib/gsap/scroll-trigger.ts` contain initialization wrappers for GSAP and ScrollTrigger. Components that need scroll-based pin/scrub (some older dark band behaviour, hero preloader timelines) import these utilities.

- FAQ accordion behaviour
  - Implemented in `FAQSection.tsx` (organism). Likely `useState` per item and CSS transitions.

- Contact Chat / footer form
  - `contact-home/ContactSection.tsx` plus `validations/contact.schema.ts` implements the contact form with validation. There is also `ContactScene` and `ContactHome` floating 3D objects.

## 11. Asset Organization (public/images)

Top-level image directories of interest:
- `public/images/projects/elite-digital/`
  - elite-digital-hero-image.png — 169,560 bytes (~169 KB)
  - elite-digital-clean-work-flow.png — 55,323 bytes
  - elite-digital-black-white-mode.png — 106,982 bytes
  - mockup-continental-dynamics-01.png — 530,405 bytes (~530 KB)
  - mockups-all.png — 473,313 bytes (~473 KB)
  - mockup-clean-azimut-01.png — 138,892 bytes
  - mockup-clean-elite-digital-01.png — 129,183 bytes
  - mockup-clean-union-rail-01.png — 108,060 bytes
  - Notes: three mockup-clean-* files flagged by maintainer as possibly unreferenced (retained intentionally).

- `public/images/projects/neogov/`
  - screen-ai assistent.png — 1,749,560 bytes (~1.75 MB)
  - screen-portals-company.png — 2,786,145 bytes (~2.79 MB)  ← FLAG: >2MB, optimise
  - screen-tablet-NeoAI.png — 547,239 bytes
  - screen-tablet-AI Summarization.png — 500,035 bytes
  - screen-form.png — 372,762 bytes
  - multiple `screen-mobile_neogov_*` images (~150–300 KB each)

- `public/images/projects/spona/` — (files exist; listing present under `public/images/work` and `public/images/home/course-slideshow` for previews)
- `public/images/projects/croatel/` — (files present under home/project-marquee images)

Work thumbnails & logos: `public/images/work/` contains `elite_digital_work.webp` + `_small.webp` variants, `neogov_work.webp`, `spona_work.webp`, and `logo-*.svg` files.

Other notable public assets:
- Homepage cursor images: `public/images/home/cursor_image_*.png`
- GLB 3D assets: `public/images/home/message.glb`, `picture.glb`, `Instagram-logo.glb`.

Oversized assets:
- `public/images/projects/neogov/screen-portals-company.png` — ~2.79 MB (flagged for optimization)
- `public/images/projects/neogov/screen-ai assistent.png` — ~1.75 MB (consider WebP/AVIF)

Action: schedule an image optimization pass to convert large PNG/JPEG files to WebP/AVIF, and to create responsive sizes.

## 12. Current Project State (summary)

- **Elite Digital:** Case study content is present and uses `lightSection` + `darkSection` with images — status: COMPLETE (content and images present).
- **Neogov:** Routing-level split COMPLETE — dedicated `NeogovProjectPage` exists and reads `NEOGOV_PROJECT` data. Custom Neogov design is PENDING; current `NeogovProjectPage` renders the shared template to avoid visual regression.
- **Spona:** Placeholder lorem content exists in `PROJECT_DETAILS` — no custom assets beyond preview thumbnails.
- **Croatel:** Placeholder lorem content exists — no custom assets beyond preview thumbnails.
- **Homepage:** Feature-complete with hero, cursor slideshow, projects marquee, services, work preview, about, FAQ, footer.

## 13. Key Architectural Decisions

- Branch `/work/[slug]` on slug === 'neogov' to allow Neogov to evolve independently while preserving an identical visual output for now.
- `NEOGOV_PROJECT` mirrors `ProjectDetail` so the Neogov page can be typed against shared UI components and later extend with custom fields without touching the shared type.
- `PROJECT_DETAILS` keeps a minimal Neogov entry to support listing (`OtherWorkSection`) and `generateStaticParams()` for static path emission.
- Footer link groups are duplicated inside `ProjectDetailTemplate` and `NeogovProjectPage` intentionally so each page can diverge their footer content later without cross-coupling.
- Image variant union (`ProjectDetailDarkImageVariant`) is used as a per-block discriminant so each right-column block can decide its rendering strategy independently.

## 14. Conventions and Patterns

- Component naming: PascalCase filenames and exported default components (`ComponentName.tsx`).
- SCSS file naming: `_kebab-case.scss` with underscore prefix for partials (SCSS convention used).
- Data files: `kebab-case.data.ts` (e.g., `project-details.data.ts`).
- Atomic folder structure: `atoms/`, `molecules/`, `organisms/`, `templates/`.
- Exports: Components generally default-export the component; types/data use named exports.
- `use client` is used only when necessary (interactivity hooks, `ProjectDarkSection` scroll listener).
- `generateStaticParams` + `generateMetadata` patterns for App Router per-route optimization.
- Path aliases: `@/*` → `./*` via `tsconfig.json` allowing `@/app/...` imports.
- TypeScript: `strict: true` in `tsconfig.json`; avoid `any`.
- ESLint: `eslint.config.mjs` extends Next.js core web-vitals and typescript rules.

## 15. Typography Application Map (where tokens are applied)

Mapping tokens (project token → applied element):
- Project title H2: `.project-detail-title` uses `--h2-size` (60px), heavy weight.
- Subtitle / typeOfWorkLabel: `.project-detail-row-label` uses `--text-lg` (26px).
- Description in hero body: `.project-detail-row-body` uses `--text-lg` (26px).
- Meta labels (RESPONSIBILITY, PROJECT TYPE, INDUSTRY, YEAR): `.project-detail-meta-label` uses `--text-caption` (14px).
- Meta values: `.project-detail-meta-value` uses `--text-md` (21px).
- Introduction paragraph: `.project-detail-row-body` uses `--text-lg` (26px).
- Sticky leftText (dark section lead): `.project-detail-dark-left .project-detail-dark-text` uses `--text-xl` (30px) at ≥900px.
- Dark section right column paragraphs: `.project-detail-dark-text` uses `--text-lg` (26px).
- Light section paragraphs: `.project-detail-light-text` uses `--text-lg` (26px).

## 16. Known Issues / Data Duplication

- Duplicate Neogov data: `NEOGOV_PROJECT` (canonical) and `PROJECT_DETAILS` (minimal listing entry) — must keep a subset of fields in sync (`slug`, `title`, `heroImage`, `heroImageAlt`, `description`, `tags`).
- Fields intentionally unsynced: `darkSection`, `lightSection`, `meta`, `introduction` (these can diverge for Neogov custom design).
- Oversized assets flagged:
  - `public/images/projects/neogov/screen-portals-company.png` (~2.79 MB) — optimize to WebP/AVIF.
  - `public/images/projects/neogov/screen-ai assistent.png` (~1.75 MB) — consider optimization.
- Three potentially unreferenced images in `elite-digital/` (mockup-clean-azimut-01.png, mockup-clean-union-rail-01.png, mockup-clean-elite-digital-01.png) called out previously by maintainer comments in `project-details.data.ts` — verify references before deletion.

## 17. What's Next (recommended roadmap)

1. Phase 1: Implement custom Neogov page design — hero, stat row, callout, two-column text components, AI showcase, composite mockup. Use `NEOGOV_PROJECT` as canonical data, update `NeogovProjectPage` to include Neogov-specific JSX.
2. Add case study content & assets for Spona and Croatel (populate `PROJECT_DETAILS` `darkSection`/`lightSection` blocks and add images under `public/images/projects/*`).
3. Image optimization batch: convert flagged PNGs/JPEGs to AVIF/WebP, generate responsive sizes, and update `src` paths.
4. Mobile homepage QA: test hero cursor interactions and marquee on real devices; fix spacing and performance.
5. Optional: Remove or archive unreferenced/mockup files after verification.

---

## Validation / Post-creation Checks

I created this file at the repository root as `PROJECT_OVERVIEW.md`.

(Next steps I will perform now: verify the file exists, print top-level headers (table of contents), and count lines.)
