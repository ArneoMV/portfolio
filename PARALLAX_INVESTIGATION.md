# Parallax Effect Investigation: Work Section Homepage

## Executive Summary

The "parallax" effect on the Work section is **not a traditional parallax animation**. It's a **CSS-based sticky reveal** where the Projects section sticks to the viewport top while the Work section scrolls up over it, creating a visual parallax-like effect through relative motion and z-index layering.

**Key Finding:** There are NO GSAP scroll-driven animations, transform translations, or JavaScript-driven scroll effects on the Work section itself. The effect is purely CSS-based using `position: sticky`, z-index stacking, and layout geometry.

---

## A. WHERE THE PARALLAX EFFECT LIVES

### Files Involved

| File | Role | Lines |
|------|------|-------|
| [app/(site)/page.tsx](app/(site)/page.tsx#L20) | Layout structure: wraps Projects + Work in `.projects-work-reveal` | 20-27 |
| [app/styles/sections/_projects.scss](app/styles/sections/_projects.scss#L14) | CSS reveal mechanism: sticky Projects, Work z-stacking | 14-42 |
| [app/components/organisms/work-home/WorkSection.module.scss](app/components/organisms/work-home/WorkSection.module.scss) | Work section CSS: `height: 100vh`, `z-index: 2` | 1-100 |
| [app/components/organisms/work-home/WorkSection.tsx](app/components/organisms/work-home/WorkSection.tsx#L77) | Work component (contains comment about future GSAP glitch effect) | 1-95 |

### Mechanism Type

**CSS Sticky Reveal** (NOT parallax transformation)

```
HTMLStructure:
├── .projects-work-reveal (position: relative; containing block)
│   ├── .projects-section (position: sticky; top: 0; z-index: 1; min-height: 100vh)
│   └── WorkSection (position: relative; z-index: 2; height: 100vh on Medium+)
```

No GSAP, no ScrollTrigger, no scroll-driven transforms on Work section.

---

## B. WHAT IT DOES VISUALLY

### The Reveal Behavior

1. **User scrolls down** on the homepage
2. **Projects section reaches viewport top** → sticky positioning kicks in
3. **Work section enters below Projects** → begins scrolling upward in normal flow
4. **Work section's z-index: 2** causes it to paint OVER sticky Projects (z-index: 1)
5. **Visual result:** Projects stays in place while Work scrolls up and covers it—appears as a smooth reveal transition

### Relative Motion Characteristics

| Aspect | Behavior |
|--------|----------|
| Which element moves | Work section scrolls at normal 1x page scroll rate |
| Which element sticks | Projects section sticks to viewport top |
| Motion direction | Vertical (upward scroll) |
| Visual effect | Two sections scroll at different rates relative to viewport |
| Scroll range (Medium+) | ~1 full viewport height (~100vh) while Work is visible and moving |
| Trigger point | Occurs once Projects section reaches viewport top |

### Elements Involved in the Effect

- **Projects section:** Sticks, remains visible, acts as background layer
- **Work section:** Scrolls, covers Projects as it moves up, acts as foreground layer
- **Dotted page rails:** Rendered on both sections to maintain visual continuity
- **CrtScreen (monitor background):** Positioned absolutely within Work, moves with section
- **WorkList (project rows):** Positioned absolutely within Work, moves with section
- **SectionHeader (Work title):** Positioned absolutely within Work, moves with section

---

## C. DEPENDENCIES

### CSS Variables & Layout Math

- **`.projects-work-reveal` width:** `100%` (inherits from page)
- **`.projects-section` height:** `min-height: 100vh` / `100dvh` (sticky container)
- **`WorkSection` height:** `100vh` (Medium+ breakpoint only)
- **`WorkSection` overflow:** `hidden` (Medium+ breakpoint only)
- **Z-index stack:**
  - Projects rails: `z: 1`
  - Work section: `z: 2` (paints over Projects)
  - Page rails (Hero): `z: 1`

### Breakpoint Differences

| Breakpoint | Work Height | Overflow | Behavior |
|-----------|-------------|----------|----------|
| Small (≤639px) | auto (not set) | auto (not set) | Normal flow, no sticky reveal (stacks vertically) |
| Medium (≥640px) | 100vh | hidden | Sticky reveal active, Work sticks to Projects |
| Large (≥1024px) | 100vh | hidden | Same as Medium |

### No JavaScript/GSAP Dependencies

- ✅ No GSAP imports in WorkSection.tsx
- ✅ No ScrollTrigger instances on Work section
- ✅ No useEffect hooks managing scroll animations
- ✅ No refs attached to scroll-tracking elements
- ✅ No transform inline styles driven by scroll position

The comment in [WorkSection.tsx line 77](app/components/organisms/work-home/WorkSection.tsx#L77) references a future "GSAP glitch effect" but that code is not yet implemented.

---

## D. INTEGRATION WITH SURROUNDING SECTIONS

### The Reveal Pair Architecture

```
Page Flow:
1. HeroSection (.page-rail-group)
2. ↓ [scroll down]
3. ProjectsSection (sticky at top: 0) ──┐
   ↓                                      ├─ Inside .projects-work-reveal
   WorkSection (scrolls over Projects) ──┘
   ↓ [Work fully reveals, Projects unsticks]
4. ServicesSection (normal flow)
5. ... other sections
```

### Height Dependencies

**`.projects-work-reveal` implicit height calculation:**
- Containing both Projects (100vh) + Work (100vh)
- Total available scroll distance ≈ 100vh (Work's height)
- This distance is the "travel room" for sticky Projects

**If Work height is removed or changed:**
- `.projects-work-reveal` would shrink
- Sticky Projects would have less travel distance
- Reveal effect would compress or disappear

### No Cross-Section References

✅ Work section does NOT reference surrounding sections' dimensions  
✅ Projects sticky logic does NOT depend on Work's internals  
✅ Services/FAQs below are unaware of the reveal effect  
✅ HeaderToolbar/FooterToolbar observe page scroll, not section-specific events

### Section Heights on Page

| Section | Height (Medium+) | Stacking |
|---------|------------------|----------|
| Hero | min-height: 100vh | normal flow |
| Projects | min-height: 100vh | sticky (z:1) |
| Work | height: 100vh | scrolls over Projects (z:2) |
| Services | auto | normal flow (no special height) |
| Recommendations | auto (pinned by GSAP) | pinned during scroll (separate effect) |
| About/FAQ/Footer | auto | normal flow |
| Contact | auto | reveals over footer (separate effect) |

---

## E. WHAT NEEDS TO CHANGE TO REMOVE PARALLAX (REVEAL EFFECT)

### Step-by-Step Removal

#### 1. **HTML/JSX Changes**

**File:** [app/(site)/page.tsx](app/(site)/page.tsx#L20-L27)

**Current:**
```jsx
<div className="projects-work-reveal">
  <ProjectsSection />
  <WorkSection />
</div>
```

**After removal:**
```jsx
{/* Projects and Work no longer need a reveal wrapper */}
<ProjectsSection />
<WorkSection />
```

**Rationale:** The wrapper exists only to provide a containing block for sticky Projects to have travel room. Without the reveal effect, the wrapper is unnecessary.

#### 2. **CSS Changes to Projects Section**

**File:** [app/styles/sections/_projects.scss](app/styles/sections/_projects.scss#L26-L35)

**Remove/change:**
```scss
/* REMOVE the entire sticky rule block: */
.projects-section {
  position: sticky;    /* ← DELETE THIS */
  top: 0;              /* ← DELETE THIS */
  z-index: 1;          /* ← DELETE THIS */
}
```

**Replace with:**
```scss
.projects-section {
  /* No sticky; Projects scrolls normally now */
  /* Remove z-index: 1 — no layering needed */
}
```

**Rationale:** Projects should scroll normally in page flow, not stick to viewport top.

#### 3. **CSS Changes to Work Section**

**File:** [app/components/organisms/work-home/WorkSection.module.scss](app/components/organisms/work-home/WorkSection.module.scss#L23-L35)

**Current:**
```scss
@media (min-width: 640px) {
  .section {
    height: 100vh;           /* ← Was needed for parallax scroll range */
    overflow: hidden;        /* ← Was needed to clip while scrolling */
  }
}
```

**After removal (Option 1: Natural height):**
```scss
@media (min-width: 640px) {
  .section {
    /* Remove height: 100vh — let content determine height */
    /* Remove overflow: hidden — normal content flow */
    min-height: auto;  /* Allow flexible height */
  }
}
```

**After removal (Option 2: Min-height for visual space):**
```scss
@media (min-width: 640px) {
  .section {
    min-height: 100vh;       /* Visual presence, but not fixed */
    overflow: visible;       /* Allow content to extend if needed */
  }
}
```

**Also remove z-index layering:**
```scss
.section {
  /* Remove: z-index: 2; — no longer need to paint over Projects */
}
```

**Rationale:** 
- `height: 100vh` was required to create a fixed scroll range for Projects to stick
- `overflow: hidden` was clipping the Work section while Projects was sticky
- `z-index: 2` was needed to paint Work over sticky Projects

#### 4. **Optional: Remove `.projects-work-reveal` CSS**

**File:** [app/styles/sections/_projects.scss](app/styles/sections/_projects.scss#L14-L16)

**Current:**
```scss
.projects-work-reveal {
  position: relative;
}
```

**After removal:**
```scss
/* Delete the entire .projects-work-reveal block — no longer used */
```

**Rationale:** If the wrapper is removed from HTML, its CSS becomes obsolete.

---

## F. POTENTIAL SIDE EFFECTS

### 1. **Visual Appearance Impact**

| Aspect | Current (Sticky Reveal) | After Removal (Normal Flow) |
|--------|------------------------|---------------------------|
| Projects visibility | Stays visible for ~100vh while Work scrolls | Scrolls off like normal section |
| Work entry | Smooth upward scroll, covers Projects | Enters immediately after Projects |
| Transition | Smooth 1-viewport-height reveal | Instant transition |
| Section boundaries | Projects/Work overlap visually | Clear sequential appearance |

### 2. **Layout Collapse Risks**

**Risk 1: Spacing gaps**
- ✅ **SAFE** — No spacing dependencies exist between sections
- `.projects-work-reveal` is purely layout-structural, no gaps rely on its height

**Risk 2: CrtScreen positioning**
- ✅ **SAFE** — CrtScreen is positioned absolutely within Work's container, not dependent on section height
- Removing `height: 100vh` won't affect CrtScreen's position

**Risk 3: Overflow clipping**
- ✅ **SAFE** — Work section's background image is internal to the section
- Removing `overflow: hidden` may reveal extra whitespace if sections have different heights, but no content will clip unexpectedly

### 3. **Scroll Performance**

**Current:** Projects sticks while Work scrolls — creates two render layers during scroll  
**After:** Normal stacking — single render layer per scroll frame  
**Impact:** ✅ **Likely improves** scroll performance (less browser work)

### 4. **Other Parallax Effects (NOT affected)**

These are separate and will continue to work:

| Section | Effect | Will Break? |
|---------|--------|-------------|
| Recommendations | GSAP ScrollTrigger pin with internal scroll | ✅ No — independent animation |
| About/Hero | Text animations, fade-ins | ✅ No — independent animations |
| Contact reveal | Slides up over footer | ✅ No — uses separate `.lower-contact-reveal` wrapper |
| Header/Toolbar | Scroll-driven transforms (show/hide) | ✅ No — independent listeners |

---

## G. SUMMARY: RECOMMENDED REMOVAL APPROACH

### Order of Operations

```
Phase 1: Backup & branch
  └─ Create a git branch for this change
  └─ Reason: Easy rollback if visual issues arise

Phase 2: Remove HTML wrapper
  └─ Edit app/(site)/page.tsx
  └─ Delete <div className="projects-work-reveal"> wrapper
  └─ Keep Projects and Work as siblings in JSX

Phase 3: Remove Projects sticky positioning
  └─ Edit app/styles/sections/_projects.scss
  └─ Delete "position: sticky; top: 0;" from .projects-section
  └─ Delete "z-index: 1" (or leave if used elsewhere)
  └─ Keep other Projects styles (padding, min-height, background)

Phase 4: Remove/adjust Work fixed height
  └─ Edit app/components/organisms/work-home/WorkSection.module.scss
  └─ Replace "height: 100vh" with "min-height: 100vh" (or remove entirely)
  └─ Replace "overflow: hidden" with "overflow: visible" (or remove)
  └─ Delete or verify "z-index: 2" is no longer needed

Phase 5: Delete unused wrapper CSS
  └─ Remove .projects-work-reveal block from _projects.scss
  └─ Reason: Wrapper no longer exists in HTML

Phase 6: Browser test & verify
  └─ Clear browser cache (CTRL+SHIFT+DELETE)
  └─ Test on desktop (640px+) and mobile (≤639px)
  └─ Verify:
     ✓ Projects scrolls normally (no sticky)
     ✓ Work scrolls after Projects
     ✓ CrtScreen monitor position unchanged
     ✓ No layout gaps or unexpected overflow
     ✓ Rails render correctly
     ✓ Other animations still work (Recommendations pin, etc.)

Phase 7: Cross-section verification
  └─ Scroll through entire homepage
  └─ Check Services/FAQ/About appear correctly below
  └─ Verify Contact reveal still works
  └─ Check mobile responsive layout (≤639px)
```

### Critical Watch Points

1. **Mobile behavior (≤639px):**
   - ✅ Work doesn't have `height: 100vh` on Small (only Medium+)
   - ✅ Small should already scroll normally
   - **Verify:** No unintended changes on mobile after removal

2. **Z-index layering:**
   - ✅ Projects `.section::before/::after` rails use `z-index: 1`
   - ✅ Work `.section` uses `z-index: 2`
   - **After removal:** These z-indices may need adjustment if they interfere with other sections
   - **Safe option:** Delete both z-index values and rely on DOM order

3. **Container max-width & centering:**
   - ✅ Work section already has `max-width: 1100px; margin: 0 auto;`
   - ✅ Projects has similar centering
   - **Impact:** None — centering is independent of sticky behavior

4. **Rails visibility during reveal:**
   - **Before:** Projects rails visible through Projects section, Work's rails paint over them
   - **After:** Both sections render normally, rails render in their respective sections
   - **Visual change:** Rails become sequential instead of overlapped

### Verification Checklist

```
After making changes, verify:

Structural:
  ☐ No console errors (F12 developer tools)
  ☐ No layout warnings or reflections
  ☐ Page renders at all breakpoints (375px, 640px, 1024px, 1920px)

Visual:
  ☐ Projects section scrolls off normally (no sticky)
  ☐ Work section appears below Projects
  ☐ CrtScreen monitor visible in correct position
  ☐ WorkList items render correctly
  ☐ Dotted rails render (not broken or doubled)

Interactions:
  ☐ Hover on work rows changes preview (if video/slideshow active)
  ☐ Click on work rows navigates to /work/[slug]
  ☐ Mobile touch interactions work

Cross-section:
  ☐ Services section appears smoothly below Work
  ☐ Recommendations pin animation still works
  ☐ Footer/Contact reveal still works
  ☐ Header sticky behavior unchanged
  ☐ Toolbar collapse/expand works

Performance:
  ☐ Scroll feels smooth (60fps)
  ☐ No jank or stuttering
  ☐ No excessive repaints (DevTools > Performance tab)
```

---

## H. ADDITIONAL CONTEXT: The "Future" GSAP Glitch Effect

**Found in:** [WorkSection.tsx line 77](app/components/organisms/work-home/WorkSection.tsx#L77)

```jsx
{/* SVG colour-channel filters — referenced by descendants via
    filter: url(#redChannel) / url(#blueChannel). Defined once
    at the section root for the GSAP glitch effect that arrives
    in a follow-up step. */}
<svg width="0" height="0" className={styles.svgDefs} aria-hidden="true">
  <defs>
    <filter id="redChannel">
      <feColorMatrix type="matrix" values="..." />
    </filter>
    <filter id="blueChannel">
      <feColorMatrix type="matrix" values="..." />
    </filter>
  </defs>
</svg>
```

**Status:** Not yet implemented. The SVG filters are in place but no GSAP timeline is using them.  
**Impact on removal:** None — removing the sticky reveal has no connection to this planned effect. It can remain as-is or be removed depending on future design decisions.

---

## Conclusion

The Work section's "parallax" effect is a **CSS sticky reveal mechanism**, not a true parallax animation. Removing it involves:

1. **Delete 1 HTML wrapper** (`<div className="projects-work-reveal">`)
2. **Delete 3 CSS properties** (sticky, top, z-index from Projects)
3. **Adjust 2 CSS properties** (height, overflow on Work)
4. **Delete 1 CSS block** (`.projects-work-reveal` styles)

**Result:** Normal sequential scrolling, Projects scrolls off like any other section, Work follows in natural flow.

**Risk level:** 🟢 **Low** — No JavaScript dependencies, no cross-section coupling, CSS-only change.

