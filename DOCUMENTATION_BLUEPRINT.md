# AI Native Platform Documentation Blueprint v1.0

## 1. Purpose

This blueprint defines the documentation set required before Codex analyzes and refactors the AI Native Platform Research Lab frontend for RC7.

The documentation must let Codex understand the product intent, non-negotiable constraints, frontend architecture, UI standards, data contracts, coding rules, review rules, and execution workflow without expanding the project scope.

## 2. Project Scope

This documentation set applies only to the AI Native Platform Research Lab project.

The project is a GitHub Pages frontend connected to Google Apps Script and Google Spreadsheet.

The RC7 refactoring scope is frontend-only:

- GitHub Pages frontend may be analyzed and refactored.
- Apps Script API must not be changed.
- Google Spreadsheet schema must not be changed.
- API endpoint must not be changed.
- JSON response format must not be changed.
- Commit and push must not be performed by Codex unless the user explicitly asks later.

## 3. Documentation Rules

Each document must have one primary responsibility.

Documents must not duplicate detailed rules from other documents. A document may reference another document when a rule belongs elsewhere.

The documentation must be practical for AI-assisted code analysis and refactoring. It must avoid generic product-management, branding, or engineering content that is not directly useful for this repository.

## 3.1 Documentation And Work Product Separation

The repository must keep AI development standards separate from deployable or operational product work products.

Documentation baseline:

- `README.md`
- `PRODUCT_PRINCIPLES.md`
- `DOCUMENTATION_BLUEPRINT.md`
- `.ai/`
- `documents/`

Product work products:

- `docs/`
- `appsscript/`

RC7 documentation may guide analysis across the repository, but RC7 implementation changes must be limited to `docs/` unless the user explicitly changes the scope.

## 4. Document Set

### README.md

Role:

- Introduce the project and provide the minimum start guide.

Must include:

- Project name and purpose.
- Runtime surfaces: GitHub Pages, Apps Script, Google Spreadsheet.
- Repository structure overview.
- Where Codex should start reading.
- Basic local inspection guide.

Must not include:

- Product philosophy details.
- Absolute engineering rules.
- Component specs.
- Detailed data schema.
- RC7 task instructions.

### PRODUCT_PRINCIPLES.md

Role:

- Define product philosophy only.

Must include:

- Research Lab purpose.
- Enterprise product orientation.
- Korean-first collaboration principle.
- Small decision accumulation principle.
- Distinction between opinion, decision, roadmap, framework, and member management.

Must not include:

- Code structure.
- API contracts.
- CSS rules.
- Git rules.
- Codex execution steps.

### .ai/00-CONSTITUTION.md

Role:

- Define absolute project rules.

Must include:

- Frontend-only RC7 refactoring boundary.
- No Apps Script API changes.
- No Spreadsheet schema changes.
- No API endpoint changes.
- No JSON response format changes.
- No commit or push without explicit user request.
- Documentation and code-change sequencing rules.

Must not include:

- UI component details.
- Implementation patterns.
- Test procedures beyond absolute pass/fail gates.
- Product philosophy narrative.

### .ai/01-ARCHITECTURE.md

Role:

- Define structure, dependencies, and ownership boundaries.

Must include:

- GitHub Pages frontend structure.
- Apps Script and Spreadsheet as external contract providers.
- Frontend module responsibilities.
- Allowed and forbidden dependencies.
- File ownership boundaries for RC7.

Must not include:

- Product philosophy.
- CSS token details.
- Full API schema tables.
- Review checklist details.

### .ai/02-DESIGN_SYSTEM.md

Role:

- Define UI standards.

Must include:

- Visual density and enterprise dashboard tone.
- Layout, spacing, typography, color, border radius, elevation, responsive behavior.
- Dashboard, table, modal, form, badge, toast, navigation UI rules.
- Accessibility expectations for frontend UI.

Must not include:

- JavaScript implementation patterns.
- API payload rules.
- Git workflow.
- Product roadmap.

### .ai/03-CODING_STANDARD.md

Role:

- Define implementation rules.

Must include:

- JavaScript namespace and module conventions.
- DOM rendering rules.
- State handling rules.
- Error handling rules.
- Escaping and XSS safety rules.
- CSS organization rules.
- Refactoring constraints for existing static GitHub Pages setup.

Must not include:

- UI visual design values except as references to DESIGN_SYSTEM.
- Full data contract details.
- Test checklist details.
- Git commands.

### .ai/04-COMPONENT_LIBRARY.md

Role:

- Define expected frontend component responsibilities.

Must include:

- Dashboard component expectations.
- Table renderer expectations.
- Modal manager expectations.
- Form field expectations.
- Toolbar, filter, badge, progress, toast behavior.
- Component inputs and outputs at a frontend level.

Must not include:

- Spreadsheet schema ownership.
- Apps Script implementation.
- CSS token source of truth.
- Git workflow.

### .ai/05-DATA_CONTRACT.md

Role:

- Define frontend-facing data contracts without changing backend contracts.

Must include:

