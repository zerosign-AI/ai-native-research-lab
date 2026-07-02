# Coding Standard

This document defines frontend implementation rules for AI Native Platform Research Lab.

## General Rules

- Keep the static GitHub Pages architecture.
- Do not introduce a build step unless the user explicitly approves it.
- Prefer small, focused changes.
- Preserve existing API behavior.
- Preserve existing Spreadsheet-driven data assumptions.
- Avoid unrelated refactors.

## JavaScript Namespace

Use the existing global namespace:

```js
window.ANP = window.ANP || {};
```

Attach modules under `ANP`:

- `ANP.state`
- `ANP.constants`
- `ANP.api`
- `ANP.ui`
- `ANP.pages`
- `ANP.app`

Do not introduce competing global namespaces.

## Rendering Rules

- Escape all user-controlled or Spreadsheet-controlled text before injecting HTML.
- Keep reusable rendering helpers in component-level modules.
- Keep page composition in page-level modules.
- Do not mix API calls directly into generic UI rendering helpers.
- Do not create UI actions that appear enabled but have no behavior.

## State Rules

- Keep frontend state in `ANP.state`.
- Do not store derived display-only values as backend source data.
- Derived fields may be created after data load for rendering convenience.
- Browser localStorage may store session convenience values only.

## API Rules

- Keep `ANP.api` as a thin wrapper around the existing endpoint.
- Do not change `API_URL`.
- Do not change request envelope shape.
- Do not change response envelope expectations.
- Add frontend adapters only when needed to protect UI code from repetition.

## Error Handling

- Show user-facing errors through toast or visible empty/error states.
- Preserve the original API error message when available.
- Do not swallow mutation failures.
- Prevent duplicate submit when a mutation is in progress.

## XSS Safety

- Any value from API data, localStorage, form input, or URL state must be treated as untrusted.
- Use the established escape helper before writing values into HTML strings.
- Prefer `textContent` for direct DOM text updates.

## CSS Rules

- Keep design tokens in `design-system.css`.
- Keep shell and layout primitives in `layout.css`.
- Keep reusable component styles in `components.css`.
- Remove duplicate selector blocks when refactoring.
- Avoid appending patch-style CSS at the end of files.
- Do not use viewport-width scaled font sizes.

## Refactoring Rules

- Refactor around existing behavior first.
- Split large modules only when it improves clear ownership.
- Keep script loading compatible with static HTML.
- Do not require bundling, transpilation, or package installation.
