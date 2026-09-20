# SEO & Social Discovery — Implementation Plan

Date: **2026-09-21**  
Branch: `feature/seo-social`

## 1. Goal

Improve discoverability and link previews for Awesome Echocardiography without changing the scientific content of the site.

This feature standardizes page metadata, canonical URLs, language alternates, sitemap/robots behavior, and a deterministic social-preview card.

## 2. Non-goals

This PR will not:

- add/remove papers or datasets;
- change code-status labels;
- change Reference Metrics semantics;
- add citation/DOI metadata beyond the already merged citation feature;
- add monitoring or candidate discovery automation;
- change Vercel deployment architecture.

## 3. Site authority

Canonical site origin:

`https://awesome-echocardiography.vercel.app`

All canonical/OG URLs and sitemap output must derive from this authority.

## 4. SEO component

Add a reusable `SeoHead.astro` component supporting:

- page title;
- page description;
- canonical URL;
- Chinese/English alternate URLs;
- `og:title`;
- `og:description`;
- `og:type=website`;
- `og:url`;
- `og:site_name`;
- deterministic social card;
- Twitter card metadata;
- basic WebSite JSON-LD on the homepage.

Pages to adopt it:

- homepage Chinese/English;
- Papers Chinese/English;
- Research Map Chinese/English;
- Metrics Chinese/English;
- dataset detail pages Chinese/English.

## 5. Sitemap / robots

- Set Astro `site` to the canonical origin.
- Add `@astrojs/sitemap`.
- Add `public/robots.txt` referencing the sitemap.
- Ensure private Preview URLs are not written into production metadata.

## 6. Social card

Create a simple deterministic PNG in `public/og-card.png`:

- title: Awesome Echocardiography;
- subtitle: Curated research index for AI in echocardiography;
- no paper-ranking claims;
- no personal portrait/logo;
- fixed 1200×630;
- legible on dark/light social surfaces.

The card is a site identity asset, not scientific evidence.

## 7. Checklist

### A. Planning
- [x] Create isolated worktree from current `origin/main`.
- [x] Write this plan before implementation.
- [x] Open PR with this plan as first commit.

### B. Core SEO
- [x] Set canonical Astro `site`.
- [x] Add sitemap integration.
- [x] Add reusable `SeoHead.astro`.
- [x] Add canonical URL metadata.
- [x] Add hreflang/x-default metadata.
- [x] Add Open Graph metadata.
- [x] Add Twitter card metadata.
- [x] Add homepage WebSite JSON-LD.

### C. Page integration
- [x] Home pages use shared SEO head.
- [x] Papers pages use shared SEO head.
- [x] Research Map pages use shared SEO head.
- [x] Metrics pages use shared SEO head.
- [x] Dataset detail pages use shared SEO head.
- [x] No page keeps conflicting duplicate canonical/hreflang metadata.

### D. Discovery assets
- [x] Add `robots.txt`.
- [x] Add deterministic 1200×630 social card.
- [x] Production build emits `sitemap-index.xml` or equivalent sitemap output.
- [x] robots.txt points to production sitemap.

### E. Validation
- [x] `npm run build` returns 0 errors, 0 warnings, 0 hints.
- [x] Homepage canonical points to production origin.
- [x] Chinese/English Papers canonical and alternates are correct.
- [x] Map, Metrics, and dataset routes have correct canonicals.
- [x] OG image resolves from the canonical production origin.
- [x] No localhost/Vercel Preview host appears in built metadata.
- [x] Homepage remains 3 featured papers.
- [x] Papers page remains 10 public papers.
- [x] Reference Metrics v1.1 tests/build remain unaffected.
- [x] Mobile site navigation/content does not regress.

### F. Delivery
- [ ] Push implementation to feature branch.
- [ ] PR build CI passes.
- [ ] Reference-metrics regression remains green.
- [ ] Vercel Preview passes.
- [ ] Preview metadata verified before merge.
- [ ] Squash-merge only on clean exact head.
- [ ] Production deployment succeeds.
- [ ] Production sitemap/robots/OG card return HTTP 200.
- [ ] Close checklist with delivery evidence.

## 8. Delivery standard

Complete only when:

1. important public pages emit consistent canonical/social metadata;
2. language alternates remain correct;
3. production has a crawlable sitemap and robots policy;
4. social card is deterministic and publicly reachable;
5. no scientific/catalog/metrics semantics change;
6. CI, Preview, and Production are green.

## 9. Rollback conditions

Do not merge if:

- canonical URLs use Preview/local hosts;
- Chinese/English alternates point to wrong routes;
- sitemap omits primary public routes;
- social image is missing or broken;
- metrics regression fails;
- paper membership changes.
