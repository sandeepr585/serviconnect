const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

console.log("API BASE URL:", API_BASE_URL);

// ================================
// GET SERVICES
// ================================
export async function getServices() {
    const response = await fetch(
        `${API_BASE_URL}/api/services`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch services: ${response.status}`
        );
    }

    return await response.json();
}

// ================================
// REGISTER USER
// ================================
export async function registerUser(userData) {
    const response = await fetch(
        `${API_BASE_URL}/api/users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(userData)
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        // Response may not contain JSON
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed"
        );
    }

    return data;
}

// ================================
// LOGIN USER
// ================================
export async function loginUser(credentials) {
    const response = await fetch(
        `${API_BASE_URL}/api/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(credentials)
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        // Response may not contain JSON
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed"
        );
    }

    return data;
}