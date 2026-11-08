# Hayyak review-load fix

Changes:
- Firebase scripts load after the original page logic, using ordered `defer` tags.
- Pages other than Site Details no longer download Firestore unnecessarily.
- Reviews display a visible loading or error status even when the visitor is logged out.
- The one-per-user review design, stars, and CSS remain unchanged.
- Firestore rule no longer requires the displayName to be present in an auth token claim; verified UID ownership remains mandatory.

## Deploy
1. Upload the *contents* of this project to the root of the GitHub repository and allow GitHub Pages to deploy.
2. Publish `firestore.rules` in the Firebase Console (Firestore > Rules).
3. Verify on `https://aina12344.github.io/Hayyak/site-details.html?id=1`.
4. Open in a second private browser to verify public reviews. Verify signed-in edit/delete ownership with two Firebase accounts.

If the page displays 'Reviews could not connect' or 'Unable to load reviews', open developer console (F12) to inspect the real network/security error. The initial Firestore request still needs Internet access.

This is a GitHub Pages + Firebase demonstration, not the SQL/PHP backend required by your Sprint 2 architecture document.
