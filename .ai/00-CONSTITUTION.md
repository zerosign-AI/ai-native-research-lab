# Constitution

This document defines the absolute rules for AI Native Platform Research Lab.

## Non-Negotiable Rules

1. RC7 is a GitHub Pages frontend refactoring effort.
2. Apps Script API must not be changed.
3. Google Spreadsheet schema must not be changed.
4. API endpoint must not be changed.
5. JSON response format must not be changed.
6. Codex must not commit or push unless the user explicitly requests it.
7. Codex must analyze and present a plan before changing code.
8. Scope must not expand beyond AI Native Platform Research Lab.

## Protected Surfaces

The following surfaces are protected contracts:

- Apps Script request handling
- Apps Script response envelope
- Google Spreadsheet sheet names
- Google Spreadsheet column names and order
- API endpoint URL
- JSON top-level response shape
- POST action names and payload expectations

Protected surfaces may be read and documented. They must not be edited during RC7 frontend refactoring.

## Repository Separation

AI development standards and product work products must remain separate:

- Documentation baseline: `README.md`, `PRODUCT_PRINCIPLES.md`, `.ai/`, `documents/`, and `DOCUMENTATION_BLUEPRINT.md`.
- Product work products: `docs/` and `appsscript/`.

RC7 code changes are limited to `docs/`.

`appsscript/` may be used for contract analysis only.

## Allowed RC7 Work

Codex may analyze and refactor the GitHub Pages frontend:

- `docs/index.html`
- `docs/config.js`, without changing `API_URL`
- `docs/assets/css/*`
- `docs/assets/js/*`

Any frontend refactor must preserve visible product behavior unless the user explicitly approves a behavior change.

## Required Sequence

Before code changes:

1. Read the documentation set.
2. Inspect the current file structure.
3. Analyze frontend architecture and data contracts.
4. Present a concrete plan and risk list.
5. Wait for user approval if the user requested planning first.

After code changes:

1. Show changed files.
2. Show validation performed.
3. Show git diff summary.
4. Do not commit.
5. Do not push.

## Failure Conditions

A proposed change fails the constitution if it:

- Alters Apps Script API behavior.
- Requires a Spreadsheet schema migration.
- Changes endpoint configuration.
- Changes JSON response format.
- Introduces a new backend dependency.
- Expands the product beyond Research Lab.
- Commits or pushes without explicit user request.
