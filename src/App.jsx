import { useEffect, useState } from "react";
import { getServices } from "./api";

function App() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getServices()
            .then((data) => {
                console.log("Services from backend:", data);
                setServices(data);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h1>ServiConnect</h1>

            <h2>Backend Connection Test</h2>

            {loading && <p>Loading services...</p>}

            {error && (
                <p style={{ color: "red" }}>
                    Error: {error}
                </p>
            )}

            {!loading && !error && (
                <div>
                    <h3>Services</h3>

                    {services.length === 0 ? (
                        <p>No services found.</p>
                    ) : (
                        services.map((service) => (
                            <div key={service.id}>
                                <h4>{service.name}</h4>
                                <p>{service.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default App;