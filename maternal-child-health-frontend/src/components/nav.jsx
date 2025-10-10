import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function nav() {
  return (
    <header className="header">
                <Link to="/" className="logo">
                    MCHP
                </Link>
                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/terms">Terms</Link>
                        </li>
                        <li>
                            <Link to="/services">Services</Link>
                        </li>
                        <li>
                            <Link to="/resources/nutrition">Resources</Link>
                        </li>
                        <li>
                            <Link to="/login" className="button button-primary">
                                Login
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
  )
}

export default nav