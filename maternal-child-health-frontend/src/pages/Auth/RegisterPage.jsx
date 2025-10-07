import React, { useState } from "react";
import { register } from "../../services/api";

function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "", // new field
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(form);
      console.log("Registered:", data.user);
    } catch (err) {
      console.error("Registration failed:", err.response?.data);
    }
  };
  const currentUserRole = "admin"; // Replace with actual current user role

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        name="password_confirmation"
        type="password"
        value={form.password_confirmation}
        onChange={handleChange}
        placeholder="Confirm Password"
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="">Select Role</option>
        <option value="mother">Mother</option>
        <option value="child">Child</option>
        <option value="health_worker">Health Worker</option>
        {currentUserRole === "admin" && (
          <>
            <option value="manager">Manager</option>
            <option value="clinical_manager">Clinical Manager</option>
          </>
        )}
      </select>
      <select name="hospital_id" value={form.hospital_id} onChange={handleChange}>
  <option value="">Select Hospital</option>
  {/* Replace with dynamic hospital list */}
  <option value="1">Johannesburg General</option>
  <option value="2">Soweto Clinic</option>
</select>

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
