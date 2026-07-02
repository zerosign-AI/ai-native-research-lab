# Test Standard

This document defines validation standards for AI Native Platform Research Lab.

The project may not always have automated tests. When automated tests are unavailable, Codex must perform and report practical validation.

## Validation Priorities

1. Contract preservation.
2. Frontend runtime safety.
3. Dashboard rendering.
4. Table rendering.
5. Modal and form behavior.
6. Responsive layout.
7. Accessibility basics.

## Static Validation

Run static inspection when possible:

```bash
rg --files -u
git diff --check
```

For JavaScript changes, inspect syntax with available local tools when practical. Do not add a new toolchain only for validation unless the user approves.

## Browser Smoke Test

When frontend files are changed, verify:

- Page loads without console-breaking syntax errors.
- Navigation changes visible content.
- Topic selector does not break rendering.
- Dashboard renders with loaded or mocked data.
- Empty states render without layout breakage.
- Toast root and dialog root exist.

## API Contract Regression

Before and after frontend refactoring, verify that code still expects:

- `ok`
- `message`
- `data`
- `settings`
- `menu`
- `members`
- `topics`
- `roadmap`
- `decisions`
- `opinions`
- `frameworks`
- `codes`

Verify that mutation requests still send:

- `action`
- `writeKey`
- `userId`
- `data`

## Dashboard Checks

Verify:

- Overall metrics render.
- Current roadmap section handles missing roadmap data.
- Recent lists handle empty arrays.
- Quick action buttons open the expected forms.

## Table Checks

Verify:

- Headers align with cells.
- Long text truncates instead of breaking layout.
- Status badges render.
- Progress values clamp safely.
- Empty state appears when rows are empty.
- Action buttons appear only when behavior exists.

## Modal And Form Checks

Verify:

- Required fields are enforced.
- Select options come from API data.
- Confirm action submits the correct payload shape.
- Cancel action closes the dialog.
- Failed mutation shows an error.
- Successful mutation reloads data or updates state consistently.

## Responsive Checks

Check at least:

- Desktop width.
- Tablet-like width.
- Mobile-like width.

Verify that text does not overlap controls and table overflow remains usable.

## Reporting

Every validation report must state:

- Commands or checks performed.
- What passed.
- What could not be verified.
- Any remaining risk.
