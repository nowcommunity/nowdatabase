# Routing & Unsaved Changes

This frontend uses React Router v6 in **data router mode** (`createBrowserRouter` + `RouterProvider`). This enables `useBlocker` and related APIs for navigation interception.

## Data Router Basics
- Entry point: `frontend/src/router/index.tsx` exports the router created with `createBrowserRouter` and is consumed by `RouterProvider` in `frontend/src/main.tsx`.
- Global layout: `App` renders global chrome and an `Outlet` for child routes.
- When adding routes, define them in `router/index.tsx` using the data-router configuration (array or `createRoutesFromElements`).

## Enabling Unsaved-Changes Prompts
Unsaved-change blocking is provided by `UnsavedChangesProvider` and the `useUnsavedChangesPrompt` hook.

**Provider**
- Wrap any page containing a form or editable detail view with `UnsavedChangesProvider`.
- The provider listens to `useBlocker` and renders the shared confirmation dialog.

**Hook**
- In a form component, call `const { setDirty } = useUnsavedChangesPrompt(isDirty)` where `isDirty` comes from your form state (`react-hook-form`’s `formState.isDirty`, etc.).
- Set dirty to `false` immediately before/after a successful submit so navigation to the next page isn’t blocked.
- If submit fails, set dirty back to `true` so protection remains while the user fixes errors.

### Minimal Example
```tsx
import { useForm } from 'react-hook-form';
import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider';
import { useUnsavedChangesPrompt } from '@/hooks/useUnsavedChangesPrompt';

export const ExampleFormPage = () => {
  const { handleSubmit, formState: { isDirty }, reset } = useForm();
  const { setDirty } = useUnsavedChangesPrompt(isDirty);

  const onSubmit = handleSubmit(async values => {
    setDirty(false);
    try {
      await save(values);
      reset(values);
    } catch {
      setDirty(true);
      throw new Error('Save failed');
    }
  });

  return (
    <UnsavedChangesProvider>
      <form onSubmit={onSubmit}>
        {/* form fields */}
        <button type="submit">Save</button>
      </form>
    </UnsavedChangesProvider>
  );
};
```

### Detail Views
- For detail pages that use shared context (e.g., `DetailView`), place the provider at the page level and wire `useUnsavedChangesPrompt` to the context’s `isDirty` flag inside a small tracker component.

## Notes
- `useBlocker` requires the data router; ensure new routes continue to use `createBrowserRouter`.
- The dialog text can be customized via `UnsavedChangesProvider` props or by passing a `message` option to `useUnsavedChangesPrompt`.
