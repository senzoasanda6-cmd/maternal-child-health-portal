# Dashboard & Calendar Integration Guide

## Overview

This document outlines the integration between the dashboard components and the calendar event management system. The integration ensures that appointment data is unified, accurate, and consistently displayed across all dashboard views.

## Architecture

### Data Flow

```
Calendar Events (API) ─┐
                       ├─> dashboardService ─> Dashboard Components
Appointments (API) ────┤
Last Visit Data ────────┤
Pregnancy Stage ────────┘
```

## Key Components

### 1. Dashboard Service (`dashboardService.js`)

The core service that handles data transformation and aggregation:

#### Main Functions

- **`fetchConsolidatedDashboardData(childId)`**: Fetches all dashboard data from multiple endpoints in parallel
  - Combines `/dashboard/last-visit`, `/dashboard/pregnancy-stage`, `/dashboard/appointments`, `/events`, and `/user` endpoints
  - Returns consolidated object with all data

- **`transformEventsToAppointments(events)`**: Converts raw calendar events into appointment format
  - Extracts date, time, type, status from events
  - Standardizes data structure for display

- **`mergeAppointmentsWithEvents(apiAppointments, events)`**: Merges API appointments with calendar events
  - Deduplicates based on date and type
  - Provides single source of truth for appointment display

- **`getUpcomingAppointments(events, daysAhead)`**: Filters events within specified days
  - Default: 30 days ahead
  - Sorted by date

- **`getAppointmentStats(events)`**: Calculates appointment statistics
  - Returns: `{ total, upcoming, today, overdue, confirmed, pending, cancelled }`

- **`formatAppointmentForDisplay(appointment)`**: Formats appointment for UI display
  - Humanizes dates (Today, Tomorrow, etc.)
  - Calculates display status and time strings

#### Supporting Functions

- `getRecentAppointments(events, daysBefore)`: Get past appointments
- `getAppointmentsByStatus(events, status)`: Filter by status
- `getAppointmentsByCareType(events, careType)`: Filter by care type
- `getAppointmentsByFacility(events, facilityId)`: Filter by facility

### 2. Enhanced Dashboard Component (`Dashboard.jsx`)

**Location**: `mch-frontend/src/pages/Dashboard/Dashboard.jsx`

**Features**:
- Fetches consolidated dashboard data using `dashboardService`
- Merges API appointments with calendar events
- Displays appointment statistics
- Shows last visit, pregnancy stage, and upcoming appointments

**Usage**:
```jsx
import Dashboard from "./pages/Dashboard/Dashboard";

// Automatically fetches calendar + appointment data
<Dashboard />
```

### 3. Dashboard Cards

#### AppointmentStatsCard
**Location**: `mch-frontend/src/pages/Dashboard/AppointmentStatsCard.jsx`

Displays quick statistics:
- Today's appointments
- Upcoming appointments
- Confirmed/Pending status counts
- Overdue appointments

#### UpcomingAppointmentsCard
**Location**: `mch-frontend/src/pages/Dashboard/UpcomingAppointmentsCard.jsx`

Enhanced features:
- Filters to next 30 days
- Shows top 5 upcoming appointments
- Displays appointment details (facility, health worker, notes)
- Status badges (confirmed, pending, cancelled, completed)
- Type icons (vaccination, prenatal, postnatal, etc.)
- Highlights today/tomorrow appointments

#### LastVisitSummaryCard
**Location**: `mch-frontend/src/pages/Dashboard/LastVisitSummaryCard.jsx`

Enhanced with:
- Formatted date (days ago display)
- Visit type badge
- Facility and provider information
- Child information
- Immunization breakdown (administered, scheduled, missed)

### 4. Mother Dashboard
**Location**: `mch-frontend/src/pages/MotherProfile/MotherDashboard.jsx`

**Integration**:
- Fetches calendar events alongside child data
- Merges calendar events with child appointments
- Passes enhanced appointment list to AppointmentsList component
- Provides unified appointment view for active child

### 5. Admin Dashboard Widget
**Location**: `mch-frontend/src/pages/Admin/AdminDashboardWidget.jsx`

**Features**:
- Displays system-wide appointment statistics
- Care type breakdown (prenatal, postnatal, vaccination, follow-up)
- Status breakdown (confirmed, pending, cancelled)
- Event summary with confirmed rate

### 6. District Dashboard Widget
**Location**: `mch-frontend/src/pages/District/DistrictCalendarWidget.jsx`

**Features**:
- District-level calendar analytics
- Facility performance table
- Appointment distribution by facility
- Performance metrics (percentage of on-time appointments)

## Data Structures

