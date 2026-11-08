# Firebase Auth initialization correction

## Why login failed
The login page loads Firebase App and Authentication, but not Firestore. The previous `firebase-init.js` unconditionally called `firebase.firestore()`, threw a TypeError, and never created `window.HayyakFirebase`. This made login also crash.

## Fix
- `firebase-init.js` now initializes authentication independently and makes Firestore optional on pages without its SDK.
- The Site Details page still loads the Firestore SDK for shared reviews.
- Login and registration show an error instead of a JavaScript exception if the Firebase SDK cannot load.
- Review initialization reports an error when Firestore is unavailable.

## Deploy
Upload the ZIP contents into the repository root. Commit, allow Pages to deploy, then hard refresh (Ctrl+Shift+R / Cmd+Shift+R). No Firestore rules changes are required for this specific bug.

## Verify
Open Login, register or login with Firebase tourist account, navigate to Site Details, and confirm reviews load. Test from another browser; if permissions errors remain, inspect Firestore rules.
