# LociCanvas

LociCanvas is a visual digital memory palace based on the Method of Loci. Create virtual environments, place notes at meaningful positions, and connect environments using gateway markers.

## Current features

- Visual palace environments with background image URLs.
- Memory notes with title, content, and accent colors.
- Gateway markers linking environments.
- Breadcrumb and collection navigation.
- Design mode for adding memories and gateways.
- Drag markers to reposition them while Design Mode is active.
- Create environments from the Palace Collection drawer.
- Built-in guide dialog.
- Browser-local persistence using a versioned JSON envelope, with support for reading the older array format.
- Export a versioned JSON backup and import a validated backup after explicit replacement confirmation.
- Best-effort recovery copy preservation with an in-app recovery action.
- HTTPS-only validation for new or edited background-image URLs.
- Responsive, full-width editor dialogs on smaller screens.
- Validation of saved palace/marker structure and broken gateway references.

## Technology

- React 19 and Vite 7
- Material UI 7
- Framer Motion 12
- Browser `localStorage` (current persistence; no accounts or cloud sync yet)
- Node.js test runner for domain-level tests

## Run locally

Use a current Node.js LTS release, then from this directory:

```sh
npm ci
npm run dev
```

Vite prints the local development URL. To run the available checks:

```sh
npm test
npm run lint
npm run build
```

## Data persistence and recovery

The application uses the browser storage key `locicanvas_v2_data`. New saves use an envelope containing `schemaVersion` and `palaces`; existing valid array-format data is still read and migrated on the next successful save.

If saved data is malformed or fails structural validation, the app attempts to preserve the raw value under `locicanvas_v2_data_recovery` and loads the sample collection instead of silently treating malformed data as an empty collection. Browser storage may be unavailable or full, so this recovery copy is best-effort. Do not clear site data if you need to recover a previous collection.

Data is still local to a browser profile and origin. It is not synchronized across devices, and clearing browser storage can remove it. Cloud accounts, database persistence, and deployment are planned separately; they are not implemented in this phase.

## Project structure

- `src/App.jsx`: application UI and interactions.
- `src/domain/palaceModel.js`: pure coordinate, movement, storage parsing/serialization, and gateway-cleanup operations.
- `src/domain/palaceModel.test.js`: tests for domain operations and data validation.
- `vite.config.js`: Vite configuration.
- `IMPROVEMENT_PLAN.md`: phased multi-user upgrade plan and architecture decisions.

## Current limitations

- No authentication, cloud database, or cross-device synchronization.
- No background-image upload; backgrounds are supplied as HTTPS URLs.
- Import currently accepts pasted JSON backup content; direct file-picker import is not implemented.
- Browser-local recovery remains best-effort and depends on browser storage being accessible.
- Palace deletion UI, search, tags, undo/redo, and portable JSON export/import are not implemented yet.
- Browser interaction and deployment still need end-to-end verification before the app should be considered production-ready.

## Screenshots

![LociCanvas screenshot 1](Screenshots/1.png)
![LociCanvas screenshot 2](Screenshots/2.png)
![LociCanvas screenshot 3](Screenshots/3.png)
![LociCanvas screenshot 4](Screenshots/4.png)
![LociCanvas screenshot 5](Screenshots/5.png)
