import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import AuthProvider from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";

import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <AuthProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    </React.StrictMode>
);
