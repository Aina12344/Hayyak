# Hayyak | حيّــاك

Hayyak is a bilingual (Arabic and English) web application that brings the information about heritage sites in Saudi Arabia together in one place. Tourists can search and filter heritage sites, view their details, read and write reviews, and save the sites they plan to visit. An admin manages the heritage sites through an Admin Dashboard.

Developed for **IT320 – Practical Software Engineering**, King Saud University, 1st semester 2026.

---

## Features

### Tourist
- Register, log in, and log out using Firebase Authentication.
- Browse all heritage sites.
- Search for sites by name (Arabic or English) and filter them by city and classification.
- View a site's details: photos, description, address, working hours, classification, and a Google Maps link.
- Add, edit, and delete a rating and review, and see the average rating and number of reviews. Reviews are shared between users through Firebase Cloud Firestore.
- Add sites to **My Upcoming Visits**, view the list, and remove sites from it.

### Admin
- Log in to the **Admin Dashboard**, which shows the number of sites, cities, and classifications.
- **Add** a heritage site with its Arabic and English details and up to 5 photos.
- **Edit** a site's details and photos.
- **Delete** a site after a confirmation page.

### Both
- Full Arabic and English interface with a language switch.
- Responsive design for phones, tablets, and computers.

---

## Technologies

- HTML5, CSS3, and JavaScript (no frameworks).
- **Firebase Authentication** for tourist registration and login.
- **Firebase Cloud Firestore** for storing and sharing ratings and reviews across different users and devices.
- **localStorage** for some remaining browser-based features, including admin-managed site data.
- **Cache Storage**, supported by `sw.js`, for photos added by the admin.
- **GitHub Pages** for website hosting.

> Hayyak uses Firebase for tourist authentication and shared reviews. Some other features still rely on browser-based storage.

---

## How to Run

1. Open the live website: https://aina12344.github.io/Hayyak/
2. Browse heritage sites and view their details without logging in.
3. Register or log in to add, edit, or delete your own reviews.
4. Reviews are stored in Firebase and can be viewed by other visitors.

The website can also be run locally using a development server.

### Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@hayyak.sa | Admin@2026 |
| Tourist | Create an account from the **Register** page | — |

To return to the original 16 heritage sites, log in as the admin and click **Restore the original data** at the bottom of the Admin Dashboard.

---

## Project Structure

```text
Hayyak/
├── index.html            Home page
├── sites.html            Heritage sites list
├── site-details.html     Site details, ratings and reviews
├── upcoming.html         My Upcoming Visits (add/view/remove)
├── login.html            Log in
├── register.html         Register
├── admin.html            Admin Dashboard
├── admin-add.html        Add Site
├── admin-edit.html       Edit Site
├── admin-delete.html     Delete Site
├── sw.js                 Serves admin-uploaded photos
├── css/                  Website and admin styling
├── js/                   Website functionality, Firebase
│                         authentication and reviews
├── images/               Site photos and logo
├── docs/                 Architecture diagram
├── firestore.rules       Firestore security rules
├── README.md
└── AUTHORS
```

---

## Team

See the [AUTHORS](AUTHORS) file.

### My Upcoming Visits implementation

Tourists can save a site using the button on its details page, view saved sites on `upcoming.html`, and remove them there or from the details page. The feature uses browser localStorage keyed by the signed-in tourist UID (or email), matching the existing browser-storage approach. Saved visits remain on the same browser but **do not sync between devices**. Login is required to add/view/remove.
