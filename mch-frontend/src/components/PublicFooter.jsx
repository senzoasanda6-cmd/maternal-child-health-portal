import React from "react";

function PublicFooter() {
    return (
        <footer className="footer text-white py-4 mt-auto">
            <div className="container text-center">
                <p>
                    &copy; {new Date().getFullYear()} Maternal Child Health Portal. All rights
                    reserved.
                </p>
                <p style={{fontSize: "12px"}}>Developed by Senzo Dubazana <a href="https://github.com/senzoasanda6-cmd/maternal-child-health-portal">senzoasanda6-cmd</a> and Team.</p>
                <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
                    <a href="/privacy" className="text-white mx-3">
                        Privacy Policy
                    </a>
                    |
                    <a href="/terms" className="text-white mx-3">
                        Terms of Use
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default PublicFooter;
