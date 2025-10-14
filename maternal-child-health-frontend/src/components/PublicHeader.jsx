import React from "react";
import { Link } from "react-router-dom";

function PublicHeader() {
    return (
        <header className="navbar header-public" style={{position: "sticky", top: "0", zIndex: "1000"}}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src="/gdoh.jpeg"
                        alt="health"
                        className=""
                        style={{ height: "100px", marginRight: "10px" }}
                    />
                    <p
                        className="mb-0 "
                        style={{
                            fontSize: "18px",
                            color: "#1d4189",
                            fontWeight: "600",
                        }}
                    >
                        Maternal Child Health Portal
                    </p>
                    {/* <img src="/gdoh.jpeg" alt="health" style={{ height:'50px', width:'100px'}} /> */}
                </Link>
                <button
                    className="navbar-togglerz button button-primary"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    {/* <span className="navbar-toggler-icon"></span> */}
                    <img
                        src="./icons/hamburger-svgrepo-com.svg"
                        alt="menu"
                        style={{ height: "15px" }}
                    />
                </button>
                <div className="py-2 collapse navbar-collapse" id="navbarNav">
                    <div className="d-flex gap-2 justify-content-between align-items-center w-100">
                        <ul
                            className="navbar-navz list-group list-group-horizontal justify-content-end d-flexz me-auto mb-2 mb-lg-0"
                            style={{ minHeight: "50px" }}
                        >
                            <li className="nav-item d-flex justify-content-end">
                                <Link
                                    to="/"
                                    className="nav-link px-3 pt-2 active"
                                    aria-current="page"
                                >
                                    <span className=" anim-link">Home</span>
                                </Link>
                            </li>
                            <li className="nav-item d-flex justify-content-end">
                                <Link to="/terms" className="nav-link px-3 pt-2">
                                    <span className=" anim-link">Terms</span>
                                </Link>
                            </li>
                            <li className="nav-item d-flex justify-content-end">
                                <Link to="/services" className="nav-link px-3 pt-2">
                                    <span className=" anim-link">Services</span>
                                </Link>
                            </li>
                            <li className="nav-item d-flex justify-content-end">
                                <Link
                                    to="/resources/nutrition"
                                    className="nav-link px-3 pt-2"
                                >
                                    <span className=" anim-link">Resources</span>
                                </Link>
                            </li>
                        </ul>
                        <div className="nav-item d-flex justify-content-end gap-3">
                            <Link to="/login" className="button button-primary">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="button button-primary"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default PublicHeader;
