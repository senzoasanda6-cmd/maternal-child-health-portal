import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Settings = () => {
    const [profile, setProfile] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirmation: "",
        current_password: "",
    });
    const [notificationSettings, setNotificationSettings] = useState({
        send_appointment_reminders: true,
        reminder_days_before: 1,
        send_high_risk_alerts: true,
        send_reports: true,
        report_frequency: "weekly",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, settingsRes] = await Promise.all([
                    api.get("/district/profile"),
                    api.get("/district/settings"),
                ]);

                setProfile(profileRes.data);
                setSettings(settingsRes.data);
                setFormData({
                    name: profileRes.data.name,
                    email: profileRes.data.email,
                    phone: profileRes.data.phone || "",
                    password: "",
                    passwordConfirmation: "",
                    current_password: "",
                });
                setNotificationSettings(
                    settingsRes.data.notification_settings
                );
            } catch (err) {
                console.error("Failed to load settings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (e) => {
        const { name, type, value, checked } = e.target;
        setNotificationSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        if (
            formData.password &&
            formData.password !== formData.passwordConfirmation
        ) {
            alert("Passwords do not match");
            return;
        }

        try {
            const data = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            };

            if (formData.password) {
                data.password = formData.password;
                data.password_confirmation = formData.passwordConfirmation;
                data.current_password = formData.current_password;
            }

            await api.put("/district/profile", data);
            alert("Profile updated successfully");
            setFormData((prev) => ({
                ...prev,
                password: "",
                passwordConfirmation: "",
                current_password: "",
            }));
        } catch (err) {
            alert("Failed to update profile");
        }
    };

    const handleSaveNotifications = async (e) => {
        e.preventDefault();

        try {
            await api.put("/district/settings", {
                notification_settings: notificationSettings,
            });
            alert("Notification settings updated successfully");
        } catch (err) {
            alert("Failed to update settings");
        }
    };

    if (loading) return <p>Loading settings...</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">District Settings</h2>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${
                            activeTab === "profile" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${
                            activeTab === "notifications" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("notifications")}
                    >
                        Notifications
                    </button>
                </li>
            </ul>

            {/* Profile Tab */}
            {activeTab === "profile" && profile && (
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSaveProfile}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <hr />

                            <h5>Change Password (Optional)</h5>

                            <div className="mb-3">
                                <label className="form-label">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleProfileChange}
                                    placeholder="Required if changing password"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="passwordConfirmation"
                                    value={formData.passwordConfirmation}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSaveNotifications}>
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="appointmentReminders"
                                    name="send_appointment_reminders"
                                    checked={
                                        notificationSettings.send_appointment_reminders
                                    }
                                    onChange={handleNotificationChange}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="appointmentReminders"
                                >
                                    Send appointment reminders
                                </label>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Remind
                                    (days before appointment)
                                </label>
                                <select
                                    className="form-select"
                                    name="reminder_days_before"
                                    value={
                                        notificationSettings.reminder_days_before
                                    }
                                    onChange={handleNotificationChange}
                                >
                                    {[0, 1, 2, 3, 5, 7].map((day) => (
                                        <option key={day} value={day}>
                                            {day === 0
                                                ? "Same day"
                                                : `${day} day${
                                                      day !== 1 ? "s" : ""
                                                  }`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="highRiskAlerts"
                                    name="send_high_risk_alerts"
                                    checked={
                                        notificationSettings.send_high_risk_alerts
                                    }
                                    onChange={handleNotificationChange}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="highRiskAlerts"
                                >
                                    Send high-risk case alerts
                                </label>
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="sendReports"
                                    name="send_reports"
                                    checked={notificationSettings.send_reports}
                                    onChange={handleNotificationChange}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="sendReports"
                                >
                                    Send periodic reports
                                </label>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Report Frequency
                                </label>
                                <select
                                    className="form-select"
                                    name="report_frequency"
                                    value={
                                        notificationSettings.report_frequency
                                    }
                                    onChange={handleNotificationChange}
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save Notification Settings
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
