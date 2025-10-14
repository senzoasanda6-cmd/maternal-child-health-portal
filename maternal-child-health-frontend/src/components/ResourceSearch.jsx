import React, { useState } from "react";
import Navbar from "./PublicNavbar.jsx";

const ResourceSearch = ({ resources, onFilter }) => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");

    const handleSearch = () => {
        const filtered = resources.filter((r) => {
            const matchesQuery = r.title
                .toLowerCase()
                .includes(query.toLowerCase());
            const matchesCategory = category ? r.category === category : true;
            return matchesQuery && matchesCategory;
        });
        onFilter(filtered);
    };

    return (
        <>
            
            <div className="mb-4">
                <div className="d-flex gap-3 flex-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search resources..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Pregnancy">Pregnancy</option>
                        <option value="Postnatal">Postnatal</option>
                        <option value="Nutrition">Nutrition</option>
                    </select>
                    <button className="btn btn-primary" onClick={handleSearch}>
                        Filter
                    </button>
                </div>
            </div>
        </>
    );
};

export default ResourceSearch;
