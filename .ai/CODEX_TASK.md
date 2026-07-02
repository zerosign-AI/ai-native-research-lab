# Codex Task: RC7 Frontend Refactoring

## Objective

Analyze and refactor the AI Native Platform Research Lab GitHub Pages frontend for RC7 while preserving all backend and data contracts.

## Required Reading

Before any RC7 code analysis or code change, read:

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
13. `documents/CHANGELOG.md`
14. `documents/ROADMAP.md`

## Non-Negotiable Constraints

- Do not change Apps Script API.
- Do not change Google Spreadsheet schema.
- Do not change API endpoint.
- Do not change JSON response format.
- Do not commit.
- Do not push.
- Analyze and plan before code changes.

## First Analysis Deliverables

Before editing code, provide:

- Current project structure.
- Frontend file responsibility map.
- Apps Script and Spreadsheet contract summary.
- Current Dashboard, Table, Modal, and Design System issues.
- Proposed RC7 file change list.
- Risks and validation plan.

## RC7 Refactoring Focus

Focus on:

- Dashboard clarity and enterprise information density.
- Table renderer reliability and consistency.
- Modal behavior and form safety.
- Design system cleanup.
- CSS duplication reduction.
- Frontend module responsibility clarity.

## Work Product Boundary

For RC7:

- Read documentation from `README.md`, `PRODUCT_PRINCIPLES.md`, `.ai/`, and `documents/`.
- Read `appsscript/` only to understand protected API contracts.
- Refactor only `docs/`.
- Do not move documentation files into `docs/`.
- Do not move frontend source files into `.ai/` or `documents/`.

## Expected Final Deliverables After Code Changes

After approved code changes, provide:

- Changed file list.
- Summary of behavior preserved.
- Validation results.
- Known risks.
- Git diff summary.

Do not commit or push unless the user explicitly asks.
