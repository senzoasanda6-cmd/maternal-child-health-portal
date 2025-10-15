import React from "react";

const NotFoundPage = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="display-4 text-danger">404</h1>
      <p className="lead">Oops! The page you're looking for doesn't exist.</p>
      <button onClick={() => window.history.back()} className="btn btn-primary mt-3">
        Go Back
      </button>
    </div>
  );
};

export default NotFoundPage;
