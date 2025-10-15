import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const VaccinationsHistory = ({ childId }) => {
    const [vaccinations, setVaccinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [upcoming, setUpcoming] = useState([]);

    const filteredVaccinations = vaccinations.filter((v) => {
        const matchYear = yearFilter
            ? new Date(v.date).getFullYear().toString() === yearFilter
            : true;
        const matchType = typeFilter
            ? v.vaccine_name.toLowerCase().includes(typeFilter.toLowerCase())
            : true;
        return matchYear && matchType;
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Vaccination History", 14, 10);
        doc.autoTable({
            head: [["Vaccine", "Date"]],
            body: filteredVaccinations.map((v) => [
                v.vaccine_name,
                new Date(v.date).toLocaleDateString(),
            ]),
        });
        doc.save("vaccination-history.pdf");
    };

    useEffect(() => {
        const fetchVaccinations = async () => {
            try {
                const response = await axios.get(
                    `/api/children/${childId}/vaccinations`
                );
                setVaccinations(response.data);
            } catch (error) {
                console.error("Error fetching vaccination history:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUpcoming = async () => {
            try {
                const response = await axios.get(
                    `/api/children/${childId}/upcoming-vaccines`
                );
                setUpcoming(response.data);
            } catch (error) {
                console.error("Error fetching upcoming vaccines:", error);
            }
        };

        fetchVaccinations();
        fetchUpcoming();
    }, [childId]);

    if (loading) return <p>Loading vaccination history...</p>;

    return (
        <div className="vaccination-history">
            <h3>Vaccination History</h3>

            <select onChange={(e) => setYearFilter(e.target.value)}>
                <option value="">All Years</option>
                {[
                    ...new Set(
                        vaccinations.map((v) => new Date(v.date).getFullYear())
                    ),
                ].map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Filter by vaccine name"
                onChange={(e) => setTypeFilter(e.target.value)}
            />

            <button onClick={exportToPDF}>Export to PDF</button>

            {filteredVaccinations.length === 0 ? (
                <p>No vaccinations recorded yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Vaccine</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVaccinations.map((vaccine) => (
                            <tr key={vaccine.id}>
                                <td>{vaccine.vaccine_name}</td>
                                <td>
                                    {new Date(vaccine.date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div>
                <h4>Upcoming Vaccines</h4>
                <ul>
                    {upcoming.map((vaccine, i) => (
                        <li key={i}>{vaccine}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VaccinationsHistory;
