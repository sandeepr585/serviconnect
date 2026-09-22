const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

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

export async function registerUser(userData) {
    const response = await fetch(
        `${API_BASE_URL}/api/users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed"
        );
    }

    return data;
}

export async function loginUser(credentials) {
    const response = await fetch(
        `${API_BASE_URL}/api/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed"
        );
    }

    return data;
}