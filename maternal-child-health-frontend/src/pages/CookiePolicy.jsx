import React from "react";
import Nav from "../components/nav";

const CookiePolicy = () => {
    return (
        <>
            <Nav />
            <div className="container py-4">
                <h2>Cookie Policy</h2>
                <p>Last updated: October 8, 2025</p>

                <p>
                    This website uses cookies to enhance your experience,
                    analyze site usage, and assist in our marketing efforts. By
                    continuing to browse, you agree to our use of cookies.
                </p>

                <h5>What Are Cookies?</h5>
                <p>
                    Cookies are small text files stored on your device when you
                    visit a website. They help us remember your preferences and
                    improve functionality.
                </p>

                <h5>Types of Cookies We Use</h5>
                <ul>
                    <li>
                        <strong>Essential Cookies:</strong> Required for basic
                        site functionality
                    </li>
                    <li>
                        <strong>Analytics Cookies:</strong> Help us understand
                        how users interact with the site
                    </li>
                    <li>
                        <strong>Marketing Cookies:</strong> Used to deliver
                        relevant ads and promotions
                    </li>
                </ul>

                <h5>Managing Cookies</h5>
                <p>
                    You can manage or disable cookies in your browser settings.
                    However, disabling cookies may affect your experience on our
                    site.
                </p>
            </div>
        </>
    );
};

export default CookiePolicy;