- API endpoint immutability rule.
- GET response envelope rule.
- POST request envelope rule.
- Allowed action names.
- Expected top-level data collections.
- Frontend adapter/view-model rules.
- Spreadsheet schema immutability rule.

Must not include:

- Apps Script refactoring instructions.
- Spreadsheet migration instructions.
- UI layout rules.
- General coding style rules.

### .ai/06-TEST_STANDARD.md

Role:

- Define validation standards.

Must include:

- Static frontend validation.
- Browser smoke-test scope.
- API contract regression checks.
- Dashboard/table/modal/form verification.
- Responsive layout checks.
- Manual verification checklist when automated tests are unavailable.

Must not include:

- Product philosophy.
- Detailed component API design.
- Git branching rules.
- New test framework mandate.

### .ai/07-REVIEW_STANDARD.md

Role:

- Define review criteria.

Must include:

- Review priority order.
- Contract-preservation review.
- UI regression review.
- Security and escaping review.
- Maintainability review.
- Documentation consistency review.

Must not include:

- Test execution details beyond review evidence requirements.
- Product roadmap.
- Git command workflow.
- Component implementation details.

### .ai/08-GIT_WORKFLOW.md

Role:

- Define Git handling rules.

Must include:

- No commit/push default rule.
- Status and diff inspection expectations.
- Handling untracked files.
- Branch/commit behavior only when user explicitly asks.
- What to report after documentation or code changes.

Must not include:

- Coding standards.
- UI design rules.
- Product philosophy.
- API schema details.

### .ai/09-AI_WORKFLOW.md

Role:

- Define how Codex should work on this project.

Must include:

- Required reading order.
- Analysis-before-edit rule.
- Planning-before-refactor rule.
- Scope-control rule.
- How to ask clarifying questions.
- How to report findings and risks.

Must not include:

- Full product principles.
- Detailed CSS or JS implementation rules.
- Git command reference except as references to GIT_WORKFLOW.

### .ai/CODEX_TASK.md

Role:

- Define the active Codex execution instruction for RC7.

Must include:

- RC7 objective.
- Required reading list.
- Current non-negotiable constraints.
- First analysis deliverables before code changes.
- Expected final deliverables after code changes.

Must not include:

- Broad product philosophy.
- Full architecture documentation.
- Full design system documentation.
- Git workflow details beyond no commit/push.

### documents/CHANGELOG.md

Role:

- Track project documentation and release changes.

Must include:

- Documentation v1.0 entry.
- RC7 planned entry.
- Later change entries by version/date.

Must not include:

- Long-form design rationale.
- Code standards.
- Product principles.
- Execution prompts.

### documents/ROADMAP.md

Role:

- Track project roadmap only.

Must include:

- RC7 refactoring milestone.
- RC8/RC9/v1.0 high-level direction.
- Documentation readiness as a prerequisite.

Must not include:

- Detailed task checklist for Codex.
- Code architecture details.
- Data schema.
- Review checklist.

## 5. Duplication Control

The following ownership rules prevent duplication:

- Product why belongs in PRODUCT_PRINCIPLES.md.
- Absolute rules belong in .ai/00-CONSTITUTION.md.
- File structure and dependencies belong in .ai/01-ARCHITECTURE.md.
- Visual UI rules belong in .ai/02-DESIGN_SYSTEM.md.
- Implementation rules belong in .ai/03-CODING_STANDARD.md.
- Reusable frontend component behavior belongs in .ai/04-COMPONENT_LIBRARY.md.
- Backend/API/Spreadsheet contracts belong in .ai/05-DATA_CONTRACT.md.
- Verification rules belong in .ai/06-TEST_STANDARD.md.
- Review criteria belong in .ai/07-REVIEW_STANDARD.md.
- Git behavior belongs in .ai/08-GIT_WORKFLOW.md.
- Codex working method belongs in .ai/09-AI_WORKFLOW.md.
- Active task instructions belong in .ai/CODEX_TASK.md.
- Release history belongs in documents/CHANGELOG.md.
- Future milestones belong in documents/ROADMAP.md.

## 6. Required Reading Order For Codex

Codex must read documents in this order before RC7 code analysis:

1. README.md
2. PRODUCT_PRINCIPLES.md
3. .ai/00-CONSTITUTION.md
4. .ai/01-ARCHITECTURE.md
5. .ai/05-DATA_CONTRACT.md
6. .ai/02-DESIGN_SYSTEM.md
7. .ai/03-CODING_STANDARD.md
8. .ai/04-COMPONENT_LIBRARY.md
9. .ai/06-TEST_STANDARD.md
10. .ai/07-REVIEW_STANDARD.md
11. .ai/08-GIT_WORKFLOW.md
12. .ai/09-AI_WORKFLOW.md
13. .ai/CODEX_TASK.md
14. documents/CHANGELOG.md
15. documents/ROADMAP.md

## 7. Confirmation Gate

This blueprint must be reviewed and confirmed before the remaining documentation files are generated.

After confirmation, the documentation generation step must create only the files listed in this blueprint and must not add extra project scope.