### Appointment Format
```javascript
{
  id: "event-123",
  title: "Prenatal Checkup",
  date: "2025-12-15",           // YYYY-MM-DD
  time: "14:30",                 // HH:mm
  endTime: "15:30",
  type: "prenatal",              // prenatal|postnatal|vaccination|follow-up
  status: "confirmed",           // pending|confirmed|cancelled|completed
  facilityName: "Central Clinic",
  notes: "Routine checkup",
  childName: "Baby John",
  motherName: "Jane Doe",
  healthWorker: "Dr. Smith",
  resource: "facility-1"
}
```

### Stats Format
```javascript
{
  total: 45,           // Total appointments
  upcoming: 12,        // Future appointments
  today: 2,            // Today's appointments
  overdue: 3,          // Past missed appointments
  confirmed: 30,       // Confirmed status
  pending: 10,         // Pending status
  cancelled: 5         // Cancelled status
}
```

## API Endpoints Used

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/api/events` | Fetch calendar events | Array of events |
| `/api/dashboard/last-visit` | Last visit summary | Visit object |
| `/api/dashboard/pregnancy-stage` | Current pregnancy stage | Stage object |
| `/api/dashboard/appointments` | Child appointments | `{child, appointments}` |
| `/api/user` | Current user info | User object |

## Usage Examples

### Example 1: Display Upcoming Appointments
```jsx
import { getUpcomingAppointments } from "../../services/dashboardService";

const MyComponent = ({ events }) => {
  const upcoming = getUpcomingAppointments(events, 30);
  
  return (
    <ul>
      {upcoming.map(appt => (
        <li key={appt.id}>{appt.title} - {appt.date}</li>
      ))}
    </ul>
  );
};
```

### Example 2: Get Statistics
```jsx
import { getAppointmentStats } from "../../services/dashboardService";

const StatsDisplay = ({ events }) => {
  const stats = getAppointmentStats(events);
  
  return (
    <div>
      <p>Today: {stats.today}</p>
      <p>Upcoming: {stats.upcoming}</p>
      <p>Confirmed Rate: {Math.round((stats.confirmed / stats.total) * 100)}%</p>
    </div>
  );
};
```

### Example 3: Merge Appointments
```jsx
import { mergeAppointmentsWithEvents } from "../../services/dashboardService";

const MyDashboard = ({ apiAppointments, calendarEvents }) => {
  const merged = mergeAppointmentsWithEvents(apiAppointments, calendarEvents);
  
  return <AppointmentsList appointments={merged} />;
};
```

## Integration Steps

To integrate calendar with a new dashboard component:

1. **Import the service**:
   ```jsx
   import {
     fetchConsolidatedDashboardData,
     mergeAppointmentsWithEvents,
     getAppointmentStats
   } from "../../services/dashboardService";
   ```

2. **Fetch data**:
   ```jsx
   const data = await fetchConsolidatedDashboardData(childId);
   ```

3. **Transform data**:
   ```jsx
   const merged = mergeAppointmentsWithEvents(
     data.appointments?.appointments || [],
     data.events || []
   );
   ```

4. **Calculate stats** (optional):
   ```jsx
   const stats = getAppointmentStats(data.events || []);
   ```

5. **Pass to components**:
   ```jsx
   <UpcomingAppointmentsCard appointments={merged} />
   <AppointmentStatsCard stats={stats} />
   ```

## Benefits

- ✅ **Single Source of Truth**: Calendar events and appointments are merged
- ✅ **Accurate Data**: Real-time data from calendar and API
- ✅ **Consistent Display**: Standardized formatting across all dashboards
- ✅ **Performance**: Parallel API calls reduce load time
- ✅ **Flexibility**: Easy to filter, transform, and aggregate data
- ✅ **Reusability**: Service functions can be used across multiple components

## Error Handling

The service includes graceful error handling:

```jsx
const consolidatedData = await fetchConsolidatedDashboardData(childId);
// If an endpoint fails, it returns null for that key and logs a warning
// Other endpoints continue to load normally
```

## Testing

To test the integration:

1. **Check Dashboard**: Navigate to `/dashboard`
2. **Verify Stats**: Ensure appointment statistics are displayed
3. **Check Calendar**: Verify events appear in calendar view
4. **Mother Dashboard**: Check child appointments include calendar events
5. **Admin Dashboard**: Verify system-wide statistics are accurate

## Future Enhancements

- [ ] Real-time updates via WebSockets
- [ ] Appointment notifications
- [ ] Export appointment data to CSV/PDF
- [ ] Advanced filtering and search
- [ ] Appointment reminders
- [ ] Integration with SMS/Email notifications
- [ ] Predictive analytics for missed appointments
