# Code Revision Guide

**Timestamp:** 2025-10-07

This document outlines the recent architectural revisions made to the frontend of the Maternal-Child Health Portal.

## Frontend Architecture Update

The frontend application has been refactored to improve structure, maintainability, and to centralize core functionalities like routing and authentication.

### 1. Layout Management (`src/layouts`)

- **`PublicLayout.jsx`**: This layout is designed for pages that do not require user authentication (e.g., Login, Register). It renders the child components directly without any surrounding navigation or sidebars.

- **`ProtectedLayout.jsx`**: This layout is for pages that are only accessible to authenticated users. It includes:
    - A persistent `Sidebar` component for navigation within the protected areas of the application.
    - An authentication check that redirects unauthenticated users to the `/login` page.
    - A main content area where the specific protected page component is rendered.

### 2. Centralized Routing (`src/routes.js`)

- All frontend routes are now defined in a single file: `src/routes.js`.
- This file uses the `PublicLayout` and `ProtectedLayout` to clearly distinguish between public and protected sections of the application.
- A new route, `/mother/home`, has been added, which directs authenticated mothers to their dedicated home page.

### 3. Centralized Authentication (`src/context/AuthContext.js`)

- All authentication-related logic has been consolidated within the `AuthProvider`.
- **Login Logic**: The `login` function in `AuthContext.js` now handles the entire authentication flow:
    1.  It calls the login API.
    2.  It stores the authentication token and user role in `localStorage`.
    3.  It updates the application's state with the user information.
    4.  It performs **role-based redirection** upon successful login, sending users to their respective dashboards or home pages.
- **`LoginPage.jsx`**: This component has been simplified to call the `login` function from the `AuthContext`, removing local state management for tokens and roles.

### 4. Application Entry Point (`src/App.jsx`)

- The main `App.jsx` component has been simplified. Its sole responsibility is now to:
    1.  Set up the `Router`.
    2.  Wrap the application with the `AuthProvider` to make the authentication context available to all components.
    3.  Render the routes defined in `src/routes.js`.

### 5. New Home Page (`src/pages/Home/HomePage.jsx`)

- A new component, `HomePage.jsx`, has been created to serve as the landing page for users with the "mother" role after they log in.
