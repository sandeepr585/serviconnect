import { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.password) {
            setError("Please enter a password.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
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

            if (!response.ok) {
                const message =
                    typeof data === "string"
                        ? data
                        : data?.message || "Registration failed.";

                throw new Error(message);
            }

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            console.error("REGISTER ERROR:", err);

            setError(
                err.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-page">

            {/* Decorative background */}
            <div className="register-gradient-orb orb-one"></div>
            <div className="register-gradient-orb orb-two"></div>
            <div className="register-gradient-orb orb-three"></div>

            <div className="register-wrapper">

                {/* =========================
                    LEFT SIDE
                ========================= */}

                <div className="register-intro">

                    <Link to="/" className="register-brand">
                        <div className="register-brand-icon">
                            🏠
                        </div>

                        <div>
                            <strong>ServiConnect</strong>
                            <span>Home Services</span>
                        </div>
                    </Link>

                    <div className="register-intro-content">
                        <span className="register-badge">
                            ✨ Everything you need, at home
                        </span>

                        <h1>
                            Your home.
                            <br />
                            <span>Our care.</span>
                        </h1>

                        <p>
                            Join ServiConnect and get trusted professionals
                            for cleaning, repairs, beauty services and more —
                            all from one place.
                        </p>

                        <div className="register-benefits">

                            <div className="register-benefit">
                                <div className="benefit-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>Verified professionals</strong>
                                    <span>
                                        Reliable experts for your home
                                    </span>
                                </div>
                            </div>

                            <div className="register-benefit">
                                <div className="benefit-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>Easy booking</strong>
                                    <span>
                                        Book services in just a few clicks
                                    </span>
                                </div>
                            </div>

                            <div className="register-benefit">
                                <div className="benefit-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>Convenient service</strong>
                                    <span>
                                        Get help when and where you need it
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="register-trust">
                        <div className="trust-avatars">
                            <span>👩</span>
                            <span>👨</span>
                            <span>👩‍🔧</span>
                            <span>👨‍🔧</span>
                        </div>

                        <div>
                            <div className="trust-stars">
                                ★★★★★
                            </div>

                            <p>
                                Trusted by customers for their home needs
                            </p>
                        </div>
                    </div>

                </div>

                {/* =========================
                    RIGHT SIDE
                ========================= */}

                <div className="register-form-section">

                    <div className="register-card">

                        <div className="register-mobile-brand">
                            <div className="register-brand-icon">
                                🏠
                            </div>

                            <div>
                                <strong>ServiConnect</strong>
                                <span>Home Services</span>
                            </div>
                        </div>

                        <div className="register-header">
                            <span className="register-small-label">
                                GET STARTED
                            </span>

                            <h2>
                                Create your account
                            </h2>

                            <p>
                                Start booking trusted home services today.
                            </p>
                        </div>

                        {error && (
                            <div className="register-message register-error">
                                <span className="message-icon">!</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="register-message register-success">
                                <span className="message-icon">✓</span>
                                <span>{success}</span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="register-form"
                        >

                            {/* Name */}

                            <div className="register-form-group">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <div className="register-input-wrapper">

                                    <span className="register-input-icon">
                                        👤
                                    </span>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* Email */}

                            <div className="register-form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="register-input-wrapper">

                                    <span className="register-input-icon">
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

                            <div className="register-form-row">

                                <div className="register-form-group">

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            🔒
                                        </span>

                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Minimum 6 characters"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            disabled={loading}
                                        />

                                    </div>

                                </div>

                                <div className="register-form-group">

                                    <label htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            🔐
                                        </span>

                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Repeat password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            disabled={loading}
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="register-password-hint">
                                <span>🔒</span>
                                <span>
                                    Use at least 6 characters for a secure
                                    password.
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="register-submit-button"
                                disabled={loading}
                            >
                                <span>
                                    {loading
                                        ? "Creating account..."
                                        : "Create Account"}
                                </span>

                                {!loading && (
                                    <span className="register-arrow">
                                        →
                                    </span>
                                )}
                            </button>

                        </form>

                        <div className="register-divider">
                            <span>Already have an account?</span>
                        </div>

                        <Link
                            to="/login"
                            className="register-login-button"
                        >
                            Sign in to your account
                        </Link>

                        <p className="register-terms">
                            By creating an account, you agree to our
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

export default Register;