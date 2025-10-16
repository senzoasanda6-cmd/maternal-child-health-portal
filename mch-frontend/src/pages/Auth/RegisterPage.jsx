import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinners/Spinner";
import { BsArrowLeft } from "react-icons/bs";
import "./LoginPage.css";

function RegisterForm() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        hospital_id: "",
        comments: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRoleSelect = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        setForm((prev) => ({
            ...prev,
            role,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBackToRole = () => {
        setSelectedRole("");
        setForm((prev) => ({
            ...prev,
            role: "",
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (form.role !== "mother" && !form.hospital_id) {
            setError("Facility is required for this role.");
            setLoading(false);
            return;
        }

        const endpoint =
            form.role === "mother"
                ? "/api/register"
                : "/api/registration-request";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                if (form.role === "mother") {
                    navigate("/dashboard");
                } else {
                    alert(
                        "Your registration request has been submitted for review."
                    );
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Submission failed.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {loading && <Spinner />}
            <div className="container login-wrapper">
                <div className="login-left">
                    <div className="image-container">
                        <img
                            src="/mother_child_ai_2.png"
                            alt="Mother and Child"
                            className="side-image"
                        />
                        <div className="image-overlay">
                            <img
                                src="/gdoh.jpeg"
                                alt="GDOH Logo"
                                className="login-logo"
                            />
                            <h1>Maternal & Child Health Portal</h1>
                            <p>
                                Supporting healthy mothers and children through
                                technology
                            </p>
                        </div>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-card">
                        {!selectedRole ? (
                            <>
                                <h2>Select Your Role</h2>
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        id="floatingRoleSelect"
                                        value={selectedRole}
                                        onChange={handleRoleSelect}
                                        required
                                    >
                                        <option value="">
                                            Choose a role to continue
                                        </option>
                                        <option value="mother">Mother</option>
                                        <option value="child">Child</option>
                                        <option value="health_worker">
                                            Health Worker
                                        </option>
                                        <option value="manager">Manager</option>
                                        <option value="clinical_manager">
                                            Clinical Manager
                                        </option>
                                    </select>
                                    <label htmlFor="floatingRoleSelect">
                                        Role
                                    </label>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <button
                                        className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                                        onClick={handleBackToRole}
                                        type="button"
                                    >
                                        <BsArrowLeft className="me-2" />
                                        <span>Back</span>
                                    </button>
                                    <span className="badge rounded-pill bg-primary">
                                        Role:{" "}
                                        {selectedRole
                                            .replace("_", " ")
                                            .toUpperCase()}
                                    </span>
                                </div>

                                <h2>Create an Account</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingName"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Name"
                                            required
                                        />
                                        <label htmlFor="floatingName">
                                            Name
                                        </label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="floatingEmail"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            required
                                        />
                                        <label htmlFor="floatingEmail">
                                            Email
                                        </label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="floatingPassword"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                        />
                                        <label htmlFor="floatingPassword">
                                            Password
                                        </label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="floatingConfirmPassword"
                                            name="password_confirmation"
                                            value={form.password_confirmation}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            required
                                        />
                                        <label htmlFor="floatingConfirmPassword">
                                            Confirm Password
                                        </label>
                                    </div>

                                    {form.role !== "mother" && (
                                        <div className="form-floating mb-3">
                                            <select
                                                className="form-select"
                                                id="floatingHospital"
                                                name="hospital_id"
                                                value={form.hospital_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">
                                                    Select Hospital
                                                </option>
                                                <option value="1">
                                                    Alexandra Health Clinic
                                                </option>
                                                <option value="2">
                                                    Alexandra Municipal Clinic
                                                </option>
                                                <option value="3">
                                                    Eastbank Municipal Clinic
                                                </option>
                                                <option value="4">
                                                    Fourth Avenue Municipal
                                                    Clinic{" "}
                                                </option>
                                                <option value="5">
                                                    Bedfordview Municipal Clinic{" "}
                                                </option>
                                                <option value="6">
                                                    Bergbron Medicross Centre
                                                </option>
                                                <option value="7">
                                                    Bez Valley Municipal Clinic
                                                </option>
                                                <option value="8">
                                                    Birchleigh Municipal Clinic
                                                </option>
                                                <option value="9">
                                                    Birchleigh North Municipal
                                                    Clinic
                                                </option>
                                                <option value="10">
                                                    Sonto Tobela Municipal
                                                    Clinic
                                                </option>
                                                <option value="11">
                                                    Zamani Municipal Clinic{" "}
                                                </option>
                                                <option value="12">
                                                    Teddy Bear Clinic{" "}
                                                </option>
                                                <option value="13">
                                                    Johannesburg Hospital
                                                </option>
                                                <option value="14">
                                                    Brackenhurst Municipal
                                                    Clinic
                                                </option>
                                                <option value="15">
                                                    Chiawelo Municipal Clinic
                                                </option>
                                                <option value="16">
                                                    Crosby Municipal Clinic
                                                </option>
                                                <option value="17">
                                                    Crown Gardens
                                                </option>
                                                <option value="18">
                                                    Charles Hurwitz SANTA Centre
                                                </option>
                                                <option value="19">
                                                    Chris Hani Baragwanath
                                                    Hospital
                                                </option>
                                                <option value="20">
                                                    Diepkloof Municipal Clinic
                                                </option>
                                                <option value="21">
                                                    Discovery Community Health
                                                    Centre
                                                </option>
                                                <option value="22">
                                                    Dobsonville Itereleng
                                                    Community Health Clinic
                                                </option>
                                                <option value="23">
                                                    Nokuphila Municipal Clinic
                                                </option>
                                                <option value="24">
                                                    Tshepo Themba Clinic
                                                </option>
                                                <option value="25">
                                                    Eden Park Municipal Clinic
                                                </option>
                                                <option value="26">
                                                    Eldorado Park Municipal
                                                    Clinic
                                                </option>
                                                <option value="27">
                                                    Kliptown Municipal Clinic
                                                </option>
                                                <option value="28">
                                                    Fleurhof Municipal Clinic
                                                </option>
                                                <option value="29">
                                                    Mayo Clinic
                                                </option>
                                                <option value="30">
                                                    West Rand Clinic
                                                </option>
                                                <option value="31">
                                                    Fordsburg Clinic
                                                </option>
                                                <option value="32">
                                                    Halfway House Municipal
                                                    Clinic
                                                </option>
                                                <option value="33">
                                                    Esselen Clinic
                                                </option>
                                                <option value="34">
                                                    Joubert Park Municipal
                                                    Clinic
                                                </option>
                                                <option value="35">
                                                    Helderkruin Municipal Clinic
                                                </option>
                                                <option value="36">
                                                    Johannesburg Hospice
                                                </option>
                                                <option value="37">
                                                    Bophelong Municipal Clinic
                                                </option>
                                                <option value="38">
                                                    Hikensile Municipal Clinic
                                                </option>
                                                <option value="39">
                                                    Mpumelelo Municipal Clinic
                                                </option>
                                                <option value="40">
                                                    Thuthukani Municipal Clinic{" "}
                                                </option>
                                                <option value="41">
                                                    Jeppe Municipal Clinic
                                                </option>
                                                <option value="42">
                                                    Klipspruit West Municipal
                                                    Clinic
                                                </option>
                                                <option value="43">
                                                    Kliptown Health Centre
                                                </option>
                                                <option value="44">
                                                    Klopperpark Municipal Clinic
                                                </option>
                                                <option value="45">
                                                    Lenasia Municipal Clinic
                                                </option>
                                                <option value="46">
                                                    Lenasia South Municipal
                                                    Clinic
                                                </option>
                                                <option value="47">
                                                    Lenmed Clinic
                                                </option>
                                                <option value="48">
                                                    Luipaardsvlei Municipal
                                                    Clinic
                                                </option>
                                                <option value="49">
                                                    Malvern Municipal Clinic
                                                </option>
                                                <option value="50">
                                                    Marlboro Municipal Clinic
                                                </option>
                                                <option value="51">
                                                    Mayfair Municipal Clinic
                                                </option>
                                                <option value="52">
                                                    Meadowlands Clinic
                                                </option>
                                                <option value="53">
                                                    Meldene Medicross Centre
                                                </option>
                                                <option value="54">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="55">
                                                    Mofolo South Municipal
                                                    Clinic
                                                </option>
                                                <option value="56">
                                                    Mohlakeng Municipal Clinic
                                                </option>
                                                <option value="57">
                                                    Coronation Hospital
                                                </option>
                                                <option value="58">
                                                    Noordheuwel Municipal Clinic
                                                </option>
                                                <option value="59">
                                                    Johannesburg Eye Hospital
                                                </option>
                                                <option value="60">
                                                    Parkhurst Municipal Clinic
                                                </option>
                                                <option value="61">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="62">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="63">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="64">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="65">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="66">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="67">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="68">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="69">
                                                    Mid-Ennerdale Municipal
                                                    Clinic
                                                </option>
                                                <option value="70">
                                                    Montclare Municipal Clinic
                                                </option>
                                                <option value="71">
                                                    Newtown Clinic
                                                </option>
                                                <option value="72">
                                                    Northcliff Medicross Centre
                                                </option>
                                                <option value="73">
                                                    Orlando East Clinic
                                                </option>
                                                <option value="74">
                                                    Orlando West Clinic
                                                </option>
                                                <option value="75">
                                                    Parktown Hospital
                                                </option>
                                                <option value="76">
                                                    Phomolong Clinic
                                                </option>
                                                <option value="77">
                                                    Poortjie Clinic
                                                </option>
                                                <option value="78">
                                                    Primrose Clinic
                                                </option>
                                                <option value="79">
                                                    Roodepoort Hospital
                                                </option>
                                                <option value="80">
                                                    Soweto Health Centre
                                                </option>
                                                <option value="81">
                                                    South Rand Hospital
                                                </option>
                                                <option value="82">
                                                    Tembisa Hospital
                                                </option>
                                                <option value="83">
                                                    Thelle Mogoerane Regional
                                                    Hospital
                                                </option>
                                                <option value="84">
                                                    Thokoza Clinic
                                                </option>
                                                <option value="85">
                                                    Turffontein Clinic
                                                </option>
                                                <option value="86">
                                                    Westbury Clinic
                                                </option>
                                                <option value="87">
                                                    Westgate Clinic
                                                </option>
                                                <option value="88">
                                                    Witkoppen Health and Welfare
                                                    Centre
                                                </option>
                                            </select>
                                            <label htmlFor="floatingHospital">
                                                Facility
                                            </label>
                                        </div>
                                    )}

                                    {form.role !== "mother" && (
                                        <div className="alert alert-info">
                                            Your registration will be reviewed
                                            by an administrator before approval.
                                        </div>
                                    )}

                                    {error && <p className="error">{error}</p>}
                                    <button type="submit">Register</button>
                                    <p className="mt-3 mb-0">
                                        Already have an account?{" "}
                                        <span
                                            className="link-primary"
                                            onClick={() => navigate("/login")}
                                        >
                                            Login
                                        </span>
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
