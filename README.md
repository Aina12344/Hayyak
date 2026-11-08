# Hayyak | حيّــاك

Hayyak is a bilingual (Arabic and English) web application that brings the information about heritage sites in Saudi Arabia together in one place. Tourists can search and filter heritage sites, view their details, read and write reviews, and save the sites they plan to visit. An admin manages the heritage sites through an Admin Dashboard.

Developed for **IT320 – Practical Software Engineering**, King Saud University, 1st semester 2026.

---

## Features

### Tourist
- Register, log in, and log out.
- Browse all heritage sites.
- Search for sites by name (Arabic or English) and filter them by city and classification.
- View a site's details: photos, description, address, working hours, classification, and a Google Maps link.
- Add, edit, and delete a rating and review, and see the average rating and number of reviews.
- Add sites to **My Upcoming Visits**, view the list, and remove sites from it.

### Admin
- Log in to the **Admin Dashboard**, which shows the number of sites, cities, and classifications.
- **Add** a heritage site with its Arabic and English details and up to 5 photos.
- **Edit** a site's details and photos.
- **Delete** a site after a confirmation page (its reviews and photos are deleted with it).

### Both
- Full Arabic and English interface with a language switch.
- Responsive design for phones, tablets, and computers.

---

## Technologies

- HTML5, CSS3, and JavaScript (no frameworks).
- Data is saved in the browser:
  - accounts, sites, reviews, and upcoming visits in **localStorage**;
  - photos added by the admin in **Cache Storage**, served by `sw.js` (a service worker) under paths such as `images/uploads/...`, so they appear in their original quality like the other site photos.

> Hayyak does not use a database. Changes are saved in the browser where they are made, so they appear only on that computer and browser.

---

## How to Run

1. Download or clone this repository.
2. Put the `Hayyak` folder inside your local server folder, for example:
   - MAMP: `C:\MAMP\htdocs\Hayyak`
   - XAMPP: `C:\xampp\htdocs\Hayyak`
3. Start the local server, then open:
   `http://localhost/Hayyak/index.html`

Opening the website through the local server is recommended, so the admin's photos work without size limits.

### Test accounts

| Role    | Email             | Password     |
|---------|-------------------|--------------|
| Admin   | admin@hayyak.sa   | Admin@2026   |
| Tourist | Create one from the **Register** page | — |

To return to the original 16 heritage sites, log in as the admin and click **Restore the original data** at the bottom of the Admin Dashboard.

---

## Project Structure

```
Hayyak/
├── index.html            Home page
├── sites.html            Heritage sites list with search and filters
├── site-details.html     Site details, ratings and reviews
├── upcoming.html         My Upcoming Visits
├── login.html            Log in
├── register.html         Register
├── admin.html            Admin Dashboard
├── admin-add.html        Add Site
├── admin-edit.html       Edit Site
├── admin-delete.html     Delete Site
├── sw.js                 Serves the photos added by the admin
├── css/                  style.css (whole website), admin.css (admin pages)
├── js/                   sites.js (site data), layout.js (header, footer, language),
│                         auth.js (register and log in), home.js, site-details.js,
│                         admin.js (admin pages)
├── images/               Site photos and logo
├── docs/                 Architecture diagram
├── README.md
└── AUTHORS
```

---

## Team

See the [AUTHORS](AUTHORS) file.
