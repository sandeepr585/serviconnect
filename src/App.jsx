import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Services from "./pages/Services";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Location from "./pages/Location";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Cart from "./pages/Cart";
import MyBookings from "./pages/MyBookings";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Review from "./pages/Review";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================
                    PUBLIC PAGES
                ========================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/services"
                    element={<Services />}
                />

                <Route
                    path="/search"
                    element={<SearchResults />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/location"
                    element={<Location />}
                />

                <Route
                    path="/how-it-works"
                    element={<HowItWorks />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />


                {/* =========================
                    CUSTOMER PAGES
                    CUSTOMER + ADMIN
                ========================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "CUSTOMER",
                                "ADMIN"
                            ]}
                        />
                    }
                >
                    <Route
                        path="/booking"
                        element={<Booking />}
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/my-bookings"
                        element={<MyBookings />}
                    />

                    <Route
                        path="/review/:bookingId"
                        element={<Review />}
                    />
                </Route>


                {/* =========================
                    PROVIDER DASHBOARD
                    PROVIDER + ADMIN
                ========================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "PROVIDER",
                                "ADMIN"
                            ]}
                        />
                    }
                >
                    <Route
                        path="/provider-dashboard"
                        element={<ProviderDashboard />}
                    />
                </Route>


                {/* =========================
                    ADMIN DASHBOARD
                    ADMIN ONLY
                ========================== */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ADMIN"
                            ]}
                        />
                    }
                >
                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />
                </Route>


                {/* =========================
                    FALLBACK
                ========================== */}

                <Route
                    path="*"
                    element={<Home />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;