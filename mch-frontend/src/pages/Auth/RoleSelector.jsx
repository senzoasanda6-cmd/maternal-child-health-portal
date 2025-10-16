import React, { useState } from "react";
import RegisterForm from "./RegisterForm"; // Your full form component

function RoleSelector() {
    const [selectedRole, setSelectedRole] = useState("");

    const handleRoleSelect = (e) => {
        setSelectedRole(e.target.value);
    };

    return (
        <div className="role-selector-page">
            {!selectedRole ? (
                <div className="role-selection-card">
                    <h2>Select Your Role</h2>
                    <select
                        className="form-select"
                        value={selectedRole}
                        onChange={handleRoleSelect}
                    >
                        <option value="">Choose a role to continue</option>
                        <option value="mother">Mother</option>
                        <option value="child">Child</option>
                        <option value="health_worker">Health Worker</option>
                        <option value="manager">Manager</option>
                        <option value="clinical_manager">
                            Clinical Manager
                        </option>
                    </select>
                </div>
            ) : (
                <RegisterForm selectedRole={selectedRole} />
            )}
        </div>
    );
}

export default RoleSelector;
