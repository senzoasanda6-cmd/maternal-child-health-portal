# Application Architecture

This application follows a common client-server architecture, separating the frontend user interface from the backend logic. Here's a breakdown:

1.  **Client (Frontend):**
    *   **Technology:** A React Single-Page Application (SPA) located in the `maternal-child-health-frontend/` directory.
    *   **Responsibility:** It renders the entire user interface that you see and interact with in your web browser. It manages the visual components, user input, and dynamic updates without needing to reload the page.
    *   **Communication:** It communicates with the backend server to get or send data (e.g., logging in a user, fetching patient data). This is done by making HTTP requests to specific API endpoints.

2.  **Server (Backend):**
    *   **Technology:** A Laravel (PHP) application, which is the main project in the root directory.
    *   **Responsibility:** It acts as the brain of the application. Its core jobs are to handle business logic, process data, manage user authentication, and interact with the database.
    *   **API:** It exposes a RESTful API that the React frontend consumes. The routes for this API are defined in the `routes/api.php` file. When your React application tries to register a user, it sends a request to an endpoint like `/api/register`, which the Laravel backend should process.

In short, the Laravel project is the authoritative backend that manages all the data and core logic, while the React project is the interactive frontend that users see and use. The "404 Not Found" error you saw for `/api/register` means the React app sent a request to the Laravel backend, but the backend has no route defined at that specific address to handle it.
