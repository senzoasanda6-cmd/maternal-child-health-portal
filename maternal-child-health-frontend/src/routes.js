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
import ChildrenList from "./pages/MotherProfile/ChildrenList";
import MotherDetailsForm from "./pages/MotherProfile/MotherDetailsForm";
import MotherProfile from "./pages/MotherProfile/MotherProfile";

const AppRoutes = () => (
    <Routes>
        <Route element={<PublicLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />

            <Route
                path="/resources/nutrition"
                element={<NutritionResource />}
            />
            <Route
                path="/resources/postnatal-checklist"
                element={<PostnatalChecklistResource />}
            />
        </Route>
        <Route path="*" element={<NotFoundPage />} />

        <Route
            path="/resources/breastfeeding-video"
            element={<BreastfeedingVideoResource />}
        />

        <Route element={<ProtectedLayout />}>
            <Route path="/landing" element={<HomeLayout />} />
            <Route path="/mother/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/care-timeline" element={<CareTimeline />} />
            <Route path="/timeline-event/:id" element={<TimelineEvent />} />
            <Route path="/PostNatalCare" element={<PostNatalCare />} />
            <Route path="/PregnancyStages" element={<PregnancyStages />} />
            <Route path="/SafeMedicines" element={<SafeMedicines />} />
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
                <Route path="/children" element={<ChildrenList />} />
                <Route path="/mother-form" element={<MotherDetailsForm />} />
                <Route path="/mother-profile" element={<MotherProfile />} />
                {/* Fallback route for other paths */}
                {/* <Route path="/*" element={<AppRoutes />} /> */}
            <Route path="/health/dashboard" element={<DashboaredCards />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
    </Routes>
);

export default AppRoutes;
