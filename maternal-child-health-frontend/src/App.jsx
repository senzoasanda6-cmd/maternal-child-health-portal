import React from "react";
import RegisterForm from "./pages/Auth/RegisterPage.jsx"; // adjust path if needed
import LoginForm from "./pages/Auth/LoginPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import Dashboard from './pages/Dashboard.jsx'; // Placeholder for main dashboard
//import NotFound from './pages/NotFound.jsx'; // Placeholder for 404 page
import CalendarView from "./pages/CareTimeline/CalendarView.jsx";
import CareTimeline from "./pages/CareTimeline/CareTimeline.jsx";
import TimelineEvent from "./pages/CareTimeline/TimelineEvent.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import DashboaredCards from "./components/DashboaredCards.jsx";
import PostNatalCare from "./pages/HealthEducation/PostNatalCare.jsx";
import PregnancyStages from "./pages/HealthEducation/PregnancyStages.jsx";
import SafeMedicines from "./pages/HealthEducation/SafeMedicines.jsx";
// import AdminDashboard from "./pages/Dashboard/AdminDashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<LoginForm />} />
        {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/care-timeline" element={<CareTimeline />} />
        <Route path="/timeline-event/:id" element={<TimelineEvent />} />
        <Route path="/PostNatalCare" element={<PostNatalCare/>} />
        <Route path="/PregnancyStages" element={<PregnancyStages/>} />
        <Route path="/SafeMedicines" element={<SafeMedicines/>} />
        {/* Example of a protected route */}
        <Route
          path="/health"
          element={
            <ProtectedRoute allowedRoles={["health_worker"]}>
              <DashboaredCards />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
