# Warm Magazine Middle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing Hexo + landscape blog into a restrained warm-magazine presentation by improving the header, homepage article cards, article reading rhythm, and sidebar visual consistency without changing structure or content organization.

**Architecture:** Keep the implementation CSS-first and centered in `source/css/layout.css`, with `source/css/skin.css` treated as the color compatibility layer and `scripts/blog-index-layout.js` left unchanged as the homepage scope guard. The work should proceed in narrow visual slices so each area can be verified in the running Hexo site before moving to the next one.

**Tech Stack:** Hexo 8, hexo-theme-landscape, custom CSS overrides in `source/css/layout.css`, local validation with `npm run build` and `hexo server`

---

## File Structure

### Primary files

- Modify: `source/css/layout.css`
  - Responsibility: all spacing, radius, shadow, typography, and component-level visual refinements for this middle-strength redesign.

### Reference files

- Reference only: `source/css/skin.css`
  - Responsibility: per-skin background, foreground, link, and border colors that the new layout styling must continue to respect.
- Reference only: `scripts/blog-index-layout.js`
  - Responsibility: homepage and homepage-pagination scoping via `.is-blog-index`; no logic changes planned.

### Verification surfaces

- Manual check: local homepage under the actual Hexo dev root (for example `http://localhost:4000/hexo-site/` in the current setup)
- Manual check: homepage page 2 under the same local dev root
- Manual check: one article detail page from the running site
- Manual check: one non-home list page such as archive, category, or tag
- Command check: `npm run build`

## Task 1: Establish a safer visual baseline in `layout.css`

**Files:**
- Modify: `source/css/layout.css`
- Reference: `source/css/skin.css`

- [ ] **Step 1: Read the current layout tokens and group the areas that will change**

Review these existing sections in `source/css/layout.css`:

```css
:root { ... }
#header { ... }
body.is-blog-index .article { ... }
.article-entry { ... }
.widget { ... }
```

Expected outcome: a clear map of which selectors already own header, home cards, article body, and sidebar styling so new rules can extend instead of fighting them.

- [ ] **Step 2: Create or adjust shared layout tokens for the middle-strength redesign**

Write minimal token changes in `source/css/layout.css` for values such as:

```css
:root {
  --layout-radius: 12px;
  --layout-shadow: 0 6px 20px rgba(50, 35, 20, 0.05);
  --layout-shadow-hover: 0 10px 28px rgba(50, 35, 20, 0.08);
  --layout-outer-pad: clamp(16px, 3.5vw, 32px);
}
```

Use the snippet as a direction reference, not a fixed replacement. Adjust from the current file's baseline rather than force-replacing values mechanically.

Expected outcome: one restrained token set that can be reused across cards, widgets, article shells, and page-level blocks.

- [ ] **Step 3: Run a build to verify the stylesheet still compiles**

Run: `npm run build`

Expected: Hexo generation completes successfully with exit code `0`.

## Task 2: Refine the header into a clearer masthead

**Files:**
- Modify: `source/css/layout.css`

- [ ] **Step 1: Add a failing visual check definition for the header**

Record the target visual assertions before editing:

```text
- Header must feel shorter and cleaner than the current version
- Site title must read as the first layer
- Subtitle must become lighter than the title
- Navigation must feel like a clean third layer, not a leftover theme bar
- Mobile header must stay readable without crowding
```

Expected outcome: a concrete checklist for the header pass.

- [ ] **Step 2: Adjust header height, inner spacing, and title hierarchy**

Implement minimal CSS around selectors such as:

```css
#header { ... }
#header-title { ... }
#logo { ... }
#subtitle { ... }
#main-nav,
#sub-nav { ... }
```

The implementation should prefer spacing, alignment, and typography over decorative additions.

- [ ] **Step 3: Verify the header visually on desktop and mobile-width**

Manual check:
- Open the local homepage under the actual Hexo dev root
- Reduce the viewport to a mobile-ish width in the browser tools or side preview

Expected:
- Desktop: the header reads as a masthead, not a tall legacy banner
- Mobile: title, subtitle, and nav do not overlap or feel cramped

- [ ] **Step 4: Run a build after the header pass**

Run: `npm run build`

Expected: PASS, no stylesheet or render regression.

## Task 3: Tighten homepage cards for the restrained magazine look

**Files:**
- Modify: `source/css/layout.css`
- Reference: `scripts/blog-index-layout.js`

- [ ] **Step 1: Define the failing visual assertions for homepage cards**

Record the homepage-specific target:

```text
- Applies only to homepage and homepage pagination via .is-blog-index
- Cards keep a complete outline but do not feel thick or floaty
- Title must become more prominent than meta
- Summary must feel calmer and easier to scan
- Hover change must stay subtle
```

- [ ] **Step 2: Update homepage card shell, meta rhythm, title scale, and excerpt rhythm**

Implement CSS refinements around selectors such as:

```css
body.is-blog-index .article { ... }
body.is-blog-index .article-meta { ... }
body.is-blog-index .article-title { ... }
body.is-blog-index .article-entry .article-excerpt-auto { ... }
body.is-blog-index .article-footer { ... }
```

