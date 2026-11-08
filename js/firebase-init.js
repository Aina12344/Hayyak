/* Hayyak Firebase client setup. Web app config is public; secure access with Firestore rules. */
(function () {
  "use strict";
  const config = {
    apiKey: "AIzaSyDeyhgQ7wiSfiepPP5ZRB9i35GS3wbMxac",
    authDomain: "hayyak-eab91.firebaseapp.com",
    projectId: "hayyak-eab91",
    storageBucket: "hayyak-eab91.firebasestorage.app",
    messagingSenderId: "915478548833",
    appId: "1:915478548833:web:0c04f0d9b68b0c04397520"
  };
  if (typeof firebase === "undefined") {
    document.dispatchEvent(new CustomEvent("hayyak:firebase-error", { detail: "Firebase scripts could not be loaded." }));
    return;
  }
  // Most Hayyak pages need Authentication only. Firestore is loaded only on
  // site-details.html, so never assume the Firestore SDK exists on login/home.
  if (typeof firebase.auth !== "function") {
    console.error("Hayyak: Firebase Authentication SDK failed to load.");
    document.dispatchEvent(new CustomEvent("hayyak:firebase-error", { detail: "Firebase Authentication SDK is unavailable." }));
    return;
  }
  try {
    if (!firebase.apps.length) firebase.initializeApp(config);
    const auth = firebase.auth();
    const db = typeof firebase.firestore === "function" ? firebase.firestore() : null;
    window.HayyakFirebase = { auth, db };
    auth.onAuthStateChanged(function (user) {
      let cached = null;
      try { cached = JSON.parse(sessionStorage.getItem("hayyakUser")); } catch (e) {}
      // Keep the old admin demo pages intact; admin is NOT granted Firestore privileges.
      if (cached && cached.role === "admin") return;
      if (user) {
        const current = { name: user.displayName || user.email.split("@")[0], email: user.email, role: "tourist", uid: user.uid };
        sessionStorage.setItem("hayyakUser", JSON.stringify(current));
      } else {
        sessionStorage.removeItem("hayyakUser");
      }
      document.dispatchEvent(new Event("hayyak:auth"));
    });
  } catch (err) {
    console.error("Hayyak Firebase initialization failed:", err);
    document.dispatchEvent(new CustomEvent("hayyak:firebase-error", { detail: err.message }));
  }
})();