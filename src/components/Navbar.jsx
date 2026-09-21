import { Link, useNavigate } from "react-router-dom";
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

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <Link to="/">
                    ServiConnect
                </Link>
            </div>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/services">
                    Services
                </Link>

                <Link to="/how-it-works">
                    How It Works
                </Link>

                <Link to="/about">
                    About
                </Link>

                <Link to="/cart">
                    Cart ({cartCount})
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/my-bookings">
                            My Bookings
                        </Link>

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
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;