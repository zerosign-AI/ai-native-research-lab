# Architecture

AI Native Platform Research Lab has three runtime surfaces:

- GitHub Pages frontend
- Google Apps Script API
- Google Spreadsheet data store

RC7 only targets the GitHub Pages frontend.

## System Boundary

```text
Browser
  |
  | GET / POST
  v
Google Apps Script Web App
  |
  | SpreadsheetApp
  v
Google Spreadsheet
```

The frontend consumes API data and renders the product experience. Apps Script owns API behavior. Google Spreadsheet owns persistence.

## Frontend Structure

Expected GitHub Pages files:

```text
docs/
├── index.html
├── config.js
└── assets/
    ├── css/
    │   ├── design-system.css
    │   ├── layout.css
    │   └── components.css
    └── js/
        ├── app.js
        ├── core/
        │   ├── api.js
        │   └── state.js
        ├── components/
        │   └── ui.js
        └── pages/
            └── pages.js
```

## Repository Zones

```text
.
├── README.md                         # project entry guide
├── PRODUCT_PRINCIPLES.md             # product philosophy
├── DOCUMENTATION_BLUEPRINT.md        # documentation design
├── .ai/                              # Codex and AI development standards
├── documents/                        # roadmap and changelog
├── docs/                             # GitHub Pages frontend work product
└── appsscript/                       # Apps Script source or reference
```

The `.ai/` and `documents/` directories are not deployable frontend work products.

The `docs/` directory is the frontend work product and the RC7 implementation target.

The `appsscript/` directory is a protected backend contract reference for RC7.

## Module Responsibilities

- `index.html`: static shell, script order, root DOM nodes.
- `config.js`: runtime config, including API endpoint and app version.
- `core/api.js`: frontend API wrapper only.
- `core/state.js`: global frontend state and constants.
- `components/ui.js`: reusable UI rendering helpers and component behavior.
- `pages/pages.js`: page-level composition and page-specific form configuration.
- `app.js`: initialization, data loading, navigation, topic selection, rendering orchestration.
- CSS files: visual tokens, layout primitives, component styling.

## Dependency Rules

Allowed:

- Browser-native JavaScript.
- Static CSS.
- Existing font CDN already referenced by the frontend.

Forbidden unless the user explicitly approves:

- New build systems.
- New package managers.
- New runtime frameworks.
- New backend services.
- New API gateways.
- New Spreadsheet schema dependencies.

## Ownership Boundaries

Frontend may derive view models from API data, but it must not require backend response changes.

Apps Script may be inspected to understand contracts, but must not be edited during RC7 frontend refactoring.

Spreadsheet structure may be documented, but must not be changed.
