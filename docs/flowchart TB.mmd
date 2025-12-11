flowchart TB
    %% ========== PORTAL GROUPS ==========
    subgraph USERS [👩‍⚕️ User Roles & Portals]
        direction TB
        subgraph MOTHER_PORTAL [🧒 Mother Portal]
            U1[mother]
        end

        subgraph HW_PORTAL [🏥 Health Worker Portal]
            U2[health_worker]
            U3[midwife]
            U4[facility_worker]
            U5[facility_nurse]
            U6[facility_doctor]
        end

        subgraph ADMIN_PORTAL [🛠️ Admin Portal]
            U7[admin]
            U8[district_admin]
            U9[hospital_admin]
            U10[facility_admin]
            U11[facility_manager]
        end
    end

    %% ========== FRONTEND ==========
    subgraph FRONTEND ["🌐 React Frontend"]
        F1["Role-based Portals - React Router"]
        F2["Axios / Fetch API Calls"]
        F1 --> F2
    end

    %% ========== BACKEND ==========
    subgraph BACKEND ["⚙️ Laravel Backend"]
        B1["API Routes - api.php"]
        B2["Controllers"]
        B3["Business Logic / Services"]
        B4["Eloquent Models"]
        B5["Authentication - Sanctum / JWT"]
        B6["Role & Permission Middleware"]
        B1 --> B2 --> B3 --> B4
        B2 --> B5
        B2 --> B6
    end

    %% ========== DATABASE ==========
    subgraph DATABASE ["🗄️ MySQL Database"]
        D1["Users Table"]
        D2["Roles Table"]
        D3["Patients Table"]
        D4["Visits Table"]
        D5["Vaccinations Table"]
        D6["Facilities Table"]
    end

    %% ========== CONNECTIONS ==========
    %% Portal users interact with frontend
    U1 & U2 & U3 & U4 & U5 & U6 & U7 & U8 & U9 & U10 & U11 --> F1
    %% Frontend connects to backend
    F2 -->|HTTPS JSON API| B1
    %% Backend connects to database
    B4 -->|ORM Queries| D1 & D2 & D3 & D4 & D5 & D6
    %% Backend returns responses to frontend
    B1 -->|JSON Responses| F2

    %% ========== OPTIONAL SERVICES ==========
    subgraph SERVICES ["☁️ Optional Integrations"]
        S1["📩 Notification Service (Email / SMS)"]
        S2["☁️ Cloud Storage (AWS S3 / Local Disk)"]
        S3["📊 Analytics / Reporting Module"]
    end
    B3 --> S1
    B3 --> S2
    B3 --> S3

    %% ========== STYLING ==========
    classDef user fill:#f3e5f5,stroke:#6a1b9a,color:#000;
    classDef frontend fill:#bbdefb,stroke:#1976d2,color:#000;
    classDef backend fill:#ffe0b2,stroke:#ef6c00,color:#000;
    classDef database fill:#c8e6c9,stroke:#2e7d32,color:#000;
    classDef services fill:#f8bbd0,stroke:#ad1457,color:#000;

    class USERS,U1,U2,U3,U4,U5,U6,U7,U8,U9,U10,U11 user
    class FRONTEND,F1,F2 frontend
    class BACKEND,B1,B2,B3,B4,B5,B6 backend
    class DATABASE,D1,D2,D3,D4,D5,D6 database
    class SERVICES,S1,S2,S3 services
