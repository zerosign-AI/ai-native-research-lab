# Git Workflow

This document defines Git handling rules for Codex.

## Default Rule

Codex must not commit or push unless the user explicitly requests it.

Documentation and code changes may be made locally when requested, but they must remain uncommitted by default.

## Before Work

Inspect status:

```bash
git status --short --branch
```

If there are existing changes, treat them as user-owned unless Codex made them in the current task.

## During Work

- Do not revert user changes.
- Do not delete untracked files unless the user explicitly asks.
- Do not run destructive Git commands.
- Keep changes scoped to the requested task.

## After Work

Report:

- Changed files.
- Important untracked files.
- Validation performed.
- Git diff summary.

Useful inspection commands:

```bash
git status --short
git diff --stat
git diff --name-status
```

## Branches And Commits

Only create branches, stage files, commit, or push when the user explicitly asks for those actions.

When a commit is requested, inspect the diff first and confirm the commit includes only intended files.
