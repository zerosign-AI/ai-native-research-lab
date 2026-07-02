# AI Workflow

This document defines how Codex should work on AI Native Platform Research Lab.

## Required Reading Order

Before RC7 code analysis, read:

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
12. `.ai/CODEX_TASK.md`
13. `documents/CHANGELOG.md`
14. `documents/ROADMAP.md`

## Analysis Before Editing

Codex must analyze before editing when the task involves RC7 refactoring.

The analysis must include:

- Current project structure.
- Relevant frontend files.
- Apps Script contract touchpoints.
- Spreadsheet schema assumptions.
- API request and response assumptions.
- Risk list.
- Proposed file changes.

## Planning Before Refactor

Before code edits, Codex should present a plan that identifies:

- Files to change.
- Files not to change.
- Expected behavior preservation.
- Validation approach.

## Scope Control

Codex must not expand the project into:

- A new backend.
- A new frontend framework.
- A new data model.
- A new deployment system.
- A new product domain.

## Clarifying Questions

Ask the user only when:

- A protected contract appears inconsistent.
- Required source files are missing.
- The requested change conflicts with the constitution.
- The change requires product behavior decisions not covered by documentation.

## Reporting Style

Reports should include:

- What was inspected.
- What was found.
- What will change or changed.
- What risks remain.
- What validation was performed.

Do not hide contract risks behind implementation details.
