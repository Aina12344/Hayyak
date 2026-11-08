# Hayyak — Firebase Reviews (original star selector)

1. In Firebase Console, enable Authentication > Email/Password and Firestore Database.
2. Paste `firestore.rules` into Firestore > Rules and click **Publish**.
3. In Authentication > Settings > Authorized domains, authorize `aina12344.github.io`.
4. Upload the contents of this `Hayyak` folder to the root of your GitHub repo (not the folder itself); enable GitHub Pages for `main` / `(root)`.
5. Open the GitHub Pages URL. Register a NEW tourist Firebase account; pre-existing demo accounts from browser localStorage do not automatically migrate.
6. On a site details page, choose a star rating with the original star-picker design and submit a review. Use another browser/private window to confirm public reviews show, then sign in using the same account to edit/delete.

Firestore `reviews` documents use the deterministic ID `{siteID}_{firebaseUid}`, enabling one review per user per site. The average and count are derived from shared Firestore reviews.

**Scope:** Tourist accounts and reviews use Firebase; the pre-existing demonstration admin code and Upcoming Visits still use their old implementation. Do not use the demo admin credential for a live system. Your course report currently specifies PHP/SQL; Firebase is a different architecture.
