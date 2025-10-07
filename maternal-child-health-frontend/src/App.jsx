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
// import AdminDashboard from "./pages/Dashboard/AdminDashboard.jsx";
import ChildDetailsForm from "./pages/ChildProfile/ChildDetailsForm.jsx";
import ChildProfile from "./pages/ChildProfile/ChildProfile.jsx";
import PostnatalVisit from "./pages/ChildProfile/PostnatalVisits/PostnatalVisitList.jsx";
import VaccinationList from "./pages/ChildProfile/Vaccinations/Vaccinations.jsx";
import VaccineProgressChart from "./pages/ChildProfile/Vaccinations/VaccineProgressChart.jsx";
import { useEffect, useState } from "react";
import { getUser } from "./services/api";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            getUser()
                .then(setUser)
                .catch(() => {
                    localStorage.clear();
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);
    if (loading) return <div>Loading...</div>;

    // if (!user) {
    //     return (
    //         <Router>
    //             <Routes>
    //                 <Route path="/register" element={<RegisterForm />} />
    //                 <Route path="/" element={<CareTimeline />} />
    //                 {/* <Route path="*" element={<NotFound />} /> */}
    //             </Routes>
    //         </Router>
    //     );
    // }
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<Dashboard />} /> */}
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/" element={<LoginForm />} />
                {/* <Route path="*" element={<NotFound />} /> */}
                <Route path="/calendar" element={<CalendarView />} />
                {/* <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin", "health_worker", "mother"]}
                        >
                            {user.role === "admin" ? (
                                <AdminDashboard />
                            ) : user.role === "health_worker" ? (
                                <DashboaredCards />
                            ) : (
                                <CareTimeline />
                            )}
                        </ProtectedRoute>
                    }
                /> */}

                <Route path="/timeline-event/:id" element={<TimelineEvent />} />
                <Route
                    path="/child-details"
                    element={<ChildDetailsForm onSave={() => {}} />}
                />
                <Route
                    path="/child-form/:id"
                    element={<ChildDetailsForm onSave={() => {}} />}
                />
                <Route
                    path="/child-profile/:childId"
                    element={<ChildProfile childId={1} />}
                />
                <Route
                    path="/postnatal-visits/:childId"
                    element={<PostnatalVisit childId={1} />}
                />
                <Route
                    path="/vaccinations/:childId"
                    element={<VaccinationList childId={1} />}
                />
                <Route
                    path="/vaccine-progress/:childId"
                    element={<VaccineProgressChart childId={1} />}
                />
                {/* Example of a protected route */}
                <Route
                    path="/health"
                    element={
                        <ProtectedRoute allowedRoles={["health_worker"]}>
                            <DashboaredCards />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<div>404 - Page Not Found</div>} />

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
