import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function Navbar() {

    const { cartCount } = useCart();
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    const navClass = ({ isActive }) =>
        isActive ? "nav-active" : "";

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <NavLink to="/">
                    ServiConnect
                </NavLink>
            </div>

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
                    Cart ({cartCount})
                </NavLink>

                {isLoggedIn ? (
                    <>
                        <NavLink
                            to="/my-bookings"
                            className={navClass}
                        >
                            My Bookings
                        </NavLink>

                        <span className="navbar-user">
                            Hi, {user?.name}
                        </span>

                        <button
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
                            className={navClass}
                        >
                            Register
                        </NavLink>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;