Keep the implementation scoped so archive/category/tag list pages are not redesigned at the same strength.

- [ ] **Step 3: Check homepage and page 2 manually**

Manual check:
- Homepage under the actual local Hexo dev root
- Homepage page 2 under the same local root
- One archive, category, or tag list page as a negative regression check

Expected:
- Both pages show the new card language
- The card weight stays restrained
- Titles, meta, and excerpts have clearer hierarchy
- The non-home list page does not accidentally receive homepage-strength card treatment

- [ ] **Step 4: Run a build after the homepage pass**

Run: `npm run build`

Expected: PASS.

## Task 4: Improve article reading rhythm without changing content structure

**Files:**
- Modify: `source/css/layout.css`

- [ ] **Step 1: Define the failing visual assertions for article pages**

Record the article-page target:

```text
- Article body must feel calmer and easier to read over long sessions
- H1/H2/H3 spacing must be clearer
- Paragraphs and lists must keep a comfortable Chinese-reading rhythm
- Images, blockquotes, and code blocks must share one visual language
- Technical content must stay distinguishable
```

- [ ] **Step 2: Refine article shell, typography rhythm, and block element styling**

Implement minimal CSS around selectors such as:

```css
body:not(.is-blog-index) .article-inner { ... }
.article-header { ... }
.article-title { ... }
.article-entry { ... }
.article-entry img { ... }
.article-entry blockquote { ... }
.article-entry .highlight,
.article-entry pre { ... }
```

If `blockquote` has no custom rule yet, add one that matches the restrained warm tone without overpowering code blocks.
If any rule touches the global `.article-entry` selector, re-check homepage excerpts to confirm Task 3 hierarchy still holds.

- [ ] **Step 3: Manually inspect one article detail page**

Manual check:
- Open any generated article page from the running site
- Also do a quick narrow-width pass after the desktop check

Expected:
- The article reads more smoothly
- Heading spacing is clearer
- Images, quotes, and code blocks feel related but still distinct
- The mobile reading rhythm still feels open rather than cramped

- [ ] **Step 4: Run a build after the article pass**

Run: `npm run build`

Expected: PASS.

## Task 5: Unify sidebar widgets while respecting existing homepage hiding logic

**Files:**
- Modify: `source/css/layout.css`
- Reference: `scripts/blog-index-layout.js`

- [ ] **Step 1: Define the failing visual assertions for the sidebar**

Record the sidebar target:

```text
- Sidebar must look quieter and more coherent
- Category, recent posts, and skin switcher should be easiest to notice
- Weakening other widgets must remain CSS-only
- Do not change widget order or template structure
```

- [ ] **Step 2: Update widget shell, title treatment, spacing, and relative emphasis**

Implement CSS refinements around selectors such as:

```css
.widget { ... }
.widget-title { ... }
#sidebar .widget a { ... }
.is-blog-index #sidebar .widget-wrap:has(...) { ... }
```

Only use stable selectors. If stable selectors are not available for relative emphasis, fall back to a more uniform sidebar treatment instead of introducing brittle CSS.

- [ ] **Step 3: Manually inspect sidebar behavior on homepage and article page**

Manual check:
- Homepage under the actual local Hexo dev root
- One article page
- Quick narrow-width check on one of those pages

Expected:
- Homepage still honors the existing hidden-widget behavior
- Remaining widgets feel visually related
- Sidebar does not compete with main content
- Narrow-width spacing still feels stable

- [ ] **Step 4: Run a build after the sidebar pass**

Run: `npm run build`

Expected: PASS.

## Task 6: Tune skin compatibility and finish verification

**Files:**
- Modify: `source/css/layout.css`
- Reference: `source/css/skin.css`

- [ ] **Step 1: Review the new rules against default, dark, and sepia skins**

Check the compatibility points already declared in:

```css
html.skin-dark ...
html.skin-sepia ...
```

Expected outcome: identify any border, shadow, or contrast rules that now feel too strong or too weak after the redesign.

- [ ] **Step 2: Add only the minimal compatibility fixes needed**

Implement narrow overrides such as:

```css
html.skin-dark ... { ... }
html.skin-sepia ... { ... }
```

Do not create a second design system per skin; only rebalance contrast and shadow strength.

- [ ] **Step 3: Run the final build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Perform final manual verification**

Manual checklist:
- Homepage and page 2 match the restrained warm-magazine direction
- A detail page has improved reading rhythm
- One non-home list page remains outside the homepage-strength redesign
- Sidebar remains quiet and coherent
- No structure or content organization changed
- No page feels overly decorative or heavy
- Narrow-width checks do not show crowding or hierarchy collapse

## Suggested commit boundaries

Use small commits after each completed visual slice:

1. `style: refine header hierarchy`
2. `style: polish home article cards`
3. `style: improve article reading rhythm`
4. `style: unify sidebar and skin compatibility`

Only create commits if the user explicitly asks for them.
