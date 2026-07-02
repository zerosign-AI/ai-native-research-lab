# Review Standard

This document defines review criteria for AI Native Platform Research Lab.

Reviews must prioritize bugs, regressions, contract violations, and missing validation.

## Review Priority

1. Contract violations.
2. Runtime errors.
3. Data loss or mutation mistakes.
4. Security and escaping risks.
5. UI regressions.
6. Maintainability issues.
7. Documentation drift.

## Contract Review

Confirm that changes do not alter:

- Apps Script API behavior.
- Spreadsheet schema assumptions.
- API endpoint.
- JSON envelope.
- POST action names.
- POST payload keys.

## Runtime Review

Check for:

- Undefined module references.
- Script load order problems.
- Missing DOM nodes.
- Broken event bindings.
- Async error paths that leave the UI stuck.

## Security Review

Check for:

- Unescaped Spreadsheet data inserted into HTML.
- Unescaped form values inserted into HTML.
- Unsafe URL-derived values.
- LocalStorage values treated as trusted.

## UI Review

Check:

- Dashboard density and hierarchy.
- Table readability and overflow.
- Modal keyboard and close behavior.
- Form validation clarity.
- Toast usefulness.
- Mobile layout integrity.

## Maintainability Review

Check:

- Large modules split only when ownership becomes clearer.
- Repeated CSS selectors reduced.
- Patch-style CSS appendices removed.
- Component behavior kept reusable.
- Page-specific logic kept out of generic helpers.

## Documentation Review

Check that implementation remains consistent with:

- `.ai/00-CONSTITUTION.md`
- `.ai/01-ARCHITECTURE.md`
- `.ai/02-DESIGN_SYSTEM.md`
- `.ai/03-CODING_STANDARD.md`
- `.ai/04-COMPONENT_LIBRARY.md`
- `.ai/05-DATA_CONTRACT.md`

If code and documentation conflict, report the conflict before changing scope.
