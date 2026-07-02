# Component Library

This document defines expected frontend component responsibilities.

It does not define backend contracts or CSS token values.

## Dashboard Components

Dashboard components should render:

- Research scope summary.
- Roadmap progress.
- Current roadmap item.
- Recent decisions.
- Recent opinions.
- Recent frameworks.
- Quick actions connected to implemented forms.

Dashboard components must consume existing API collections and may derive frontend-only view models.

## Table Renderer

The table renderer should accept:

- Rows.
- Column definitions.
- Optional action definitions.
- Empty-state copy.

Column definitions may include:

- Key.
- Label.
- Width.
- Cell type.
- Formatter.

The table renderer must:

- Escape cell values.
- Clamp long text.
- Preserve readable headers.
- Avoid showing action buttons without handlers.
- Support horizontal overflow for dense datasets.

## Modal Manager

The modal manager should own:

- Rendering dialog shell.
- Confirm and cancel actions.
- Close behavior.
- Keyboard behavior.
- Focus handling.
- Duplicate-submit protection when used for mutation.

Modals should not own API contract details.

## Form Fields

Form field helpers should support:

- Text input.
- Number input.
- Select.
- Textarea.
- Required labels.
- Placeholder text.
- Current value.

Form helpers must not change payload keys expected by Apps Script.

## Toolbar And Filter

Toolbars should combine:

- Section title.
- Optional description.
- Optional filter input.
- Optional primary action.

Filters should update frontend state only and must not require API changes.

## Badge

Badges should represent semantic status only.

Status mapping should be centralized so that the same status has the same visual treatment across pages.

## Progress

Progress indicators should:

- Clamp values to 0 through 100.
- Show a readable numeric value.
- Avoid layout shift when values change.

## Toast

Toast behavior should be reusable and should not contain page-specific logic.

Toast messages should be short, clear, and triggered by completed user actions or errors.
