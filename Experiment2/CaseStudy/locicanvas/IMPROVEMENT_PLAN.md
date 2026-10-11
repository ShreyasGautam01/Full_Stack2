# LociCanvas v2 — Improvement Plan

**Status:** Phase 0 — discovery and architecture plan  
**Scope:** `Experiment2/CaseStudy/locicanvas`  
**Planning branch:** `project-improvement/locicanvas-v2-roadmap`  
**Baseline branch:** `main` (kept unchanged by this planning phase)

## Product direction

Evolve LociCanvas from a browser-local digital memory palace into a reliable, responsive, multi-user application. Keep the core mental model: people create visual environments, place memories at meaningful positions, and connect environments with gateways. This is a personal memory-space application; collaborative editing is **not** assumed as a core feature.

The first release should make each user's palace collection private, available across devices, and safely persisted. Optional sharing can follow once the private-user model is reliable.

## 1. Baseline inspection

### Current implementation

- React 19 + Vite 7, Material UI 7, Framer Motion 12; scripts currently include `dev`, `build`, `lint`, and `preview`.
- Main UI and most feature logic are in `src/App.jsx` (about 24 KB); `src/App.css` and `src/index.css` are currently empty.
- The domain model is an array of palaces/environments. Each palace has an `id`, `name`, `imageUrl`, and an `items` array. Items are either memory notes or gateways. Marker coordinates are stored as percentages of the canvas.
- Existing features include a sample Grand Library and Oak Desk, positioned memory notes, note editing and accent colors, gateway creation to an existing or new palace, background image URLs, breadcrumbs, a palace drawer, design mode, and animated environment transitions.
- Persistence uses the `locicanvas_v2_data` key in browser `localStorage`. It is device/browser-origin local state, not shared cloud storage or account-aware persistence.
- The README describes moving markers and a working help guide; the inspected implementation has no marker drag handler and the help button changes state without rendering a help dialog. The drawer's “New Environment” action opens the current environment settings, while a separate new-environment handler exists but is not wired into the visible flow.
- The README says MUI v5, while `package.json` currently declares MUI v7. Documentation should be updated to match the actual project.

### Main risks / gaps

1. **No identity or data isolation.** There is no sign-in flow, owner identity, cloud database, or cross-device synchronization.
2. **Persistence has no recovery path.** The browser-local data has no cloud backup, export/import flow, schema migration, or sync/error indicator.
3. **Incomplete interactions.** Marker movement, first-class environment creation/management, and the guide need a deliberate end-to-end implementation.
4. **Monolithic component.** Application state, persistence, navigation, dialogs, and reusable UI are coupled inside one large file.
5. **Validation and resilience.** Titles, content, image URLs, coordinates, missing gateway targets, storage failures, and malformed saved data need explicit handling.
6. **Responsive/accessibility quality.** Fixed-width dialogs and a full-viewport, overflow-hidden layout need mobile testing, keyboard access, visible focus, and accessible control labels.
7. **No visible automated test suite or CI quality gate.** A build/lint baseline and domain/data-isolation tests should be added before broad refactoring.

These are observations from the current source, not claims that the application has undergone a runtime or security test. The app has not yet been run in a local browser as part of this planning phase.

## 2. Recommended deployment architecture

### Frontend: GitHub Pages

Build the existing Vite/React app and publish its static `dist` output with GitHub Actions. GitHub Pages is suitable for static HTML, CSS, and JavaScript; it does not itself run the application's database or backend API.

Because this application is nested in the `Full_Stack2` repository, the Vite build must use the project Pages base path (typically `/Full_Stack2/`) and the workflow must build from `Experiment2/CaseStudy/locicanvas`. Validate asset paths and direct-refresh behavior after deployment.

### Managed backend: Firebase (recommended for the first implementation)

