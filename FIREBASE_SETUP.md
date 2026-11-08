# Hayyak Firebase reviews — GitHub Pages setup

The site is still plain HTML/CSS/JavaScript. Firebase Auth and Firestore are loaded with browser `<script>` tags; **no npm or localhost is needed** for GitHub Pages.

## One-time Firebase console setup

1. Open the Firebase project **hayyak-eab91**.
2. **Authentication → Sign-in method:** enable **Email/Password**.
3. **Authentication → Settings → Authorized domains:** add **aina12344.github.io** (no `https://` or repository path).
4. **Firestore Database:** create the default database if not already created. Open **Rules**, copy the entire contents of `firestore.rules`, and click **Publish**. This is essential: without these rules, review reads or writes may fail or be unsafe.
5. In your GitHub repository, upload the updated project files *inside* the existing site root. If your GitHub Pages is configured for repository root, the `index.html` must be at the repository root rather than inside a second `Hayyak/` directory.
6. In GitHub → Settings → Pages, deploy the branch containing the updated files. Open the Pages URL (typically `https://aina12344.github.io/Hayyak/`).

## Test across clients

- Sign up using a **new tourist email** in Hayyak's updated `register.html`; old accounts stored in the browser are **not migrated** to Firebase.
- Open a site, submit a 1–5 star review and nonempty text.
- On another browser/device, open the **same site ID**. The review, average rating and count should appear. Logging in is not necessary to view reviews.
- Register/sign in as a different tourist and add a second review. The average should use both reviews.
- On the first account, edit/delete its own review; second-account reviews should not show owner Edit/Delete buttons. Confirm that cancellation leaves the review unchanged.

## Important limitations (read before submitting)

- **Only tourist registration/login and shared reviews** have been migrated to Firebase. Admin pages, site edits and My Upcoming Visits still use the earlier demo browser-storage architecture; they do not sync across devices.
- The existing demonstration administrator's credentials are embedded in client-side JavaScript and **are not secure**. Do not reuse these credentials for real administration or claim this project has secure admin authorization.
- Existing browser-stored tourist accounts/reviews are **not automatically migrated** into Firestore.
- A Firestore cloud database is **not the SQL database** described in the report's three-tier architecture. Confirm whether your instructor accepts this deviation; do not document Firestore as SQL/PHP.
- If Firebase services are disabled, unavailable, or security rules not published, shared reviews will not load. Check the browser console and Firestore Rules.
- This is a classroom prototype. For production use, complete secure Firebase authentication and authorization for *all* modules, add proper review moderation/rate limits, and test the full system.
