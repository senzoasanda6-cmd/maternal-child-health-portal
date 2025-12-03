# Dashboard & Calendar Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND APPLICATION                              │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │  API Layer       │
                              │  (axios/api.js)  │
                              └─────────┬────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
             ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
             │  /api/events   │ │ /api/dashboard │ │   /api/user    │
             │  (Calendar)    │ │ (Visits/Stage) │ │ (Auth/Profile) │
             └────────┬───────┘ └────────┬───────┘ └────────┬───────┘
                      │                  │                   │
                      └──────────────────┼───────────────────┘
                                         │
                      ┌──────────────────▼──────────────────┐
                      │   dashboardService.js               │
                      │   (Data Transformation Layer)       │
                      ├──────────────────────────────────────┤
                      │ • fetchConsolidatedDashboardData()   │
                      │ • transformEventsToAppointments()    │
                      │ • mergeAppointmentsWithEvents()      │
                      │ • getAppointmentStats()              │
                      │ • formatAppointmentForDisplay()      │
                      │ • getUpcomingAppointments()          │
                      │ • getRecentAppointments()            │
                      │ • getAppointmentsByStatus()          │
                      │ • getAppointmentsByCareType()        │
                      │ • getAppointmentsByFacility()        │
                      └──────────────────┬───────────────────┘
                                         │
            ┌────────────────────────────┼────────────────────────────┐
            │                            │                            │
            ▼                            ▼                            ▼
    ┌──────────────────────┐    ┌──────────────────────┐   ┌──────────────────┐
    │   MOTHER DASHBOARD   │    │  ADMIN DASHBOARD     │   │ DISTRICT DASHBOARD│
    ├──────────────────────┤    ├──────────────────────┤   ├──────────────────┤
    │ • Dashboard          │    │ • AdminDashboard     │   │ • DistrictDashboard
    │ • LastVisitCard      │    │ • AdminDashboardWdgt │   │ • DistrictCalWdgt
    │ • UpcomingApptCard   │    │ • StatCard           │   │ • StatCard
    │ • AppointmentStats   │    │ • ChartCard          │   │ • Table
    │ • PregnancyStageCard │    │                      │   │
    │ • MotherDashboard    │    │                      │   │
    └──────────────────────┘    └──────────────────────┘   └──────────────────┘
            │                            │                            │
            └────────────────┬───────────┴────────────────┬───────────┘
                             │                           │
                             ▼                           ▼
                    ┌──────────────────┐       ┌──────────────────┐
                    │ React Components │       │ Bootstrap UI     │
                    │ & Utilities      │       │ Components       │
                    └──────────────────┘       └──────────────────┘
```

## Data Flow Sequence Diagram

```
Dashboard Component
        │
        ├─ useEffect()
        │   │
        │   └─ fetchConsolidatedDashboardData(childId)
        │       │
        │       ├─ Promise.all([
        │       │   api.get('/dashboard/last-visit'),
        │       │   api.get('/dashboard/pregnancy-stage'),
        │       │   api.get('/dashboard/appointments?child_id=X'),
        │       │   api.get('/events'),
        │       │   api.get('/user')
        │       │ ])
        │       │
        │       └─ Returns consolidated data object
        │
        ├─ mergeAppointmentsWithEvents(
        │   apiAppointments,
        │   calendarEvents
        │ )
        │   └─ Deduplicated merged appointments
        │
        ├─ getAppointmentStats(events)
        │   └─ Aggregated statistics
        │
        └─ Render Components
            ├─ AppointmentStatsCard (stats)
            ├─ LastVisitSummaryCard (lastVisit)
            ├─ PregnancyStageCard (pregnancyStage)
            └─ UpcomingAppointmentsCard (mergedAppointments)
```

## Component Connection Map

```
┌────────────────────────────────────────────────────────────────┐
│                    dashboardService.js                         │
│              (10 Exported Functions)                           │
└────────────────────────────────────────────────────────────────┘
         │         │         │         │         │         │
         │         │         │         │         │         │
    ┌────┴────┬────┴────┬────┴────┬────┴────┬────┴────┬────┴────┐
    │          │         │         │         │         │         │
    ▼          ▼         ▼         ▼         ▼         ▼         ▼
Dashboard  Mother    Admin    District  Upcoming  Recent   Format
          Dashboard Dashboard Dashboard  Filter   Filter   Display
                              (Widget)  (Widget) (Widget)