- **Firebase Authentication:** account creation, sign-in, sign-out, password reset, and optionally Google sign-in.
- **Cloud Firestore:** user-owned palace and marker/gateway documents, with automatic cloud persistence and synchronization between authenticated devices.
- **Cloud Storage (optional in the first MVP):** user-uploaded palace background images. Keep URL-based backgrounds as a simpler initial option if upload support would delay core persistence.
- **Firebase Security Rules:** enforce ownership and validate allowed reads/writes; default to deny unless a rule explicitly grants access. Test the rules before deployment.
- **Firebase Emulator Suite:** test authentication/database behavior and confirm one account cannot read or modify another account's private data.

This avoids needing to operate a custom Node/Express server for the first multi-user release. If later requirements need server-only processing, scheduled jobs, or privileged operations, add a managed function/backend then rather than prematurely creating one.

**Security rule of thumb:** frontend Firebase configuration is not a substitute for authorization. Do not place service-account credentials or privileged secrets in the React build. Protect each user's data with verified Authentication identity plus Firestore/Storage rules; use the Firebase rules emulator to test those boundaries.

### Initial data model (proposal)

- `users/{uid}`: display name and user preferences.
- `users/{uid}/palaces/{palaceId}`: name, background reference, created/updated timestamps, and optional description.
- `users/{uid}/palaces/{palaceId}/markers/{markerId}`: type (`note` or `gateway`), normalized x/y coordinates, title, note content, color, timestamps, and a gateway `targetPalaceId` when applicable.

This structure makes private ownership explicit and avoids relying on a browser-wide shared localStorage key. Validate Firestore document sizing, queries, rule paths, and gateway-target integrity during implementation. A later shared-palace feature would need an explicit membership/role model; do not make palaces public by default.

## 3. Phased implementation roadmap

### Phase 0 — Discovery and architecture (this phase)

- Record the current feature baseline and the observed implementation gaps.
- Choose an architecture for static frontend hosting plus a managed authenticated data layer.
- Preserve the current `main` implementation; plan work on a dedicated branch.
- Define what “multi-user” means for the MVP: independent accounts, private palace collections, and cross-device persistence. No real-time collaborative editing requirement.

**Exit criteria:** roadmap committed, architecture decision documented, and implementation milestones testable.

### Phase 1 — Stabilize the existing experience

- Extract the domain model and pure palace/marker operations from `App.jsx`; split major components (canvas, marker, note editor, gateway editor, environment manager, navigation, help).
- Fix the missing help dialog and wire environment creation from the collection UI.
- Implement marker move/drag with pointer-safe coordinate conversion; retain percentage coordinates so backgrounds remain resolution-independent.
- Add validation for required names, note title/content, valid image URLs, and gateway targets; prevent broken gateway navigation.
- Add undo/redo or a clearly scoped undo for destructive edits; add confirmation and safe handling for deleting environments with inbound gateway references.
- Add responsive layouts, keyboard-operable menus/dialogs, visible focus styles, accessible names, loading/empty/error states, and reduced-motion support.
- Introduce stable generated IDs and a versioned local data schema. Preserve existing local data rather than silently resetting it.
- Add unit tests for coordinate conversion, palace/marker CRUD operations, gateway navigation/validation, and local-data migration. Run lint/build and document the baseline.

**Exit criteria:** current personal/local mode is reliable; primary flows work on desktop and mobile; tests and production build pass.

### Phase 2 — Accounts and cloud persistence (multi-user MVP)

- Add sign-up/sign-in/sign-out, password reset, authentication loading states, and protected application routes/views.
- Create Firestore data access functions separate from UI components.
- Apply per-user Firestore rules before connecting production data. Verify isolation through automated/emulator tests.
- Replace direct `localStorage` persistence with a repository/data-service layer that uses authenticated cloud data.
- Provide visible saving/saved/error/offline status and retry behavior; avoid showing a successful save before the backend confirms it.
- Offer a controlled one-time import of the existing `locicanvas_v2_data` localStorage data into the signed-in user's account, with preview and confirmation. Do not overwrite existing cloud data silently.
- Add export/import (versioned JSON) for user-owned collections as a portable backup.
- Decide sign-in providers and allowed domains before configuring deployment.

