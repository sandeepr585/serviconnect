import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles = [] }) {

    const location = useLocation();

    const token =
        localStorage.getItem("token");

    const storedRole =
        localStorage.getItem("role");

    const role = String(
        storedRole || ""
    )
        .replace("ROLE_", "")
        .toUpperCase();

    console.log("PROTECTED ROUTE");
    console.log("Current URL:", location.pathname);
    console.log("Token exists:", Boolean(token));
    console.log("Stored role:", storedRole);
    console.log("Normalized role:", role);
    console.log("Allowed roles:", allowedRoles);


    /*
     * User is not logged in
     */
    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname
                }}
            />
        );
    }


    /*
     * Check whether current role
     * is allowed for this route.
     */
    const normalizedAllowedRoles =
        allowedRoles.map((item) =>
            String(item)
                .replace("ROLE_", "")
                .toUpperCase()
        );


    if (
        normalizedAllowedRoles.includes(role)
    ) {
        return <Outlet />;
    }


    /*
     * User has a valid login but
     * doesn't have permission.
     *
     * Send them to their own dashboard.
     */

    if (role === "ADMIN") {

        return (
            <Navigate
                to="/admin-dashboard"
                replace
            />
        );
    }


    if (role === "PROVIDER") {

        return (
            <Navigate
                to="/provider-dashboard"
                replace
            />
        );
    }


    if (
        role === "CUSTOMER" ||
        role === "USER"
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    /*
     * Unknown role
     */
    return (
        <Navigate
            to="/login"
            replace
        />
    );
}

export default ProtectedRoute;
