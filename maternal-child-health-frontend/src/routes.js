import React from "react";
import { Routes, Route } from "react-router-dom";
// import HealthWorkerRoute from "./contexts/HealthWorkerRoute.jsx";

import Main from "./Main.js";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

// Component Routers
import MotherRoute from "./components/protected/MotherRoute.jsx";
import AdminRoute from "./components/protected/AdminRoute.jsx";
import Mother from "./pages/MotherProfile/MotherDashboard.jsx";

// Landing Page
import LandingPage from "./pages/Landing/LandingPage.jsx";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

// Home Pages
import HomeLayout from "./pages/Home/LandingPage.jsx";
import MotherHomePage from "./pages/Home/MotherHome.jsx";
import HealthEducationHome from "./pages/Home/HealthEducationHome.jsx";

// Dashboard Pages  
import Dashboard from "./pages/Dashboard/Dashboard";

// Care Timeline Pages
import CalendarView from "./pages/CareTimeline/CalendarView.jsx";
import CareTimeline from "./pages/CareTimeline/CareTimeline.jsx";
import TimelineEvent from "./pages/CareTimeline/TimelineEvent.jsx";
import AdminRescheduleDashboard from "./pages/CareTimeline/AdminRescheduleDashboard.jsx";

// Health Education Pages
import PostNatalCare from "./pages/HealthEducation/PostNatalCare.jsx";
import PregnancyStages from "./pages/HealthEducation/PregnancyStages.jsx";
import SafeMedicines from "./pages/HealthEducation/SafeMedicines.jsx";

// Child Profile Pages
import ChildDetailsForm from "./pages/ChildProfile/ChildDetailsForm.jsx";
import ChildProfile from "./pages/ChildProfile/ChildProfile.jsx";
import PostnatalVisit from "./pages/ChildProfile/PostnatalVisits/PostnatalVisitList.jsx";
import VaccinationList from "./pages/ChildProfile/Vaccinations/Vaccinations.jsx";
import VaccineProgressChart from "./pages/ChildProfile/Vaccinations/VaccineProgressChart.jsx";
import ChildProfileForm from "./pages/ChildProfile/ChildProfileForm.jsx";

// Dashboard Components
import DashboaredCards from "./components/DashboardCards.jsx";
import ServicesGrid from "./components/ServicesGrid.jsx";

// Public Pages
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import GDPR from "./pages/GDPR";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import NutritionResource from "./pages/Resources/NutritionResource";
import PostnatalChecklistResource from "./pages/Resources/PostnatalChecklistResource";
import BreastfeedingVideoResource from "./pages/Resources/BreastfeedingVideoResource";

// Mother Profile Pages
import ChildrenList from "./pages/MotherProfile/ChildrenList";
import MotherDetailsForm from "./pages/MotherProfile/MotherDetailsForm";
import MotherProfile from "./pages/MotherProfile/MotherProfile";
import PostnatalBookingPage from "./pages/MotherProfile/PostnatalBookingPage.jsx";

// Resource Pages
import MentalHealth from "./components/MentalHealth.jsx";
import EmergencyResources from "./components/EmergencyResources.jsx";
import BreastfeedingFAQ from "./components/BreastfeedingFAQ.jsx";
import PreNatalVisitForm from "./pages/PrenatalVisits/PrenatalVisitForm.jsx"
import PreNatalVisit from "./pages/PrenatalVisits/PrenatalVisits.jsx";
import NotificationBell from "./pages/Notifications/NotificationBell.jsx";
import NotificationItem from "./pages/Notifications/NotificationItem.jsx";
import NotificationList from "./pages/Notifications/NotificationList.jsx";
import Notification from "./pages/Notifications/Alerts.jsx";
import AccountSettings from "./pages/Settings/AccountSettings.jsx";
import NotificationPreferences from "./pages/Settings/NotificationPreferences.jsx";
import Settings from "./pages/Settings/Settings.jsx";

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
            <Route path="/services" element={<ServicesGrid />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="Main" element={<Main />} />
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
        
        <Route path="/prenatalVisitForm" element={<PreNatalVisitForm/>} />
        <Route path="/prenatalVisits" element={<PreNatalVisit/>} />
        
         <Route path="/notification" element={<Notification />} />
        <Route path="/notificationBell" element={<NotificationBell />} />
        <Route path="/notificationItem" element={<NotificationItem />} />
        <Route path="/notificationList" element={<NotificationList />} />
        <Route path="/Alerts" element={<Alerts/>} />

        <Route path="/AccountSettings" element={<AccountSettings/>} />
        <Route path="/NotificationPreferences" element={<NotificationPreferences/>} />
        <Route path="/Settings" element={<Settings/>} />


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
                <Route
                    path="/admin/reschedule-dashboard"
                    element={<AdminRescheduleDashboard />}
                />
                <Route path="/mother/home" element={<MotherHomePage />} />
                <Route path="/mother/form" element={<MotherDetailsForm />} />
                <Route
                    path="/mother/dashboard-cards"
                    element={<DashboaredCards />}
                />
                <Route path="/mother/dashboard" element={<Mother />} />
                <Route path="/mother/children" element={<ChildrenList />} />
                <Route
                    path="/mother/child-form/:id"
                    element={<ChildProfileForm />}
                />
                <Route
                    path="/appointments"
                    element={<PostnatalBookingPage />}
                />
                <Route
                    path="/mother/child-form"
                    element={<MotherDetailsForm />}
                />
                <Route
                    path="/mother/mom-profile"
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
                <Route
                    path="/mother/health-education"
                    element={<HealthEducationHome />}
                />
            </Route>

            {/* 🩺 Health Worker Routes */}
            <Route
                path="/health/dashboard-cards"
                element={<DashboaredCards />}
            />
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
