import React from "react";
import { Link } from "react-router-dom";

import mch_logo_transp from "../assets/logos/mch_ai_v1_logo_transp.png";

const hamburgerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#fff" class="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>`;
const hamburgerSvgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
    hamburgerSvg
)}`;

function PublicHeader() {
    return (
        <header
            className="navbar header-public px-2"
            style={{ position: "sticky", top: "0", zIndex: "1000" }}
        >
            <div className="container-fluid">
                <div className="w-100">
                    <div className="row justify-content-between align-items-center">
                        {/* Logo Section */}
                        <div className="col-md-10 mt-2">
                            <Link to="/" className="text-decoration-none w-100">
                                <div
                                    className="row justify-content-center justify-content-lg-between align-items-center mb-2 mx-auto mx-md-0"
                                    style={{ maxWidth: "100%" }}
                                >
                                    <div className="col-md-3 p-0 text-center text-md-start mx-autoz" style={{maxWidth: "250px"}}>
                                        <img
                                            src="/gdoh-narrow-transp.png"
                                            alt="health"
                                            className="navbar-brandz img-fluid rounded-3"
                                        />
                                    </div>
                                    <div className="col-md -8 pe-2 overflow-hidden d-flex gap-1 justify-content-center justify-content-md-startz align-items-center">
                                        <img src={mch_logo_transp} alt="mch logo" className="navbar-brand rounded-3 m-0" style={{ maxWidth: "50px", height: "auto" }} />
                                        <p
                                            className="my-3 w-100z text-center text-md-start text-truncate"
                                            style={{
                                                fontSize: "16px",
                                                color: "#1d4189",
                                                fontWeight: "600",
                                                textDecoration: "none",
                                            }}
                                        >
                                            Maternal Child Health Portal
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        {/* Navbar Toggler */}
                        <div className="col-md-2 pe-0 d-flex justify-content-center justify-content-md-end align-items-center">
                            <button
                                className="navbar-togglerz button button-primary"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <img
                                    src={hamburgerSvgDataUri}
                                    alt=""
                                    style={{ height: "24px" }}
                                />
                                <span className="visually-hidden">
                                    Toggle navigation
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-top mt-4 p-3 pb-1 collapse navbar-collapse w-100" id="navbarNav">
                    <div className="d-flex gap-2 justify-content-between align-items-center w-100 overflow-x-auto" style={{width:"100vw"}}>
                        {/* Navbar Links */}
                        <div className="col-md">
                            <ul
                                className="w-100 list-group list-group-horizontal justify-content-start me-auto mb-2 mb-lg-0"
                                style={{ minHeight: "50px" }}
                            >
                                <li className="nav-item d-flex justify-content-start">
                                    <Link
                                        to="/"
                                        className="nav-link px-3 pt-3 active"
                                        aria-current="page"
                                    >
                                        <span className=" anim-link">Home</span>
                                    </Link>
                                </li>
                                <li className="nav-item d-flex justify-content-end">
                                    <Link
                                        to="/services"
                                        className="nav-link px-3 pt-3"
                                    >
                                        <span className=" anim-link">
                                            Services
                                        </span>
                                    </Link>
                                </li>
                                <li className="nav-item d-flex justify-content-end">
                                    <Link
                                        to="/resources/nutrition"
                                        className="nav-link px-3 pt-3"
                                    >
                                        <span className=" anim-link">
                                            Resources
                                        </span>
                                    </Link>
                                </li>
                                <li className="nav-item d-flex justify-content-end">
                                    <Link
                                        to="/terms"
                                        className="nav-link px-3 pt-3"
                                    >
                                        <span className=" anim-link">
                                            Terms
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        {/* Auth Links */}
                        <div className="col-md">
                            <div className="nav-item d-flex justify-content-end gap-2 m-0">
                                <Link
                                    to="/login"
                                    className="button button-primary"
                                >
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
            </div>
        </header>
    );
}

export default PublicHeader;
