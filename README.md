# AI Native Platform Research Lab

AI Native Platform Research Lab is a GitHub Pages based research board for sharing research topics, roadmap items, opinions, decisions, frameworks, and member information.

The platform uses Google Spreadsheet as the source of truth and Google Apps Script as the API provider. The GitHub Pages frontend is the only refactoring target for RC7.

## Runtime Surfaces

- GitHub Pages: static frontend under `docs/`
- Google Apps Script: API implementation under `appsscript/`
- Google Spreadsheet: persistent data source managed by Apps Script

## Repository Structure

```text
.
├── README.md
├── PRODUCT_PRINCIPLES.md
├── DOCUMENTATION_BLUEPRINT.md
├── .ai/
│   ├── 00-CONSTITUTION.md
│   ├── 01-ARCHITECTURE.md
│   ├── 02-DESIGN_SYSTEM.md
│   ├── 03-CODING_STANDARD.md
│   ├── 04-COMPONENT_LIBRARY.md
│   ├── 05-DATA_CONTRACT.md
│   ├── 06-TEST_STANDARD.md
│   ├── 07-REVIEW_STANDARD.md
│   ├── 08-GIT_WORKFLOW.md
│   ├── 09-AI_WORKFLOW.md
│   └── CODEX_TASK.md
├── appsscript/
├── docs/
└── documents/
```

## Documentation And Work Product Separation

The repository separates AI development standards from product work products:

- `README.md`, `PRODUCT_PRINCIPLES.md`, `.ai/`, and `documents/` are the documentation baseline.
- `docs/` is the GitHub Pages frontend work product.
- `appsscript/` is the Apps Script source or reference work product.

For RC7, Codex may analyze all areas but may refactor only the GitHub Pages frontend under `docs/`.

## Start Guide For Codex

Before analyzing or changing code, read the documentation in this order:

1. `README.md`
2. `PRODUCT_PRINCIPLES.md`
3. `.ai/00-CONSTITUTION.md`
4. `.ai/01-ARCHITECTURE.md`
5. `.ai/05-DATA_CONTRACT.md`
6. `.ai/02-DESIGN_SYSTEM.md`
7. `.ai/03-CODING_STANDARD.md`
8. `.ai/04-COMPONENT_LIBRARY.md`
9. `.ai/06-TEST_STANDARD.md`
10. `.ai/07-REVIEW_STANDARD.md`
11. `.ai/08-GIT_WORKFLOW.md`
12. `.ai/09-AI_WORKFLOW.md`
13. `.ai/CODEX_TASK.md`
14. `documents/CHANGELOG.md`
15. `documents/ROADMAP.md`

## Local Inspection

Use these commands to inspect the project without changing it:

```bash
git status --short --branch
rg --files -u
```

Do not commit or push unless the user explicitly requests it.
