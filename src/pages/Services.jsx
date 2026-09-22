import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../api";

const SERVICE_IMAGES = {
    "Plumbing Service":
        "https://loremflickr.com/800/500/plumber?lock=1",

    "Electrical Service":
        "https://loremflickr.com/800/500/electrician?lock=2",

    "Home Cleaning":
        "https://loremflickr.com/800/500/house,cleaning?lock=3",

    "AC Repair":
        "https://loremflickr.com/800/500/airconditioner,repair?lock=4",

    "Painting Service":
        "https://loremflickr.com/800/500/house,painter?lock=5",

    "Carpentry Service":
        "https://loremflickr.com/800/500/carpenter,woodwork?lock=6",

    "Beauty Service":
        "https://loremflickr.com/800/500/beauty,salon?lock=7",

    "Pest Control":
        "https://loremflickr.com/800/500/pestcontrol?lock=8",

    "Washing Machine Repair":
        "https://loremflickr.com/800/500/washingmachine,repair?lock=9",

    "Refrigerator Repair":
        "https://loremflickr.com/800/500/refrigerator,repair?lock=10",

    "Bathroom Cleaning":
        "https://loremflickr.com/800/500/bathroom,cleaning?lock=11",

    "AC Installation":
        "https://loremflickr.com/800/500/airconditioner,installation?lock=12",
};

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
                    <span className="services-label">
                        ServiConnect Services
                    </span>

                    <h1>Services for your everyday needs</h1>

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

                    <h1>Services for your everyday needs</h1>

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

                <h1>Services for your everyday needs</h1>

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
                        image={
                            SERVICE_IMAGES[service.title] ||
                            "https://loremflickr.com/800/500/home,service?lock=20"
                        }
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