# Realtore Clone

A real-estate listing app (browse, create, edit, and search property listings)
built with React 19, TypeScript, Vite, Tailwind CSS, and Firebase
(Auth, Firestore, Storage).

## Setup

```bash
npm install
```

Create a `.env` file in the project root with the following variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_GEOCODE_API_KEY=
```

- The `VITE_FIREBASE_*` values come from your Firebase project settings
  (Project settings → General → Your apps). All of them except
  `VITE_FIREBASE_MEASUREMENT_ID` are required — the app will refuse to start
  if any are missing (see `src/firebase.ts`).
- `VITE_GEOCODE_API_KEY` is a Google Geocoding API key, only needed if you
  enable automatic address-to-coordinates lookup (see "Geolocation" below).

## Development

```bash
npm run dev      # start the dev server
npm run lint      # run ESLint
npm run build     # type-check (tsc -b) and build for production
npm run preview   # preview a production build locally
```

## Firebase Security Rules

`firestore.rules` and `storage.rules` in this repo define the access rules
for listings, user profiles, and uploaded images. They are **not**
automatically deployed — push them with the
[Firebase CLI](https://firebase.google.com/docs/cli):

```bash
firebase deploy --only firestore:rules,storage:rules
```

Review them against your project's actual current rules before deploying to
production, since deploying will replace whatever is currently live.

## Geolocation

Listing creation/editing supports either manual latitude/longitude entry
(the default) or automatic geocoding from the entered address via the Google
Geocoding API, gated behind `VITE_GEOCODE_API_KEY`. Manual entry is the
default because it has no external dependency or cost.
