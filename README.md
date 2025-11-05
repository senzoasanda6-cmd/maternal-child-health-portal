# Maternal and Child Health System

The Maternal and Child Health System is a web-based application designed to track and manage the health of mothers and children. It provides features for tracking medical history, managing appointments, and sending reminders for vaccinations and checkups.

## Core Features

- **Mother and Child Profiles:** Track medical history, pregnancy progress, birth details, and child growth.
- **Prenatal Care Tracking:** Schedule and record visits, tests, ultrasounds, and risk factors.
- **Postnatal Care Monitoring:** Track vaccinations, growth milestones, and nutrition.
- **Alerts & Reminders:** Automated notifications for upcoming appointments, vaccinations, and checkups.
- **Health Education:** Provide tailored advice and resources based on the pregnancy stage or child's age.

## Tech Stack

- **Frontend:** React
- **Backend:** PHP (Laravel)
- **Database:** MySQL (or other based on Laravel configuration)

## Getting Started

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/maternal-child-health-portal.git
    cd maternal-child-health-portal
    ```

2.  **Run the installation script:**
    This script will install both Composer and npm dependencies.
    ```bash
    ./install_dependencies.sh
    ```

3.  **Set up your environment file for the backend:**
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your database credentials and other environment-specific settings.

4.  **Generate the application key:**
    ```bash
    php artisan key:generate
    ```

5.  **Run the database migrations:**
    ```bash
    php artisan migrate:fresh --seed
    ```

## Running the Application
-   **Utility Scripts:**
    Use the `./start_dev.bat` utility script to launch isolated floating terminals OR

-   **Backend (Laravel):**
    ```bash
    php artisan serve
    ```

-   **Frontend (React):**
    ```bash
    cd mch-frontend
    npm start
    ```

## API Endpoints

| Method | Endpoint                      | Description                  |
| :----- | :---------------------------- | :--------------------------- |
| GET    | `/mothers/{id}`               | Fetch a mother's profile.    |
| POST   | `/prenatal-visits`            | Record a prenatal visit.     |
| GET    | `/children/{id}/growth`       | Get child growth data.       |
| POST   | `/vaccinations`               | Record a vaccination.        |
| GET    | `/notifications`              | List pending alerts.         |

## Database Schema

| Table            | Key Fields                                       |
| :--------------- | :----------------------------------------------- |
| `mothers`        | `id`, `name`, `dob`, `last_menstrual_date`         |
| `children`       | `id`, `mother_id`, `name`, `dob`, `gender`         |
| `prenatal_visits`| `id`, `mother_id`, `visit_date`, `notes`           |
| `postnatal_visits`| `id`, `child_id`, `visit_date`, `notes`            |
| `vaccinations`   | `id`, `child_id`, `vaccine_name`, `date`           |
| `growth_records` | `id`, `child_id`, `date`, `height`, `weight`       |
| `notifications`  | `id`, `mother_id`/`child_id`, `message`, `due_date`, `status` |

## Security

-   Ensure all health data is encrypted in the database.
-   Secure the API with JWT tokens.
-   Implement role-based access control (mothers can see their own data, healthcare providers can access assigned patients).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

For developer notes about clearing caches after changing middleware or the HTTP kernel, see `CONTRIBUTING.md`.

## Developer helpers

Quick helper scripts are provided at the repository root to simplify common developer tasks: clearing and rebuilding Laravel caches, regenerating Composer autoload, and running the test suite. See `REBUILD_AND_TEST.md` for full details.

- Windows (PowerShell):

```powershell
# clear caches and run tests
.\rebuild_and_test.ps1

# clear/rebuild caches and run tests
.\rebuild_and_test.ps1 -RebuildCaches
```

- macOS / Linux (Bash):

```bash
# clear caches and run tests
./rebuild_and_test.sh

# clear/rebuild caches and run tests
./rebuild_and_test.sh --rebuild-caches
```

If you run the application in a persistent process (e.g. Octane, Swoole, Docker, IIS), restart the process after running these scripts so changes are picked up by worker processes.

## Contributors

-   Mr. Senzo Dubazana **[ Lead Developer (Backend) ]**:
-   Mr. Inga Kubalo **[ Support Developer (Frontend) ]**:
-   Mr. Thabang Mposula **[ Code Review + Support Developer (Fullstack) ]**:
