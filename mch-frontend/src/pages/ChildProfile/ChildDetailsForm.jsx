import React, { useState, useEffect } from "react";
import axios from "axios";

const ChildDetailsForm = ({ child = null, onSave }) => {
    const [form, setForm] = useState({
        name: child?.name || "",
        dob: child?.dob || "",
        mother_id: child?.mother_id || "",
        hospital_id: child?.hospital_id || "",
    });

    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const token = localStorage.getItem("token"); // adjust if stored elsewhere
                const res = await axios.get("/api/admin/hospitals", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHospitals(res.data);
            } catch (error) {
                console.error(
                    "Failed to fetch hospitals:",
                    error.response?.data || error.message
                );
            }
        };

        fetchHospitals();
    }, []);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const endpoint = child
                ? `/api/children/${child.id}`
                : "/api/children";
            const method = child ? "put" : "post";
            await axios[method](endpoint, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onSave();
        } catch (error) {
            console.error(
                "Failed to save child:",
                error.response?.data || error.message
            );
            alert(
                "Error saving child. Please check your input or permissions."
            );
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Child's Name"
                required
            />
            <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="mother_id"
                value={form.mother_id}
                onChange={handleChange}
                placeholder="Mother ID"
                required
            />
            <select
                name="hospital_id"
                value={form.hospital_id}
                onChange={handleChange}
                required
            >
                <option value="">Select Hospital</option>
                {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                        {h.name}
                    </option>
                ))}
            </select>
            <button type="submit">{child ? "Update" : "Create"} Child</button>
        </form>
    );
};

export default ChildDetailsForm;
