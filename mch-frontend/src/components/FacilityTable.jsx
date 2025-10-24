import React from "react";

const FacilityTable = ({ data }) => (
    <table className="table table-striped">
        <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Visits This Month</th>
                <th>Risk Flags</th>
            </tr>
        </thead>
        <tbody>
            {data.map((facility) => (
                <tr key={facility.id}>
                    <td>{facility.name}</td>
                    <td>{facility.type}</td>
                    <td>{facility.monthlyVisits}</td>
                    <td>{facility.riskFlags}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default FacilityTable;
