import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../api";

/*
=========================================================
SERVICE IMAGES
=========================================================
*/

const SERVICE_IMAGES = {
    "plumbing service":
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=85",

    "electrical service":
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=85",

    "home cleaning":
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85",

    "ac repair":
        "https://images.pexels.com/photos/5463580/pexels-photo-5463580.jpeg?auto=compress&dpr=1&h=750&w=1260",

    "painting service":
        "https://images.pexels.com/photos/1917849/pexels-photo-1917849.jpeg?auto=compress&dpr=1&h=750&w=1260",

    "carpentry service":
        "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1200&q=85",

    "beauty service":
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",

    "pest control":
        "https://images.unsplash.com/photo-1628260412297-a3377e45006f?auto=format&fit=crop&w=1200&q=85",

    "washing machine repair":
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=85",

    "refrigerator repair":
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=85",

    "bathroom cleaning":
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85",

    "ac installation":
        "https://images.pexels.com/photos/16592625/pexels-photo-16592625/free-photo-of-air-conditioner-in-a-house.jpeg?auto=compress&dpr=1&h=750&w=1260",
};


/*
=========================================================
FALLBACK IMAGES
Each service gets its own fallback.
=========================================================
*/

const FALLBACK_IMAGES = {
    "plumbing service":
        "https://loremflickr.com/900/600/plumber,pipe?lock=101",

    "electrical service":
        "https://loremflickr.com/900/600/electrician,wiring?lock=102",

    "home cleaning":
        "https://loremflickr.com/900/600/house,cleaning?lock=103",

    "ac repair":
        "https://loremflickr.com/900/600/airconditioner,repair?lock=104",

    "painting service":
        "https://loremflickr.com/900/600/house,painter?lock=105",

    "carpentry service":
        "https://loremflickr.com/900/600/carpenter,woodwork?lock=106",

    "beauty service":
        "https://loremflickr.com/900/600/beauty,salon?lock=107",

    "pest control":
        "https://loremflickr.com/900/600/pest,control?lock=108",

    "washing machine repair":
        "https://loremflickr.com/900/600/washing,machine,repair?lock=109",

    "refrigerator repair":
        "https://loremflickr.com/900/600/refrigerator,repair?lock=110",

    "bathroom cleaning":
        "https://loremflickr.com/900/600/bathroom,cleaning?lock=111",

    "ac installation":
        "https://loremflickr.com/900/600/airconditioner,installation?lock=112",
};


/*
=========================================================
NORMALIZE TITLE
=========================================================
*/

function normalizeTitle(title) {
    return String(title || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


/*
=========================================================
GET PRIMARY IMAGE
=========================================================
*/

function getServiceImage(service) {
    const title = normalizeTitle(service?.title);

    /*
    Exact match
    */
    if (SERVICE_IMAGES[title]) {
        return SERVICE_IMAGES[title];
    }

    /*
    Extra protection for slightly different database titles
    */

    if (title.includes("plumbing")) {
        return SERVICE_IMAGES["plumbing service"];
    }

    if (title.includes("electrical")) {
        return SERVICE_IMAGES["electrical service"];
    }

    if (title.includes("home cleaning")) {
        return SERVICE_IMAGES["home cleaning"];
    }

    if (title === "ac repair" || title.includes("ac repair")) {
        return SERVICE_IMAGES["ac repair"];
    }

    if (title.includes("painting")) {
        return SERVICE_IMAGES["painting service"];
    }

    if (title.includes("carpentry")) {
        return SERVICE_IMAGES["carpentry service"];
    }

    if (title.includes("beauty")) {
        return SERVICE_IMAGES["beauty service"];
    }

    if (title.includes("pest")) {
        return SERVICE_IMAGES["pest control"];
    }

    if (title.includes("washing machine")) {
        return SERVICE_IMAGES["washing machine repair"];
    }

    if (title.includes("refrigerator")) {
        return SERVICE_IMAGES["refrigerator repair"];
    }

    if (title.includes("bathroom")) {
        return SERVICE_IMAGES["bathroom cleaning"];
    }

    if (title.includes("ac installation")) {
        return SERVICE_IMAGES["ac installation"];
    }

    /*
    Final fallback
    */

    return "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85";
}


/*
=========================================================
GET FALLBACK IMAGE
=========================================================
*/

function getFallbackImage(service) {
    const title = normalizeTitle(service?.title);

    if (FALLBACK_IMAGES[title]) {
        return FALLBACK_IMAGES[title];
    }

    if (title.includes("plumbing")) {
        return FALLBACK_IMAGES["plumbing service"];
    }

    if (title.includes("electrical")) {
        return FALLBACK_IMAGES["electrical service"];
    }

    if (title.includes("cleaning") && title.includes("home")) {
        return FALLBACK_IMAGES["home cleaning"];
    }

    if (title.includes("ac repair")) {
        return FALLBACK_IMAGES["ac repair"];
    }

    if (title.includes("painting")) {
        return FALLBACK_IMAGES["painting service"];
    }

    if (title.includes("carpentry")) {
        return FALLBACK_IMAGES["carpentry service"];
    }

    if (title.includes("beauty")) {
        return FALLBACK_IMAGES["beauty service"];
    }

    if (title.includes("pest")) {
        return FALLBACK_IMAGES["pest control"];
    }

    if (title.includes("washing machine")) {
        return FALLBACK_IMAGES["washing machine repair"];
    }

    if (title.includes("refrigerator")) {
        return FALLBACK_IMAGES["refrigerator repair"];
    }

    if (title.includes("bathroom")) {
        return FALLBACK_IMAGES["bathroom cleaning"];
    }

    if (title.includes("ac installation")) {
        return FALLBACK_IMAGES["ac installation"];
    }

    return "https://loremflickr.com/900/600/home,service?lock=199";
}


/*
=========================================================
SERVICES PAGE
=========================================================
*/

function Services() {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /*
    LOAD SERVICES
    */

    useEffect(() => {

        let active = true;

        getServices()
            .then((data) => {

                if (!active) {
                    return;
                }

                setServices(
                    Array.isArray(data)
                        ? data
                        : []
                );

                setLoading(false);

            })
            .catch((err) => {

                console.error(
                    "Failed to load services:",
                    err
                );

                if (!active) {
                    return;
                }

                setError(
                    "Unable to load services. Please try again."
                );

                setLoading(false);

            });

        return () => {
            active = false;
        };

    }, []);


    /*
    LOADING STATE
    */

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


    /*
    ERROR STATE
    */

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


    /*
    MAIN PAGE
    */

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

                        fallbackImage={getFallbackImage(service)}

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