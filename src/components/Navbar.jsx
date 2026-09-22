import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function Navbar() {
    const { cartCount } = useCart();
    const { user, isLoggedIn, logout } = useAuth();

    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const role = String(user?.role || "").toUpperCase();

    function closeMobile() {
        setMobileOpen(false);
    }

    function handleLogout() {
        logout();
        closeMobile();
        navigate("/");
    }

    function navClass({ isActive }) {
        return isActive ? "nav-active" : "";
    }

    return (
        <nav className="navbar">

            {/* BRAND */}

            <div className="navbar-brand">
                <NavLink
                    to="/"
                    onClick={closeMobile}
                >
                    ServiConnect
                </NavLink>
            </div>


            {/* DESKTOP NAVIGATION */}

            <div className="nav-links">

                <NavLink
                    to="/"
                    className={navClass}
                >
                    Home
                </NavLink>

                <NavLink
                    to="/services"
                    className={navClass}
                >
                    Services
                </NavLink>

                <NavLink
                    to="/how-it-works"
                    className={navClass}
                >
                    How It Works
                </NavLink>

                <NavLink
                    to="/about"
                    className={navClass}
                >
                    About
                </NavLink>

                <NavLink
                    to="/cart"
                    className={navClass}
                >
                    Cart ({cartCount || 0})
                </NavLink>


                {isLoggedIn ? (
                    <>

                        {/* CUSTOMER */}

                        <NavLink
                            to="/my-bookings"
                            className={navClass}
                        >
                            My Bookings
                        </NavLink>


                        {/* PROVIDER */}

                        {role === "PROVIDER" && (
                            <NavLink
                                to="/provider-dashboard"
                                className={`dashboard-nav-link ${navClass({
                                    isActive:
                                        window.location.pathname ===
                                        "/provider-dashboard"
                                })}`}
                            >
                                Provider Dashboard
                            </NavLink>
                        )}


                        {/* ADMIN */}

                        {role === "ADMIN" && (
                            <NavLink
                                to="/admin-dashboard"
                                className={`dashboard-nav-link ${navClass({
                                    isActive:
                                        window.location.pathname ===
                                        "/admin-dashboard"
                                })}`}
                            >
                                Admin Dashboard
                            </NavLink>
                        )}


                        {/* USER */}

                        <span className="navbar-user">
                            Hi, {user?.name || "User"}
                        </span>


                        {/* LOGOUT */}

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </>
                ) : (
                    <>

                        <NavLink
                            to="/login"
                            className={navClass}
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/register"
                            className="nav-register"
                        >
                            Register
                        </NavLink>

                    </>
                )}

            </div>


            {/* MOBILE BUTTON */}

            <button
                type="button"
                className={`mobile-menu-button ${
                    mobileOpen ? "open" : ""
                }`}
                onClick={() =>
                    setMobileOpen((value) => !value)
                }
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>


            {/* MOBILE NAVIGATION */}

            {mobileOpen && (
                <div className="mobile-nav">

                    <NavLink
                        to="/"
                        className={navClass}
                        onClick={closeMobile}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/services"
                        className={navClass}
                        onClick={closeMobile}
                    >
                        Services
                    </NavLink>

                    <NavLink
                        to="/how-it-works"
                        className={navClass}
                        onClick={closeMobile}
                    >
                        How It Works
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={navClass}
                        onClick={closeMobile}
                    >
                        About
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={navClass}
                        onClick={closeMobile}
                    >
                        Cart ({cartCount || 0})
                    </NavLink>


                    {isLoggedIn ? (
                        <>

                            <NavLink
                                to="/my-bookings"
                                className={navClass}
                                onClick={closeMobile}
                            >
                                My Bookings
                            </NavLink>


                            {role === "PROVIDER" && (
                                <NavLink
                                    to="/provider-dashboard"
                                    className="mobile-dashboard-link"
                                    onClick={closeMobile}
                                >
                                    Provider Dashboard
                                </NavLink>
                            )}


                            {role === "ADMIN" && (
                                <NavLink
                                    to="/admin-dashboard"
                                    className="mobile-dashboard-link"
                                    onClick={closeMobile}
                                >
                                    Admin Dashboard
                                </NavLink>
                            )}


                            <div className="mobile-user">
                                Hi, {user?.name || "User"}
                            </div>


                            <button
                                type="button"
                                className="mobile-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </>
                    ) : (
                        <>

                            <NavLink
                                to="/login"
                                className={navClass}
                                onClick={closeMobile}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className="mobile-register"
                                onClick={closeMobile}
                            >
                                Register
                            </NavLink>

                        </>
                    )}

                </div>
            )}

        </nav>
    );
}

export default Navbar;