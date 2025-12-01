import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import ChildCard from "../../components/ChildCard";
import GrowthChart from "../../components/GrowthChart";
import AppointmentsList from "../../components/AppointmentsList";
import MilestoneTracker from "../../components/MilestoneTracker";
import HealthRecords from "../../components/HealthRecords";
import QuickLinks from "../../components/QuickLinks";
import AppLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";
import AppCarousel from "../../components/AppCarousel";
import {
    mergeAppointmentsWithEvents,
    getUpcomingAppointments,
} from "../../services/dashboardService";

const CHILDREN_PER_PAGE = 3;

export default function MotherDashboard() {
    const [children, setChildren] = useState([]);
    const [activeChildId, setActiveChildId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const links = [
        { label: "Nutrition Guides", url: "/resources/nutrition" },
        { label: "Breastfeeding Tips", url: "/resources/breastfeeding" },
        { label: "Mental Health Support", url: "/resources/mental-health" },
        { label: "Emergency Contacts", url: "/resources/emergency" },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [childrenRes, eventsRes] = await Promise.all([
                    api.get("/children"),
                    api.get("/events").catch(() => ({ data: [] })),
                ]);

                const fetchedChildren = Array.isArray(childrenRes.data)
                    ? childrenRes.data
                    : [];
                const events = Array.isArray(eventsRes.data)
                    ? eventsRes.data
                    : [];

                setChildren(fetchedChildren);
                setCalendarEvents(events);

                if (fetchedChildren.length > 0) {
                    setActiveChildId(fetchedChildren[0].id);
                }
            } catch (err) {
                console.error("Dashboard load failed:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const totalPages = Math.ceil(children.length / CHILDREN_PER_PAGE);
    const paginatedChildren = children.slice(
        (currentPage - 1) * CHILDREN_PER_PAGE,
        currentPage * CHILDREN_PER_PAGE
    );

    const activeChild = children.find((c) => c.id === activeChildId) || null;

    // Merge child appointments with calendar events
    const enhancedAppointments = useMemo(() => {
        if (!activeChild) return [];
        return mergeAppointmentsWithEvents(
            activeChild.appointments || [],
            calendarEvents
        );
    }, [activeChild, calendarEvents]);

    const upcomingAppointments = useMemo(() => {
        if (!activeChild) return [];
        return getUpcomingAppointments(enhancedAppointments, 30).slice(0, 5);
    }, [activeChild, enhancedAppointments]);

    if (loading) return <AppLoading loadingText="Loading dashboard..." />;
    if (error) return <AppLoadError errorText={error} />;

    return (
        <div className="p-4 space-y-6">
            {/* Carousel */}
            <AppCarousel />

            {/* Children Tabs */}
            <hr />
            <h5 className="text-custom-color-primary fw-bold">
                Your Children Wellness
            </h5>
            {paginatedChildren.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {paginatedChildren.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => setActiveChildId(child.id)}
                            className={`px-4 py-2 rounded ${
                                child.id === activeChildId
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            {child.name}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    No child profiles available.
                </p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                        ◀ Prev
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                        Next ▶
                    </button>
                </div>
            )}

            {/* Active Child Dashboard */}
            <hr />
            <h5 className="text-custom-color-primary fw-bold">
                Active Child Monitor
            </h5>
            {activeChild ? (
                <div className="space-y-6 border-t pt-6 mt-6">
                    <ChildCard {...activeChild} />

                    {/* Growth */}
                    <GrowthChart data={activeChild.growthData || []} />

                    {/* Upcoming Appointments */}
                    <AppointmentsList
                        appointments={upcomingAppointments}
                        title="Upcoming Appointments"
                    />

                    {/* Milestones */}
                    <MilestoneTracker
                        milestones={activeChild.milestones || []}
                    />

                    {/* Health Records */}
                    <HealthRecords records={activeChild.records || []} />

                    {/* Full Appointments History */}
                    <AppointmentsList
                        appointments={enhancedAppointments}
                        title="All Appointments"
                    />
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    Select a child to view their dashboard.
                </p>
            )}

            {/* Quick Links */}
            <hr />
            <h5 className="text-custom-color-primary fw-bold">Quick Links</h5>
            <QuickLinks links={links} />
        </div>
    );
}
