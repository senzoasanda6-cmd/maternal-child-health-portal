# Quick Reference: Dashboard & Calendar Integration

## TL;DR

The dashboard now pulls real data from the calendar and appointment system. Use `dashboardService.js` to get consolidated, formatted appointment data.

## Quick Import & Usage

```jsx
// 1. Import the service
import {
  fetchConsolidatedDashboardData,
  mergeAppointmentsWithEvents,
  getAppointmentStats,
  getUpcomingAppointments
} from "../../services/dashboardService";

// 2. Fetch data (in useEffect)
const data = await fetchConsolidatedDashboardData(childId);

// 3. Process data
const appointments = mergeAppointmentsWithEvents(
  data.appointments?.appointments || [],
  data.events || []
);
const stats = getAppointmentStats(data.events || []);

// 4. Use in components
<UpcomingAppointmentsCard appointments={appointments} />
<AppointmentStatsCard stats={stats} />
```

## Service Functions Reference

### Main Function
```jsx
const data = await fetchConsolidatedDashboardData(childId);
// Returns: { lastVisit, pregnancyStage, appointments, events, user, errors }
```

### Filtering Functions
```jsx
// Get upcoming appointments (next 30 days)
const upcoming = getUpcomingAppointments(events, 30);

// Get past appointments (last 90 days)
const recent = getRecentAppointments(events, 90);

// Get by status
const confirmed = getAppointmentsByStatus(events, "confirmed");
const pending = getAppointmentsByStatus(events, "pending");

// Get by care type
const prenatal = getAppointmentsByCareType(events, "prenatal");

// Get by facility
const facilityAppts = getAppointmentsByFacility(events, "facility-id");
```

### Transformation Functions
```jsx
// Convert calendar events to appointment format
const appointments = transformEventsToAppointments(events);

// Merge API appointments with calendar events (deduped)
const merged = mergeAppointmentsWithEvents(apiAppts, events);

// Format single appointment for display
const formatted = formatAppointmentForDisplay(appointment);
// Returns: { displayDate, displayTime, displayStatus, isUpcoming, isToday, ... }
```

### Statistics Functions
```jsx
const stats = getAppointmentStats(events);
// Returns: { total, upcoming, today, overdue, confirmed, pending, cancelled }
```

## Appointment Object Structure

```javascript
{
  id: "event-123",
  title: "Prenatal Checkup",
  date: "2025-12-15",           // YYYY-MM-DD
  time: "14:30",
  endTime: "15:30",
  type: "prenatal",             // prenatal|postnatal|vaccination
  status: "confirmed",          // pending|confirmed|cancelled|completed
  facilityName: "Central Clinic",
  notes: "Routine checkup",
  childName: "Baby John",
  motherName: "Jane Doe",
  healthWorker: "Dr. Smith",
  displayDate: "Dec 15, 2025",
  displayTime: " at 14:30",
  displayStatus: "Confirmed",
  isUpcoming: true,
  isPast: false,
  isToday: false,
  isTomorrow: false
}
```

## Common Patterns

### Pattern 1: Display Upcoming Appointments
```jsx
const [appointments, setAppointments] = useState([]);

useEffect(() => {
  const loadData = async () => {
    const data = await fetchConsolidatedDashboardData(childId);
    const upcoming = getUpcomingAppointments(data.events, 30);
    setAppointments(upcoming);
  };
  loadData();
}, [childId]);

return <UpcomingAppointmentsCard appointments={appointments} />;
```

### Pattern 2: Show Statistics Dashboard
```jsx
const [stats, setStats] = useState(null);

useEffect(() => {
  const loadStats = async () => {
    const data = await fetchConsolidatedDashboardData();
    const stats = getAppointmentStats(data.events);
    setStats(stats);
  };
  loadStats();
}, []);

return (
  <>
    <div>Today: {stats?.today}</div>
    <div>Upcoming: {stats?.upcoming}</div>
    <div>Confirmed: {stats?.confirmed}</div>
  </>
);
```

