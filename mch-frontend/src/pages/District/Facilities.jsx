import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Facilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("");
    const [filterRisk, setFilterRisk] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await api.get("/api/district/facilities");
                setFacilities(res.data || []);
            } catch (err) {
                console.error("Failed to load facilities:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    if (loading) return <p>Loading facilities...</p>;

    // Filter logic
    const filteredFacilities = facilities.filter((f) => {
        const matchesType = filterType ? f.type === filterType : true;
        const matchesRisk = filterRisk
            ? f.risk_flags >= parseInt(filterRisk)
            : true;
        return matchesType && matchesRisk;
    });

    // Search logic
    const searchedFacilities = filteredFacilities.filter((f) =>
        `${f.name} ${f.location}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleExport = async () => {
        try {
            setExporting(true);
            const params = new URLSearchParams();
            if (filterType) params.append("type", filterType);
            if (filterRisk) params.append("min_risk", filterRisk);

            const response = await api.get(
                `/api/district/facilities/export?${params.toString()}`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], {
                type: "text/csv;charset=utf-8",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "district_facilities.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export CSV. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">My District Facilities</h2>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="clinic">Clinic</option>
                        <option value="hospital">Hospital</option>
                        <option value="mobile">Mobile Unit</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={filterRisk}
                        onChange={(e) => setFilterRisk(e.target.value)}
                    >
                        <option value="">All Risk Levels</option>
                        <option value="0">No Flags</option>
                        <option value="1">1+ Flags</option>
                        <option value="5">5+ Flags</option>
                    </select>
                </div>
            </div>

            {/* Search */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by name or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Export Button */}
            <button
                className="btn btn-outline-primary mb-3"
                onClick={handleExport}
                disabled={exporting}
            >
                {exporting ? "Exporting..." : "Export to CSV"}
            </button>

            {/* Facilities Table */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Monthly Visits</th>
                        <th>Risk Flags</th>
                    </tr>
                </thead>
                <tbody>
                    {searchedFacilities.length > 0 ? (
                        searchedFacilities.map((facility) => (
                            <tr key={facility.id}>
                                <td>{facility.name}</td>
                                <td>{facility.type}</td>
                                <td>{facility.location}</td>
                                <td>{facility.monthly_visits}</td>
                                <td>{facility.risk_flags}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                No facilities found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Facilities;
