import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/Home/HealthEducationHome.jsx";
import Dashboard from "./pages/Dashboard/Dashboard";
import CalendarView from "./pages/CareTimeline/CalendarView.jsx";
import CareTimeline from "./pages/CareTimeline/CareTimeline.jsx";
import TimelineEvent from "./pages/CareTimeline/TimelineEvent.jsx";
import PostNatalCare from "./pages/HealthEducation/PostNatalCare.jsx";
import PregnancyStages from "./pages/HealthEducation/PregnancyStages.jsx";
import SafeMedicines from "./pages/HealthEducation/SafeMedicines.jsx";
import ChildDetailsForm from "./pages/ChildProfile/ChildDetailsForm.jsx";
import ChildProfile from "./pages/ChildProfile/ChildProfile.jsx";
import PostnatalVisit from "./pages/ChildProfile/PostnatalVisits/PostnatalVisitList.jsx";
import VaccinationList from "./pages/ChildProfile/Vaccinations/Vaccinations.jsx";
import VaccineProgressChart from "./pages/ChildProfile/Vaccinations/VaccineProgressChart.jsx";
import DashboaredCards from "./components/DashboaredCards";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import GDPR from "./pages/GDPR";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import HomeLayout from "./pages/Home/LandingPage.jsx";
import NutritionResource from "./pages/Resources/NutritionResource";
import PostnatalChecklistResource from "./pages/Resources/PostnatalChecklistResource";
import BreastfeedingVideoResource from "./pages/Resources/BreastfeedingVideoResource";
import AdminDashboard from "./pages/AdminDashboard";
import MotherRoute from "./components/protected/MotherRoute.jsx";
// import HealthWorkerRoute from "./contexts/HealthWorkerRoute.jsx";
import AdminRoute from "./components/protected/AdminRoute.jsx"; // Add this import
import ChildrenList from "./pages/MotherProfile/ChildrenList";
import MotherDetailsForm from "./pages/MotherProfile/MotherDetailsForm";
import MotherProfile from "./pages/MotherProfile/MotherProfile";
import LandingPage from "./components/LandingPage.jsx";
import ServicesGrid from "./components/ServicesGrid.jsx";


const AppRoutes = () => (
    <Routes>
        {/* 🌐 Public Routes */}
        <Route element={<PublicLayout />}>
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/services" element={<ServicesGrid />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
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
        <Route path="/" element={<LandingPage />} />

        {/* 🔐 Protected Routes */}
        <Route element={<ProtectedLayout />}>
            {/* Shared Authenticated Routes */}
            <Route path="/landing" element={<HomeLayout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/care-timeline" element={<CareTimeline />} />
            <Route path="/timeline-event/:id" element={<TimelineEvent />} />
            <Route path="/PostNatalCare" element={<PostNatalCare />} />
            <Route path="/PregnancyStages" element={<PregnancyStages />} />
            <Route path="/SafeMedicines" element={<SafeMedicines />} />

            {/* 👩 Mother Routes */}
            <Route element={<MotherRoute />}>
                <Route path="/mother/home" element={<HomePage/>} />
                <Route path="/mother/dashboard" element={<DashboaredCards />} />
                <Route path="/mother/children" element={<ChildrenList />} />
                <Route
                    path="/mother/child-form"
                    element={<MotherDetailsForm />}
                />
                <Route
                    path="/mother/child-profile"
                    element={<MotherProfile />}
                />
                <Route path="/mother/calendar" element={<CalendarView />} />
                <Route
                    path="/mother/care-timeline"
                    element={<CareTimeline />}
                />
                <Route
                    path="/mother/timeline-event/:id"
                    element={<TimelineEvent />}
                />
                <Route
                    path="/mother/postnatal-care"
                    element={<PostNatalCare />}
                />
                <Route
                    path="/mother/pregnancy-stages"
                    element={<PregnancyStages />}
                />
                <Route
                    path="/mother/safe-medicines"
                    element={<SafeMedicines />}
                />
            </Route>

            {/* 🩺 Health Worker Routes */}
            <Route path="/health/dashboard" element={<DashboaredCards />} />
            <Route path="/health/calendar" element={<CalendarView />} />
            <Route path="/health/care-timeline" element={<CareTimeline />} />
            <Route
                path="/health/timeline-event/:id"
                element={<TimelineEvent />}
            />
            <Route path="/health/postnatal-care" element={<PostNatalCare />} />
            <Route
                path="/health/pregnancy-stages"
                element={<PregnancyStages />}
            />
            <Route path="/health/safe-medicines" element={<SafeMedicines />} />
            <Route
                path="/health/child-details"
                element={<ChildDetailsForm onSave={() => {}} />}
            />
            <Route
                path="/health/child-form/:id"
                element={<ChildDetailsForm onSave={() => {}} />}
            />
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

            {/* 🛡️ Admin Routes */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
        </Route>

        {/* 🧭 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;
