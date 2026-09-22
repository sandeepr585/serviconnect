import { useState } from "react";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }
    });


    function login(loginData) {

        console.log("LOGIN RESPONSE:", loginData);

        const newToken =
            loginData?.token ||
            loginData?.accessToken;

        const newUser =
            loginData?.user ||
            loginData;

        let newRole =
            loginData?.role ||
            loginData?.user?.role ||
            newUser?.role;

        if (newRole) {
            newRole = String(newRole)
                .replace("ROLE_", "")
                .toUpperCase();
        }

        if (!newRole) {
            newRole = "CUSTOMER";
        }

        console.log("LOGIN TOKEN:", newToken);
        console.log("LOGIN USER:", newUser);
        console.log("LOGIN ROLE:", newRole);

        if (newToken) {
            localStorage.setItem(
                "token",
                newToken
            );

            setToken(newToken);
        }

        localStorage.setItem(
            "role",
            newRole
        );

        localStorage.setItem(
            "user",
            JSON.stringify(newUser)
        );

        setRole(newRole);
        setUser(newUser);
    }


    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        setToken(null);
        setRole(null);
        setUser(null);
    }


    const value = {
        token,
        role,
        user,
        isLoggedIn: Boolean(token),
        login,
        logout,
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
