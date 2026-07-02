# Design System

The AI Native Platform Research Lab UI should feel like a practical enterprise research workspace.

It should prioritize scanning, comparison, status awareness, and repeated use over marketing-style presentation.

## Visual Tone

- Calm, dense, operational, and readable.
- Avoid decorative hero sections.
- Avoid oversized marketing typography.
- Avoid one-note color palettes.
- Use visual hierarchy to make research status and next actions clear.

## Layout

- Use a stable app shell with sidebar navigation and a main content area.
- Dashboard content should be arranged for scanning.
- Tables should remain readable on desktop and horizontally scroll on narrow screens when needed.
- Mobile layouts should stack controls predictably.
- Cards should be used for discrete repeated items, dashboard widgets, and modal surfaces.

## Spacing

- Use a small, consistent spacing scale.
- Prefer compact enterprise spacing over spacious landing-page spacing.
- Avoid nested cards.
- Avoid layout shifts when filters, buttons, badges, or long text change.

## Typography

- Use Korean-first text rendering.
- Keep interface copy concise.
- Avoid negative letter spacing in new CSS.
- Reserve large headings for page-level titles.
- Use compact headings inside cards, tables, dialogs, and toolbars.

## Color

- Use neutral surfaces for primary work areas.
- Use status colors only for semantic state.
- Preserve sufficient contrast for text, controls, and badges.
- Do not use decorative gradients as a primary design element.

## Radius And Elevation

- Prefer modest border radius for enterprise UI.
- Avoid excessive rounding on ordinary controls.
- Use elevation only when it clarifies layering, such as dialogs or toasts.

## Dashboard

The dashboard should communicate:

- Current research scope.
- Active roadmap state.
- Progress summary.
- Recent decisions.
- Recent opinions.
- Recent frameworks.
- Immediate next actions.

Dashboard widgets must not require new API fields.

## Table

Tables should support:

- Stable column definitions.
- Long text truncation with accessible titles.
- Empty state.
- Responsive horizontal scroll.
- Status badges.
- Progress display.
- Clear action affordances only when actions are implemented.

## Modal

Modals should support:

- Clear title.
- Focusable controls.
- Confirm and cancel actions.
- Escape key close behavior when safe.
- Backdrop close behavior when safe.
- Submit loading or duplicate-submit protection for mutations.

## Forms

Forms should:

- Mark required fields.
- Use existing codes and members from API data.
- Validate required fields before mutation.
- Keep payload keys compatible with Apps Script.
- Show success and error feedback.

## Toast

Toasts should:

- Be short and action-specific.
- Distinguish success, warning, and error.
- Avoid hiding critical failure details.

## Accessibility

Frontend UI should preserve:

- Keyboard navigation.
- Visible focus states.
- Dialog semantics.
- Sufficient color contrast.
- Meaningful labels for form controls.
