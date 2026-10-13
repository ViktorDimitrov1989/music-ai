---
name: visual-snapshot-tests
description: 'Require image-based snapshot Cypress component tests for every significant frontend change using @pixsame/cypress-plugin-visual-regression-diff. Use when changing, adding, or restyling a React component, page, layout, CSS, or UI state in frontend/, or when asked to add visual regression, snapshot, matchImage, or screenshot tests.'
---

# Visual Snapshot Tests for Frontend Changes

Every significant change in `frontend/` MUST be covered by a Cypress component test that calls `matchImage()` (package `@pixsame/cypress-plugin-visual-regression-diff`, already installed and configured in `frontend/cypress.config.ts` and `frontend/cypress/support/component.ts`).

Significant = new component/page, new visible state (empty, loading, error, signed-in/out), layout or style changes, copy changes. Trivial = refactors with no visual effect.

## Procedure

1. Identify each visible component or state touched by the change.
2. For each, add or update a spec in `frontend/cypress/component/<Name>.cy.tsx`, one `it` per state, named `<action> → <outcome>`.
3. Mount the component (wrap in `ClerkProvider` as in `HomePage.cy.tsx` if it needs auth context). Stub network calls with `cy.intercept` so renders are deterministic.
4. Assert key content first, then snapshot a stable target:
   ```tsx
   cy.get('[data-testid="..."]').matchImage()
   ```
   Give every snapshot a unique `title` option when an `it` has more than one: `matchImage({ title: 'empty state' })`.
5. Avoid flakiness: no timestamps/random data, wait for fonts and images to load, disable animations, keep a fixed viewport (`cy.viewport(1280, 720)`).
6. Run from `frontend/`: `npm run test:component`. First run creates baselines under `cypress/snapshots`.
7. For intentional visual changes, review the diff images, then update baselines with `npx cypress run --component --env pluginVisualRegressionUpdateImages=true`.
8. Commit new/updated baseline images together with the code change.

## Completion checks

- Every changed visual component/state has a `matchImage()` call.
- Tests pass with no unreviewed diff images (`*.diff.png`) left behind.
- Baselines are committed; diff and actual images are not.
