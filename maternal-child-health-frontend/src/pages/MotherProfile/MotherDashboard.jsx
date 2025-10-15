import React, { useEffect, useState } from "react";
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

const CHILDREN_PER_PAGE = 3;

export default function Dashboard() {
    const [children, setChildren] = useState([]);
    const [activeChildId, setActiveChildId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
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
                const res = await api.get("/api/children");
                const data = Array.isArray(res.data) ? res.data : [];
                setChildren(data);
                if (data.length > 0) {
                    setActiveChildId(data[0].id);
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
    const paginatedChildren = Array.isArray(children)
        ? children.slice(
              (currentPage - 1) * CHILDREN_PER_PAGE,
              currentPage * CHILDREN_PER_PAGE
          )
        : [];

    const activeChild = Array.isArray(children)
        ? children.find((c) => c.id === activeChildId)
        : null;

    if (loading)
        return <AppLoading loadingText="Loading dashboard..."/>;
    if (error) return <AppLoadError errorText={error} />;

    return (
        <div className="p-4 space-y-6">
            {/* carousel */}
            <AppCarousel />

            <hr />
<h3>Your Childrens Wellness Analysis</h3>
            {/* Tabs */}
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
            
            <hr />
<h3>Active Child Monitor</h3>
            {/* Active Child Dashboard */}
            {activeChild ? (
                <div className="space-y-6 border-t pt-6 mt-6">
                    <ChildCard {...activeChild} />
                    <GrowthChart data={activeChild.growthData || []} />
                    <AppointmentsList
                        appointments={activeChild.appointments || []}
                    />
                    <MilestoneTracker
                        milestones={activeChild.milestones || []}
                    />
                    <HealthRecords records={activeChild.records || []} />
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    Select a child to view their dashboard.
                </p>
            )}

            <hr />
            <h3>Quick Links</h3>
            <QuickLinks links={links} />
        </div>
    );
}
