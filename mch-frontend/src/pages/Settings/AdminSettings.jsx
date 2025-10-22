import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSettings() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        axios
            .get("/api/admin/settings")
            .then((res) => {
                setForm(f => ({
                    ...f,
                    name: res.data.name,
                    email: res.data.email,
                }));
            })
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/api/admin/settings", form)
            .then((res) => setMessage("Settings updated successfully."))
            .catch((err) => setMessage("Update failed."));
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Admin Settings</h2>
            {message && <div className="mb-4 text-green-600">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Name"
                    required
                />
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Email"
                    required
                />
                <input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="New Password"
                />
                <input
                    name="password_confirmation"
                    type="password"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Confirm Password"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Update
                </button>
            </form>
        </div>
    );
}
