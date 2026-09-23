import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../api";

const SERVICE_IMAGES = {
    "Plumbing Service":
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=85",

    "Electrical Service":
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=85",

    "Home Cleaning":
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85",

    "AC Repair":
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=85",

    "Painting Service":
        "https://images.unsplash.com/photo-1562259949-e8e76848d782?auto=format&fit=crop&w=1200&q=85",

    "Carpentry Service":
        "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1200&q=85",

    "Beauty Service":
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",

    "Pest Control":
        "https://images.unsplash.com/photo-1628260412297-a3377e45006f?auto=format&fit=crop&w=1200&q=85",

    "Washing Machine Repair":
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=85",

    "Refrigerator Repair":
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=85",

    "Bathroom Cleaning":
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85",

    "AC Installation":
        "https://images.unsplash.com/photo-1581092919535-7146ff9f9f7f?auto=format&fit=crop&w=1200&q=85",
};

function getServiceImage(service) {
    return (
        SERVICE_IMAGES[service?.title] ||
        service?.image ||
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85"
    );
}

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        getServices()
            .then((data) => {
                if (!active) return;

                setServices(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load services:", err);

                if (!active) return;

                setError(
                    "Unable to load services. Please try again."
                );

                setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
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
                        image={getServiceImage(service)}
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