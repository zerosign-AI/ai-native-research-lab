# Data Contract

This document defines the frontend-facing data contract.

The contract is owned by Google Apps Script and Google Spreadsheet. RC7 frontend refactoring must preserve it.

## Immutable Contract Rules

- API endpoint must not be changed.
- GET response envelope must not be changed.
- POST request envelope must not be changed.
- POST response envelope must not be changed.
- Spreadsheet sheet names must not be changed.
- Spreadsheet column names and order must not be changed.
- Existing action names must not be renamed.

## Endpoint

The frontend reads the endpoint from:

```js
window.ANP_CONFIG.API_URL
```

RC7 must not replace this endpoint or move endpoint ownership out of `docs/config.js`.

## GET Response

The frontend expects a JSON envelope:

```json
{
  "ok": true,
  "data": {}
}
```

On failure, the frontend expects:

```json
{
  "ok": false,
  "message": "error message"
}
```

## Top-Level Data Collections

The frontend may use these collections from `data`:

- `settings`
- `menu`
- `members`
- `topics`
- `roadmap`
- `decisions`
- `opinions`
- `frameworks`
- `codes`

Frontend code may derive display fields such as member labels, role labels, owner names, author names, or topic titles. Derived fields must not require backend changes.


## Authentication And Authorization

Runtime access is controlled by Google Apps Script and `02_Members`.

- Apps Script Web App must be deployed so Google login is required and the active user email is available.
- `Session.getActiveUser().getEmail()` must match `02_Members.Email` for read access.
- POST mutations additionally require the existing `writeKey` and `userId` request fields.
- The submitted `userId` must identify the same active member whose `Email` matches the Google login account.
- Role authorization uses `02_Members.Role`: `admin` for structural mutations, `member` for own opinions, and `viewer` as read-only.

## POST Request

The frontend sends mutation requests in this shape:

```json
{
  "action": "addOpinion",
  "writeKey": "team write key",
  "userId": "member id",
  "data": {}
}
```

## Allowed Actions

The current Apps Script contract allows create actions:

- `addOpinion`
- `addDecision`
- `addFramework`
- `addRoadmap`
- `addTopic`
- `addMember`

The edit/delete extension allows mutation actions:

- `updateOpinion`
- `deleteOpinion`
- `updateDecision`
- `deleteDecision`
- `updateFramework`
- `deleteFramework`
- `updateRoadmap`
- `deleteRoadmap`
- `updateTopic`
- `deleteTopic`
- `updateMember`
- `deleteMember`

Existing action names must not be renamed or removed.

## POST Response

Successful mutations return:

```json
{
  "ok": true,
  "data": {
    "id": "generated id"
  }
}
```

Failures return:

```json
{
  "ok": false,
  "message": "error message"
}
```

## Spreadsheet Contract

The Spreadsheet is the source of truth.

Frontend code must treat Spreadsheet-driven field names as external contract fields. If frontend code needs cleaner names, it must use adapter or view-model logic without requiring Spreadsheet changes.

## Protected Apps Script Source

Apps Script source under `appsscript/` may be read for contract analysis.

Apps Script may be modified only when the requested feature requires backend mutation support. Such changes must preserve Spreadsheet sheet names, column names, column order, endpoint location, and JSON envelope format.
