# Changelog

All notable documentation and release changes for AI Native Platform Research Lab are tracked here.

## Documentation v1.0

Status: prepared

Changes:

- Added project documentation blueprint.
- Added README start guide.
- Added product principles.
- Added `.ai` documentation set for Codex-guided RC7 work.
- Added protected contract rules for Apps Script, Spreadsheet, endpoint, and JSON response format.
- Added RC7 frontend refactoring task guidance.

## RC7 Frontend Refactoring

Status: implemented locally, not committed

Changes:

- Refactored GitHub Pages frontend under `docs/` only.
- Cleaned up Table renderer behavior and removed legacy non-functional edit affordance.
- Hardened Modal behavior with Escape close, backdrop close, focus handling, and duplicate-submit protection.
- Split Dashboard rendering into smaller frontend render functions.
- Reorganized design-system, layout, and component CSS.
- Reduced CSS patch accumulation and removed negative letter-spacing from maintained CSS.

Protected:

- Apps Script API unchanged.
- Google Spreadsheet schema unchanged.
- API endpoint unchanged.
- JSON response format unchanged.

Validation:

- JavaScript syntax checks passed.
- Git whitespace diff check passed.
- Dashboard and Table render helpers passed Node VM checks.
- Form action names and payload keys matched Apps Script contract.
- Browser smoke test remains pending because local server approval was unavailable.

## Future Entries

Future changes should use this format:

```text
## Version Or Milestone

Status:

Changes:

Protected:
```
