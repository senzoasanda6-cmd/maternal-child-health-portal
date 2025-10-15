import React from "react";

function AppPageLoading({ loadingText = "Loading, please wait..." }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 h-100"
      style={{ minHeight: "80vh" }}
    >
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fw-bold text-primary">{loadingText}</p>
      </div>
    </div>
  );
}

export default AppPageLoading;