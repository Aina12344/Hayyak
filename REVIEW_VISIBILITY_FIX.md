# Hayyak — review comments visibility fix

Cause: New Firestore review cards were inserted with `data-reveal="up"` after the page had already initialized its scroll-animation observers. The CSS selector `.motion [data-reveal]` set their opacity to zero, hiding comments while the separate average score stayed visible.

Fix: Dynamically generated review cards no longer use the initial-page scroll-reveal attribute. They are visible as soon as Firestore returns them. Existing site styling is preserved.

Deployment: Replace `js/reviews-firebase.js` in GitHub with the version in this ZIP. No new Firestore rules or Firebase settings changes are required. After GitHub Pages deploys, hard-refresh the page.

Validation: JavaScript syntax check and ZIP integrity check pass. Live Firebase behavior still needs a browser check.
