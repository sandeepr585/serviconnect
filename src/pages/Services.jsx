import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";

function Services() {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Local backend by default.
    // During deployment, Vercel will use VITE_API_URL.
    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:8080";

    useEffect(() => {

        fetch(`${API_URL}/api/services`)

            .then((response) => {

                if (!response.ok) {
                    throw new Error("Unable to load services");
                }

                return response.json();
            })

            .then((data) => {

                setServices(data);
                setLoading(false);
            })

            .catch((error) => {

                console.error(error);

                setError(
                    "Unable to load services. Please try again."
                );

                setLoading(false);
            });

    }, [API_URL]);

    if (loading) {

        return (
            <div className="services-page">

                <div className="services-header">

                    <h1>
                        Our Services
                    </h1>

                    <p>
                        Find trusted professionals for your home
                        and personal needs.
                    </p>

                </div>

                <div className="services-loading">
                    Loading services...
                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="services-page">

                <div className="services-header">

                    <h1>
                        Our Services
                    </h1>

                </div>

                <div className="services-error">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="services-page">

            <div className="services-header">

                <span className="services-label">
                    ServiConnect Services
                </span>

                <h1>
                    Services for your everyday needs
                </h1>

                <p>
                    Book trusted professionals for home repair,
                    cleaning, beauty and wellness services.
                </p>

            </div>

            <div className="services-grid">

                {services.map((service) => (

                    <ServiceCard
                        key={service.id}
                        id={service.id}
                        image={service.image}
                        title={service.title}
                        description={service.description}
                        price={service.price}
                        rating={service.rating}
                    />

                ))}

            </div>

        </div>
    );
}

export default Services;