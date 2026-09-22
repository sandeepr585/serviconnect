const API_BASE_URL = "https://serviconnect-backend-f1um.onrender.com";

export async function getServices() {
    const response = await fetch(`${API_BASE_URL}/api/services`);

    if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
    }

    return await response.json();
}

export async function registerUser(userData) {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : data?.message || "Registration failed"
        );
    }

    return data;
}

export async function loginUser(credentials) {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : data?.message || "Login failed"
        );
    }

    return data;
}