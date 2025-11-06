# Update Log Navigation Flow Audit

## Overview
This document summarizes how "Return to table" navigation currently works when
browsing detail views and the update log. It identifies each component that
mutates the `previousTableUrls` stack and describes how a detail view decides the
route to navigate back to.

## Core State Container
- **File:** `frontend/src/components/Page.tsx`
- **Responsibility:** exposes `previousTableUrls` via `PageContext`. The stack is
  initialised to an empty array whenever a new `PageContextProvider` is mounted
  (i.e. when navigating between entity pages such as Locality → Reference).

## Return Logic
- **File:** `frontend/src/components/DetailView/components.tsx`
- **Component:** `ReturnButton`
- **Behaviour:**
  - If the detail view is in staging mode, it switches the editing mode instead
    of navigating.
  - Otherwise it pops the last entry from `previousTableUrls` and calls
    `navigate(previousUrl, { relative: 'path' })`.
  - When the stack is empty it falls back to
    `navigate(location.pathname.substring(0, location.pathname.indexOf('/', 1)),
    { relative: 'path' })`, i.e. it trims the current path to the first segment
    ("/reference" for `/reference/123`).

## Places That Push to `previousTableUrls`
| File | Component | Trigger | Value pushed |
| ---- | --------- | ------- | ------------- |
| `frontend/src/components/DetailView/common/SimpleTable.tsx` | `SimpleTable` | Clicking a row in read mode | ``${location.pathname}?tab=${searchParams.get('tab')}`` |
| `frontend/src/components/TableView/ActionComponent.tsx` | `ActionComponent` (detail button) | Clicking the action button when `selectorFn` and `tableRowAction` are undefined | ``${location.pathname}?tab=${searchParams.get('tab')}`` |
| `frontend/src/components/TableView/TableView.tsx` | `TableView` | Clicking a table row when `clickableRows` is true | ``${location.pathname}?&columnfilters=...&sorting=...&pagination=...`` |
| `frontend/src/components/TableView/TableToolBar.tsx` | `TableToolBar` | Clicking the "New" button | ``${location.pathname}`` |

## Navigation Gaps Identified
- **File:** `frontend/src/components/DetailView/common/UpdateTab.tsx`
  - The `ReferenceList` renders `<Link to={`/reference/${ref.rid}`}>` inside the
    update details modal. This link does **not** push any entry to the
    `previousTableUrls` stack. Because navigating to `/reference/:id` mounts a
    new `PageContextProvider`, the stack is reset. Consequently pressing
    "Return to table" on the reference detail page falls back to the default
    segment (`/reference`).
  - The observed user bug (returning to the Localities table instead of the
    update log) stems from this missing stack update. Depending on how the
    router resolves `{ relative: 'path' }`, the fallback can resolve to the
    Localities table when navigating from certain nested routes.

## Additional Observations
- **File:** `frontend/src/components/TableView/ActionComponent.tsx`
  - Uses the global `location` object (not the React Router hook), which relies
    on browser globals being available and could complicate testing.
- **File:** `frontend/src/components/TableView/TableView.tsx`
  - Persists table state parameters in the URL before navigating to a detail
    page and restores them on return.

These findings cover all components that currently influence the "Return to
table" behaviour and highlight the missing state propagation when navigating
from update log reference links.
