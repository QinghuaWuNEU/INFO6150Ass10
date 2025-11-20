# 📄 Assignment 9: React Job Portal Frontend

This project serves as the frontend component for **INFO6150 Assignment 9**. It is a Job Portal built with React, focusing on essential frontend architecture, routing, session management, and integration with the previous **Assignment 8 backend** via API calls.

## 🚀 1. Technology Stack

* **Frontend Framework:** React 18+
* **Routing:** React Router v6
* **UI Library:** Material UI (MUI)
* **API Client:** Axios
* **Session Storage:** Browser Local Storage (for JWT Token)


## 📖 2. Folder structure
* 
    * `node_modules/`
    * `public/`
        * `index.html`
    * `src/`
        * `components/`
            * `Navbar/`
                * `Navbar.js`
        * `data/`
            * `jobPosts.js`
        * `pages/`
            * `Auth/`
                * `Login.js`
            * `CompanyShowcase/`
                * `CompanyCard.js`
                * `CompanyShowcase.js`
            * `Home/`
                * `Home.js`
            * `JobListings/`
                * `JobListings.js`
                * `JobPostCard.js`
            * `About.js`
            * `Contact.js`
        * `App.js`
        * `index.js`
    * `.gitignore` 
    * `package-lock.json`
    * `package.json`

## 💻 3. Getting Started (Launch Instructions)

This is a decoupled application, requiring both the backend (Assignment 8) and the frontend (Assignment 9) to be running simultaneously.

### 3.1. Prerequisites

Ensure you have Node.js (v18+) and npm installed on your system.

### 3.2. Backend Startup (Assignment 8)

The backend provides the Authentication and Company API endpoints.

1.  Navigate to your Assignment 8 (Backend) directory.
2.  Install dependencies: `npm install`
3.  **Start the Server:** `npm start`

    **Confirmation:** The backend must be running on **`http://localhost:5000`**.

### 3.3. Frontend Startup (Assignment 9)

The frontend provides the user interface and application logic.

1.  Navigate to this Assignment 9 (Frontend) directory.
2.  Install dependencies: `npm install`
3.  Start the Application: `npm start`
4.  **Access URL:** The application will open in your browser at **`http://localhost:3000`**.

---

## ✨ 4. Core Features and Routing

The application implements a robust routing system with five main pages:

| Page Name | Route Path (URL) | Data Source / Function | Authentication Required |
| :--- | :--- | :--- | :--- |
| **Home** | `/` or `/home` | Main landing page. | No |
| **About** | `/about` | Static informational page. | No |
| **Contact** | `/contact` | Static informational page. | No |
| **Job Listings** | `/jobs` | Renders job data from the local file `src/data/jobPosts.js`. | No |
| **Company Showcase** | `/companies` | Fetches company data from the Ass8 Backend API. | **Yes** |
| **Login** | `/login` | User authentication interface. | No |

### Authentication Details

The application uses the following API endpoint for authentication:

* **Login API URL:** `http://localhost:5000/user/login`
* **CORS:** The Assignment 8 backend is configured with CORS to allow requests from the frontend origin (`http://localhost:3000`).
* **Credential Storage:** Upon successful login, the JWT Token is saved to the browser's `localStorage`.

### Test Credentials

Please use the following credentials, which were previously confirmed in the database:

* **Email:** `alice.smith@example.com`
* **Password:** `StrongPassword@123`

### Logout Feature

The **Logout** button in the Navbar clears the stored JWT Token from `localStorage` and redirects the user to the `/login` page, effectively ending the session.

## ⚙️ 5. API Configuration Notes

| Feature | Endpoint Used | Required Headers | Data Fields Displayed |
| :--- | :--- | :--- | :--- |
| **Login** | POST `/user/login` | None (Public) | Sends JSON body with keys: **`email`** and **`password`**. |
| **Company Data** | GET `/api/companies` | **`Authorization: Bearer [Token]`** | **`name`**, **`description`**, and **`industry`**. |
| **Image Loading** | Static URL: `http://localhost:5000/images/` | None | Used to load company logos from the backend's static file service. |
