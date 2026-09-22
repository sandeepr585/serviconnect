import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../api";

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getServices()
            .then((data) => {
                setServices(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load services:", err);
                setError("Unable to load services. Please try again.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="services-page">
                <div className="services-header">
                    <h1>Our Services</h1>
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
                    <h1>Our Services</h1>
                    <p>
                        Find trusted professionals for your home
                        and personal needs.
                    </p>
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