```

## State Management Flow

```
┌─────────────────────────────────────────┐
│ Component State                         │
├─────────────────────────────────────────┤
│ • lastVisit: null                       │
│ • pregnancyStage: null                  │
│ • appointments: []                      │
│ • appointmentStats: null                │
│ • loading: true                         │
│ • error: null                           │
└──────────────────┬──────────────────────┘
                   │
        (useEffect + Promise.all)
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Consolidated Data                       │
├─────────────────────────────────────────┤
│ {                                       │
│   lastVisit: {...},                     │
│   pregnancyStage: {...},                │
│   appointments: {...},                  │
│   events: [...],                        │
│   user: {...},                          │
│   errors: []                            │
│ }                                       │
└──────────────────┬──────────────────────┘
                   │
     (Data Transformation)
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   Merged          Stats
   Appointments    Calculated
   (Array)         (Object)
```

## Error Handling Flow

```
API Call
    │
    ├─ Success ──────┐
    │                │
    └─ Error ────┐   │
                 │   │
                 ▼   ▼
            Log Warning
                 │
            Set data: null
                 │
            Continue Loading
              Other Endpoints
                 │
                 ▼
            Return Partial Data
                 │
            Component Handles
             Missing Data
```

## Data Transformation Pipeline

```
Raw Calendar Events
        │
        ▼
┌─────────────────────────────────┐
│ transformEventsToAppointments() │
│ • Extract dates/times           │
│ • Map status                    │
│ • Extract extended props        │
│ • Sort by date                  │
└────────────────┬────────────────┘
                 │
                 ▼
Standardized Appointments Array
        │
        ├─────────────────────┬────────────┬─────────────┐
        │                     │            │             │
        ▼                     ▼            ▼             ▼
   getUpcoming()      getRecent()   getByStatus()  getByFacility()
        │                     │            │             │
        ▼                     ▼            ▼             ▼
   Filtered & Sorted   Filtered & Sorted   Filtered    Filtered
        │                     │            │             │
        └─────────────────────┴────────────┴─────────────┘
                              │
                              ▼
                    UI Component Display
```

## Integration Points

```
┌────────────────────────────────────┐
│ Calendar View                      │
│ /pages/CareTimeline/CalendarView   │
└────────────────────────────────────┘
              │
              │ Uses
              ▼
┌────────────────────────────────────┐
│ dashboardService.js                │
│ (Shared Transformation Logic)      │
└────────────────────────────────────┘
              ▲
              │ Imported by
     ┌────────┴─────────────────┐
     │                          │
     ▼                          ▼
┌──────────────────┐    ┌──────────────────┐
│ Dashboard Pages  │    │ Admin/District   │
│ • Dashboard.jsx  │    │ Widgets          │
│ • MotherDshbrd   │    │ • AdminDashWdgt  │
│                  │    │ • DistrictWdgt   │
└──────────────────┘    └──────────────────┘
```

## File Organization

```
mch-frontend/src/
│
├── services/
│   ├── api.js (existing)
│   └── dashboardService.js (NEW)
│
├── pages/
│   │
│   ├── Dashboard/
│   │   ├── Dashboard.jsx (UPDATED)
│   │   ├── AppointmentStatsCard.jsx (NEW)
│   │   ├── UpcomingAppointmentsCard.jsx (UPDATED)
│   │   ├── LastVisitSummaryCard.jsx (UPDATED)
│   │   └── PregnancyStageCard.jsx (existing)
│   │
│   ├── MotherProfile/
│   │   └── MotherDashboard.jsx (UPDATED)
│   │
│   ├── Admin/
│   │   ├── AdminDashboard.jsx (existing)
│   │   └── AdminDashboardWidget.jsx (NEW)
│   │
│   ├── District/
│   │   ├── DistrictDashboard.jsx (existing)
│   │   └── DistrictCalendarWidget.jsx (NEW)
│   │
│   └── CareTimeline/
│       └── CalendarView.jsx (existing - uses same service)
│
└── components/
    └── (existing components - no changes needed)
```

## Dependencies

```
Dashboard Components
    ├── React (hooks: useState, useEffect, useContext)
    ├── react-router-dom (useParams)
    ├── moment.js (date formatting)
    ├── react-bootstrap (UI components)
    ├── axios (api.js wrapper)
    └── dashboardService.js (data transformation)
```
