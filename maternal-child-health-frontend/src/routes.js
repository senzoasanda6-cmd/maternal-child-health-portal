import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "./Main.js";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

// Route Guards
import MotherRoute from "./components/protected/MotherRoute.jsx";
import AdminRoute from "./components/protected/AdminRoute.jsx";
import HealthWorkerRoute from "./components/protected/HealthWorkerRoute.jsx";

// Public Pages
import LandingPage from "./pages/Landing/LandingPage.jsx";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import GDPR from "./pages/GDPR";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

// Shared Authenticated Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import CalendarView from "./pages/CareTimeline/CalendarView.jsx";
import CareTimeline from "./pages/CareTimeline/CareTimeline.jsx";
import TimelineEvent from "./pages/CareTimeline/TimelineEvent.jsx";
import PostNatalCare from "./pages/HealthEducation/PostNatalCare.jsx";
import PregnancyStages from "./pages/HealthEducation/PregnancyStages.jsx";
import SafeMedicines from "./pages/HealthEducation/SafeMedicines.jsx";

// Mother Pages
import MotherHomePage from "./pages/Home/MotherHome.jsx";
import MotherDetailsForm from "./pages/MotherProfile/MotherDetailsForm";
import MotherProfile from "./pages/MotherProfile/MotherProfile";
import ChildrenList from "./pages/MotherProfile/ChildrenList";
import ChildProfileForm from "./pages/ChildProfile/ChildProfileForm.jsx";
import PostnatalBookingPage from "./pages/MotherProfile/PostnatalBookingPage.jsx";
import HealthEducationHome from "./pages/Home/HealthEducationHome.jsx";
import MotherDashboard from "./pages/MotherProfile/MotherDashboard.jsx";

// Health Worker Pages
import ChildDetailsForm from "./pages/ChildProfile/ChildDetailsForm.jsx";
import ChildProfile from "./pages/ChildProfile/ChildProfile.jsx";
import PostnatalVisit from "./pages/ChildProfile/PostnatalVisits/PostnatalVisitList.jsx";
import VaccinationList from "./pages/ChildProfile/Vaccinations/Vaccinations.jsx";
import VaccineProgressChart from "./pages/ChildProfile/Vaccinations/VaccineProgressChart.jsx";
import HealthPatients from "./pages/HealthWorker/HealthPatients.jsx";
import HealthDashboard from "./pages/HealthWorker/HealthDashboard.jsx";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import HospitalList from "./pages/Admin/HospitalList.jsx";

// Resources
import NutritionResource from "./pages/Resources/NutritionResource";
import PostnatalChecklistResource from "./pages/Resources/PostnatalChecklistResource";
import BreastfeedingVideoResource from "./pages/Resources/BreastfeedingVideoResource";
import MentalHealth from "./components/MentalHealth.jsx";
import EmergencyResources from "./components/EmergencyResources.jsx";
import BreastfeedingFAQ from "./components/BreastfeedingFAQ.jsx";

const AppRoutes = () => (
    <Routes>
        {/* 🌐 Public Routes */}
        <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/main" element={<Main />} />
            <Route
                path="/resources/breastfeeding"
                element={<BreastfeedingFAQ />}
            />
            <Route
                path="/resources/emergency"
                element={<EmergencyResources />}
            />
            <Route path="/resources/mental-health" element={<MentalHealth />} />
            <Route
                path="/resources/nutrition"
                element={<NutritionResource />}
            />
            <Route
                path="/resources/postnatal-checklist"
                element={<PostnatalChecklistResource />}
            />
            <Route
                path="/resources/breastfeeding-video"
                element={<BreastfeedingVideoResource />}
            />
        </Route>

        {/* 🔐 Protected Routes */}
        <Route element={<ProtectedLayout />}>
            {/* Shared Authenticated Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/care-timeline" element={<CareTimeline />} />
            <Route path="/timeline-event/:id" element={<TimelineEvent />} />
            <Route path="/postnatal-care" element={<PostNatalCare />} />
            <Route path="/pregnancy-stages" element={<PregnancyStages />} />
            <Route path="/safe-medicines" element={<SafeMedicines />} />
            <Route path="/health-education" element={<HealthEducationHome />} />
            {/* 👩 Mother Routes */}
            <Route element={<MotherRoute />}>
                <Route path="/mother/home" element={<MotherHomePage />} />
                <Route path="/mother/dashboard" element={<MotherDashboard />} />
                <Route path="/mother/form" element={<MotherDetailsForm />} />
                <Route path="/mother/mom-profile" element={<MotherProfile />} />
                <Route path="/mother/children" element={<ChildrenList />} />
                <Route
                    path="/mother/child-form"
                    element={<ChildProfileForm />}
                />
                <Route
                    path="/appointments"
                    element={<PostnatalBookingPage />}
                />
            </Route>

            {/* 🩺 Health Worker Routes */}
            <Route element={<HealthWorkerRoute />}>
                <Route
                    path="/health/child-details"
                    element={<ChildDetailsForm onSave={() => {}} />}
                />
                <Route
                    path="/health/child-form/:id"
                    element={<ChildDetailsForm onSave={() => {}} />}
                />
                <Route path="/health/dashboard" element={<HealthDashboard />} />

                <Route
                    path="/health/child-profile/:childId"
                    element={<ChildProfile />}
                />
                <Route
                    path="/health/postnatal-visits/:childId"
                    element={<PostnatalVisit />}
                />
                <Route
                    path="/health/vaccinations/:childId"
                    element={<VaccinationList />}
                />
                <Route
                    path="/health/vaccine-progress/:childId"
                    element={<VaccineProgressChart />}
                />
                <Route element={<HealthWorkerRoute />}>
                    <Route
                        path="/health/patients"
                        element={<HealthPatients />}
                    />
                </Route>
            </Route>

            {/* 🛡️ Admin Routes */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/hospitals" element={<HospitalList />} />
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
        </Route>

        {/* 🧭 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;
