import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "https://serviconnect-backend-f1um.onrender.com/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: formData.email.trim(),
                        password: formData.password,
                    }),
                }
            );

            const responseText = await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch {
                data = responseText;
            }

            console.log("BACKEND LOGIN RESPONSE:", data);

            if (!response.ok) {
                const message =
                    typeof data === "string"
                        ? data
                        : data?.message || "Invalid email or password.";

                throw new Error(message);
            }

            const token =
                data?.token ||
                data?.accessToken;

            if (!token) {
                throw new Error(
                    "Login successful, but no token was received."
                );
            }

            const loggedInUser =
                data?.user ||
                data;

            let role =
                data?.role ||
                data?.user?.role ||
                loggedInUser?.role;

            if (role) {
                role = String(role)
                    .replace("ROLE_", "")
                    .toUpperCase();
            }

            if (!role) {
                role = "CUSTOMER";
            }

            console.log("FINAL LOGIN ROLE:", role);

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");

            login({
                token: token,
                role: role,
                user: loggedInUser,
            });

            if (role === "ADMIN") {
                navigate("/admin-dashboard", {
                    replace: true,
                });
                return;
            }

            if (role === "PROVIDER") {
                navigate("/provider-dashboard", {
                    replace: true,
                });
                return;
            }

            navigate("/", {
                replace: true,
            });
        } catch (err) {
            console.error("LOGIN ERROR:", err);

            setError(
                err.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">

            {/* Background decoration */}

            <div className="login-gradient-orb login-orb-one"></div>
            <div className="login-gradient-orb login-orb-two"></div>
            <div className="login-gradient-orb login-orb-three"></div>

            <div className="login-wrapper">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="login-intro">

                    <Link
                        to="/"
                        className="login-brand"
                    >
                        <div className="login-brand-icon">
                            🏠
                        </div>

                        <div>
                            <strong>
                                ServiConnect
                            </strong>

                            <span>
                                Home Services
                            </span>
                        </div>
                    </Link>

                    <div className="login-intro-content">

                        <span className="login-badge">
                            ✨ Welcome back
                        </span>

                        <h1>
                            Your home.
                            <br />
                            <span>Our care.</span>
                        </h1>

                        <p>
                            Access your ServiConnect account and
                            manage all your home services from one
                            convenient place.
                        </p>

                        <div className="login-benefits">

                            <div className="login-benefit">

                                <div className="login-benefit-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Trusted professionals
                                    </strong>

                                    <span>
                                        Quality service at your doorstep
                                    </span>
                                </div>

                            </div>

                            <div className="login-benefit">

                                <div className="login-benefit-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Easy service management
                                    </strong>

                                    <span>
                                        Track your bookings with ease
                                    </span>
                                </div>

                            </div>

                            <div className="login-benefit">

                                <div className="login-benefit-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Everything in one place
                                    </strong>

                                    <span>
                                        Book, manage and review services
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="login-trust">

                        <div className="login-trust-avatars">
                            <span>👩</span>
                            <span>👨</span>
                            <span>👩‍🔧</span>
                            <span>👨‍🔧</span>
                        </div>

                        <div>
                            <div className="login-trust-stars">
                                ★★★★★
                            </div>

                            <p>
                                Making home services simpler
                            </p>
                        </div>

                    </div>

                </div>

                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="login-form-section">

                    <div className="login-card">

                        {/* Mobile brand */}

                        <div className="login-mobile-brand">

                            <div className="login-brand-icon">
                                🏠
                            </div>

                            <div>
                                <strong>
                                    ServiConnect
                                </strong>

                                <span>
                                    Home Services
                                </span>
                            </div>

                        </div>

                        {/* Header */}

                        <div className="login-header">

                            <span className="login-small-label">
                                WELCOME BACK
                            </span>

                            <h2>
                                Sign in to your account
                            </h2>

                            <p>
                                Continue managing your home services.
                            </p>

                        </div>

                        {/* Error */}

                        {error && (
                            <div className="login-message login-error">

                                <span className="login-message-icon">
                                    !
                                </span>

                                <span>
                                    {error}
                                </span>

                            </div>
                        )}

                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="login-form"
                        >

                            {/* Email */}

                            <div className="login-form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="login-input-wrapper">

                                    <span className="login-input-icon">
                                        ✉
                                    </span>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* Password */}

                            <div className="login-form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <span className="login-input-icon">
                                        🔒
                                    </span>

                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* Security note */}

                            <div className="login-security-note">

                                <span>
                                    🔒
                                </span>

                                <span>
                                    Your account information is securely
                                    protected.
                                </span>

                            </div>

                            {/* Submit */}

                            <button
                                type="submit"
                                className="login-submit-button"
                                disabled={loading}
                            >

                                <span>
                                    {loading
                                        ? "Signing in..."
                                        : "Sign In"}
                                </span>

                                {!loading && (
                                    <span className="login-arrow">
                                        →
                                    </span>
                                )}

                            </button>

                        </form>

                        {/* Register */}

                        <div className="login-divider">
                            <span>
                                New to ServiConnect?
                            </span>
                        </div>

                        <Link
                            to="/register"
                            className="login-register-button"
                        >
                            Create a new account
                        </Link>

                        <p className="login-footer-text">
                            By continuing, you agree to our
                            <span> Terms of Service </span>
                            and
                            <span> Privacy Policy</span>.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