### Pattern 3: Merge Multiple Data Sources
```jsx
const [merged, setMerged] = useState([]);

useEffect(() => {
  const loadMerged = async () => {
    const data = await fetchConsolidatedDashboardData(childId);
    const merged = mergeAppointmentsWithEvents(
      data.appointments?.appointments || [],
      data.events || []
    );
    setMerged(merged);
  };
  loadMerged();
}, [childId]);

return <AppointmentsList appointments={merged} />;
```

### Pattern 4: Filter by Multiple Criteria
```jsx
const getRelevantAppointments = (events) => {
  return events
    .filter(e => moment(e.date).isBefore(moment().add(30, 'days')))
    .filter(e => e.status === 'confirmed')
    .filter(e => e.type === 'prenatal')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};
```

## Common Issues & Solutions

### Issue 1: Getting null/undefined data
**Solution**: Check if data exists before using
```jsx
const appointments = mergeAppointmentsWithEvents(
  data.appointments?.appointments || [],  // ← Fallback to []
  data.events || []                        // ← Fallback to []
);
```

### Issue 2: Dates not formatting correctly
**Solution**: Ensure moment is imported and used correctly
```jsx
import moment from "moment";

const dateStr = moment(appointment.date).format("MMM DD, YYYY");
```

### Issue 3: Component not updating after data fetch
**Solution**: Ensure dependencies are correct in useEffect
```jsx
useEffect(() => {
  // ... fetch data ...
}, [childId, user, authLoading]); // ← Include all dependencies
```

### Issue 4: Slow dashboard load
**Solution**: Use memoization and optimize re-renders
```jsx
const appointments = React.useMemo(() => {
  return mergeAppointmentsWithEvents(apiAppts, events);
}, [apiAppts, events]);
```

## Files Modified

| File | Changes |
|------|---------|
| `Dashboard.jsx` | Uses dashboardService, displays stats |
| `UpcomingAppointmentsCard.jsx` | Enhanced with details, status badges |
| `LastVisitSummaryCard.jsx` | Shows immunizations, provider info |
| `MotherDashboard.jsx` | Merges calendar events with appointments |
| `dashboardService.js` | NEW - Core transformation service |
| `AppointmentStatsCard.jsx` | NEW - Quick stats display |
| `AdminDashboardWidget.jsx` | NEW - Admin calendar analytics |
| `DistrictCalendarWidget.jsx` | NEW - District performance metrics |

## Testing Checklist

- [ ] Can fetch all dashboard data without errors
- [ ] Appointments display with correct dates/times
- [ ] Status badges show correct colors
- [ ] Icons display for different appointment types
- [ ] Statistics calculate correctly
- [ ] Merging deduplicates properly
- [ ] Filters work for status/type/facility
- [ ] Error handling works with missing data
- [ ] Performance is acceptable (< 2s load)

## API Endpoints

```
GET /api/events
GET /api/dashboard/last-visit
GET /api/dashboard/pregnancy-stage
GET /api/dashboard/appointments?child_id=X
GET /api/user
```

## Browser Console Debugging

```javascript
// In browser console, test the service:
await dashboardService.fetchConsolidatedDashboardData(1)
// Inspect the returned data

// Test transformations:
dashboardService.transformEventsToAppointments(events)
dashboardService.getAppointmentStats(events)
dashboardService.getUpcomingAppointments(events, 30)
```

## Performance Tips

1. **Use memoization** for expensive calculations
2. **Parallel API calls** are already used (Promise.all)
3. **Cache data** if making multiple requests
4. **Use React.lazy** if dashboard becomes too large
5. **Optimize re-renders** with proper dependencies

## Resources

- Full Guide: `DASHBOARD_CALENDAR_INTEGRATION.md`
- Architecture: `DASHBOARD_ARCHITECTURE_DIAGRAMS.md`
- Implementation: `DASHBOARD_INTEGRATION_SUMMARY.md`
- Service: `mch-frontend/src/services/dashboardService.js`

## Support

For issues or questions:
1. Check the full integration guide
2. Review the service function documentation
3. Check browser console for errors
4. Verify API endpoints are responding
5. Check component props are passed correctly

## Next Steps

To add dashboard integration to a new component:

1. Import the service functions you need
2. Create useEffect to fetch data
3. Transform and process data
4. Pass to display components
5. Test with real data
6. Optimize performance if needed

---

**Last Updated**: November 22, 2025
