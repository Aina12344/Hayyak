# Review cards visibility + error reporting fix

The average rating uses the Firestore review array. The same array also generates review cards. This patch ensures cards are always visible and a display error is not silently hidden.

Changed: `js/reviews-firebase.js`, `css/style.css`, and `site-details.html` (cache-busting query strings).

After publishing on GitHub Pages, hard-refresh a site-details page. Check that `#sd-review-list` contains `.sd-review` elements. If not, inspect Console for `Hayyak review display failed` or `Review loading failed`.

This patch does not change Firebase database contents, rules, or login.