**Exit criteria:** two separate accounts see separate private palace collections; the same account sees its saved collection on another device/browser; refresh and re-login retain data; tested rules reject cross-account access.

### Phase 3 — Product features worth prioritizing

**Must-have for a usable release**
- Search memories by title/content across a user's palaces.
- Tags/categories, favorites, and sorting/filtering.
- Environment management: create, rename, duplicate, and safely delete; background preview and sensible default/fallback.
- Marker movement plus an accessible alternative for setting precise coordinates.
- Autosave state, explicit failure/retry feedback, and backup export/import.
- Better memory editor support (links and lightweight Markdown first; attachments only after storage/rules are ready).
- Responsive canvas controls and a compact mobile navigation mode.

**Good next features**
- Undo/redo history, recently opened palaces, pinned/favorite environments, and customizable marker icons.
- Optional recall mode: hide a note's content until revealed, plus manually scheduled review reminders. Keep this lightweight; do not add AI or complex spaced-repetition algorithms until the core memory experience is validated.
- User settings: theme/accent preferences, default landing palace, and motion preferences.

**Later, separately scoped**
- Share a palace via an explicit read-only link or invitations with roles (viewer/editor).
- Optional collaborative updates only if there is a real requirement. If introduced, design membership permissions, conflict handling, auditability, and sync behavior before implementation.

### Phase 4 — Deploy, observe, and harden

- GitHub Actions workflow: install from lockfile, lint, test, build, and publish `dist` to GitHub Pages.
- Configure Vite base path, Firebase authorized domains, environment-specific public client configuration, and production rules.
- Test sign-up, password reset, refresh/deep links, browser back/forward, failed network requests, mobile viewport, and two-account data isolation.
- Add Firebase budget/usage alerts, basic analytics only if needed and disclosed, error reporting, and a clear account/data deletion path.
- Write the README: architecture diagram, local setup, Firebase project setup, environment configuration, rules deployment/testing, migration/backup, and known limitations.

**Exit criteria:** reproducible deploy; no secrets in the client; security rules and user isolation tests pass; setup and recovery steps are documented.

## 4. MVP definition

A release counts as a multi-user MVP only when all of the following are true:

- A user can create an account, sign in, sign out, and recover access.
- Each account owns and sees only its own private palaces and markers.
- Palaces and memories are stored remotely and return after refresh, sign-in on another device, and a new browser session.
- An existing local collection can be imported without silent data loss.
- Core palace/marker/gateway flows work on desktop and mobile.
- Firestore rules are tested for allowed and forbidden access; the frontend build passes lint/tests/build.
- The deployed URL, setup instructions, backup/export, and known limitations are documented.

## 5. Explicit decisions and non-goals

- **Hosting:** GitHub Pages for the React/Vite static frontend; Firebase services for authentication and durable multi-user data.
- **Data access:** private by default; never make all palace data publicly readable to simplify deployment.
- **Scope:** keep LociCanvas a visual memory palace. Do not redesign it as a generic collaborative drawing board.
- **Migration:** preserve browser-local data and give users control over import; no destructive automatic migration.
- **No premature custom backend:** start with Firebase's managed services and rules. Revisit a dedicated API only if a concrete requirement justifies it.
- **No claim of production readiness yet:** hosting is a target, not a deployed/verified outcome at this phase.

## References

- GitHub Pages overview: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Cloud Firestore security rules: https://firebase.google.com/docs/firestore/security/get-started
- Firebase Security Rules overview: https://firebase.google.com/docs/rules/get-started
- Firebase Hosting quotas/pricing (review before launch): https://firebase.google.com/docs/hosting/usage-quotas-pricing
