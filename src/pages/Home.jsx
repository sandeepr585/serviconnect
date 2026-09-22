import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../api";

import "./Home.css";

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
        "https://images.unsplash.com/photo-1581092919535-7146ff9f9f7f?auto=format&fit=crop&w=1200&q=85"
};

const CATEGORY_META = [
    {
        icon: "💇",
        title: "Beauty",
        label: "Beauty & Wellness",
        color: "lavender"
    },
    {
        icon: "🔧",
        title: "Repair",
        label: "Home Repair",
        color: "blue"
    },
    {
        icon: "🧹",
        title: "Cleaning",
        label: "Cleaning",
        color: "green"
    },
    {
        icon: "❄️",
        title: "AC Repair",
        label: "AC Services",
        color: "cyan"
    },
    {
        icon: "🐜",
        title: "Pest Control",
        label: "Pest Control",
        color: "orange"
    },
    {
        icon: "⚡",
        title: "Electrical",
        label: "Electrical",
        color: "yellow"
    }
];

const QUICK_SEARCHES = [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "AC Repair"
];

function getServiceImage(service) {
    return (
        SERVICE_IMAGES[service?.title] ||
        service?.image ||
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85"
    );
}

function Home() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [servicesError, setServicesError] = useState("");

    const [aiOpen, setAiOpen] = useState(false);
    const [aiMessage, setAiMessage] = useState("");

    useEffect(() => {
        let active = true;

        getServices()
            .then((data) => {
                if (!active) return;

                setServices(Array.isArray(data) ? data : []);
                setLoadingServices(false);
            })
            .catch((error) => {
                console.error("Home services error:", error);

                if (!active) return;

                setServicesError(
                    "We couldn't load live services right now."
                );

                setLoadingServices(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const averageRating = useMemo(() => {
        if (!services.length) return "—";

        const total = services.reduce(
            (sum, service) =>
                sum + Number(service.rating || 0),
            0
        );

        return (total / services.length).toFixed(1);
    }, [services]);

    const featuredServices = useMemo(() => {
        return [...services]
            .sort(
                (a, b) =>
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
            )
            .slice(0, 4);
    }, [services]);

    const categoryCounts = useMemo(() => {
        return services.reduce((acc, service) => {
            const category =
                service.category || "Other";

            acc[category] =
                (acc[category] || 0) + 1;

            return acc;
        }, {});
    }, [services]);

    function goToServices() {
        navigate("/services");
    }

    function handleSearch() {
        const value = search.trim();

        if (!value) {
            goToServices();
            return;
        }

        sessionStorage.setItem(
            "serviconnect_search",
            value
        );

        navigate("/services");
    }

    function handleQuickSearch(value) {
        setSearch(value);

        sessionStorage.setItem(
            "serviconnect_search",
            value
        );

        navigate("/services");
    }

    function handleCategory(label) {
        sessionStorage.setItem(
            "serviconnect_search",
            label
        );

        navigate("/services");
    }

    function scrollToSection(id) {
        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth"
            });
    }

    function askAI(value) {
        const message =
            value.trim() ||
            aiMessage.trim();

        if (!message) return;

        const lower = message.toLowerCase();

        let suggestion = "services";

        if (
            lower.includes("ac") ||
            lower.includes("cool")
        ) {
            suggestion = "AC Repair";
        } else if (
            lower.includes("electric") ||
            lower.includes("power") ||
            lower.includes("light")
        ) {
            suggestion = "Electrical";
        } else if (
            lower.includes("clean") ||
            lower.includes("dirty")
        ) {
            suggestion = "Cleaning";
        } else if (
            lower.includes("pipe") ||
            lower.includes("water") ||
            lower.includes("tap")
        ) {
            suggestion = "Plumbing";
        }

        setAiOpen(true);

        sessionStorage.setItem(
            "serviconnect_search",
            suggestion
        );

        setAiMessage("");

        setTimeout(() => {
            navigate("/services");
        }, 350);
    }

    return (
        <div className="home-page">

            <Navbar />

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="home-hero">

                <div className="hero-grid-overlay"></div>
                <div className="hero-orb hero-orb-one"></div>
                <div className="hero-orb hero-orb-two"></div>

                <div className="hero-copy">

                    <div className="hero-live-badge">
                        <span></span>
                        Live service marketplace
                    </div>

                    <h1>
                        Get things done.
                        <span>
                            Without the hassle.
                        </span>
                    </h1>

                    <p className="hero-description">
                        Find trusted professionals for
                        repairs, cleaning, beauty, maintenance
                        and everyday services.
                    </p>

                    <div className="hero-search">

                        <span className="hero-search-icon">
                            ⌕
                        </span>

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter"
                                ) {
                                    handleSearch();
                                }
                            }}
                            placeholder="What service do you need?"
                        />

                        {search && (
                            <button
                                className="search-clear"
                                onClick={() =>
                                    setSearch("")
                                }
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}

                        <button
                            className="hero-search-button"
                            onClick={handleSearch}
                        >
                            Search
                            <span>→</span>
                        </button>

                    </div>

                    <div className="quick-search-row">

                        <span>Popular</span>

                        {QUICK_SEARCHES.map(
                            (item) => (
                                <button
                                    key={item}
                                    onClick={() =>
                                        handleQuickSearch(
                                            item
                                        )
                                    }
                                >
                                    {item}
                                </button>
                            )
                        )}

                    </div>

                    <div className="hero-trust-row">

                        <div className="trust-avatars">
                            <span>👩</span>
                            <span>👨</span>
                            <span>👨‍🔧</span>
                            <span>👩‍🔧</span>
                        </div>

                        <div>
                            <strong>
                                Built for everyday tasks
                            </strong>

                            <small>
                                Compare services, ratings
                                and prices in one place.
                            </small>
                        </div>

                    </div>

                </div>


                {/* HERO VISUAL */}

                <div className="hero-visual">

                    <div className="hero-image-frame">

                        <img
                            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85"
                            alt="Professional home service"
                        />

                        <div className="hero-image-shade"></div>

                        <div className="hero-location-pill">
                            <span>●</span>
                            Service professionals
                        </div>

                    </div>

                    <div className="hero-float-card hero-booking-card">

                        <div className="float-card-icon success">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Booking ready
                            </strong>

                            <small>
                                Choose a service and
                                a convenient time.
                            </small>
                        </div>

                    </div>

                    <div className="hero-float-card hero-rating-card">

                        <div className="rating-stars">
                            ★★★★★
                        </div>

                        <strong>
                            {averageRating}
                        </strong>

                        <small>
                            live average rating
                        </small>

                    </div>

                    <div className="hero-mini-card">

                        <span>⚡</span>

                        <div>
                            <strong>
                                {services.length || "—"}
                            </strong>

                            <small>
                                services available
                            </small>
                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                QUICK VALUE STRIP
            ===================================================== */}

            <section className="trust-strip">

                <div>
                    <span className="trust-strip-icon">
                        ✓
                    </span>

                    <div>
                        <strong>
                            Clear service details
                        </strong>

                        <small>
                            See price, rating and description
                        </small>
                    </div>
                </div>

                <div>
                    <span className="trust-strip-icon">
                        ⚡
                    </span>

                    <div>
                        <strong>
                            Fast discovery
                        </strong>

                        <small>
                            Search the service you need
                        </small>
                    </div>
                </div>

                <div>
                    <span className="trust-strip-icon">
                        📅
                    </span>

                    <div>
                        <strong>
                            Easy booking
                        </strong>

                        <small>
                            Pick a convenient time
                        </small>
                    </div>
                </div>

                <div>
                    <span className="trust-strip-icon">
                        ⭐
                    </span>

                    <div>
                        <strong>
                            Review your experience
                        </strong>

                        <small>
                            Help others choose confidently
                        </small>
                    </div>
                </div>

            </section>


            {/* =====================================================
                CATEGORIES
            ===================================================== */}

            <section
                className="home-section categories-section"
                id="categories"
            >

                <div className="section-heading-row">

                    <div>
                        <span className="section-kicker">
                            EXPLORE
                        </span>

                        <h2>
                            What can we help you with?
                        </h2>

                        <p>
                            Start with a category or browse
                            the full service catalog.
                        </p>
                    </div>

                    <button
                        className="section-link-button"
                        onClick={goToServices}
                    >
                        View all services →
                    </button>

                </div>

                <div className="home-category-grid">

                    {CATEGORY_META.map(
                        (category, index) => {

                            const count =
                                Object.entries(
                                    categoryCounts
                                )
                                    .filter(
                                        ([key]) =>
                                            key
                                                .toLowerCase()
                                                .includes(
                                                    category.title
                                                        .toLowerCase()
                                                )
                                    )
                                    .reduce(
                                        (
                                            total,
                                            [, value]
                                        ) =>
                                            total + value,
                                        0
                                    );

                            return (
                                <button
                                    type="button"
                                    className={`home-category-card ${category.color}`}
                                    key={category.label}
                                    style={{
                                        animationDelay:
                                            `${index * 90}ms`
                                    }}
                                    onClick={() =>
                                        handleCategory(
                                            category.title
                                        )
                                    }
                                >

                                    <div className="category-top">

                                        <span className="category-icon">
                                            {category.icon}
                                        </span>

                                        <span className="category-arrow">
                                            ↗
                                        </span>

                                    </div>

                                    <strong>
                                        {category.label}
                                    </strong>

                                    <small>
                                        {count || 0}{" "}
                                        service
                                        {count === 1
                                            ? ""
                                            : "s"}
                                    </small>

                                </button>
                            );
                        }
                    )}

                </div>

            </section>


            {/* =====================================================
                LIVE SERVICES
            ===================================================== */}

            <section className="home-section services-preview">

                <div className="section-heading-row">

                    <div>
                        <span className="section-kicker">
                            LIVE CATALOG
                        </span>

                        <h2>
                            Popular services
                        </h2>

                        <p>
                            These cards come directly from
                            your live backend database.
                        </p>
                    </div>

                    <button
                        className="section-link-button"
                        onClick={goToServices}
                    >
                        See all {services.length || ""} →
                    </button>

                </div>

                {loadingServices ? (
                    <div className="service-loading-grid">

                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    className="service-skeleton"
                                    key={item}
                                >
                                    <div className="skeleton-image"></div>
                                    <div className="skeleton-line long"></div>
                                    <div className="skeleton-line"></div>
                                    <div className="skeleton-line short"></div>
                                </div>
                            )
                        )}

                    </div>
                ) : servicesError ? (

                    <div className="home-error-state">

                        <div className="home-error-icon">
                            !
                        </div>

                        <div>
                            <strong>
                                Live services are
                                temporarily unavailable.
                            </strong>

                            <p>
                                You can still open the full
                                services page and try again.
                            </p>
                        </div>

                        <button
                            onClick={goToServices}
                        >
                            Open Services
                        </button>

                    </div>

                ) : (

                    <div className="home-service-grid">

                        {featuredServices.map(
                            (service, index) => (

                                <div
                                    className="home-service-item"
                                    key={service.id}
                                    style={{
                                        animationDelay:
                                            `${index * 100}ms`
                                    }}
                                >

                                    <ServiceCard
                                        id={service.id}
                                        image={
                                            getServiceImage(
                                                service
                                            )
                                        }
                                        title={service.title}
                                        description={
                                            service.description
                                        }
                                        price={
                                            service.price
                                        }
                                        rating={
                                            service.rating
                                        }
                                    />

                                </div>
                            )
                        )}

                    </div>

                )}

            </section>


            {/* =====================================================
                AI ASSISTANT
            ===================================================== */}

            <section
                className="ai-home-section"
                id="ai"
            >

                <div className="ai-home-copy">

                    <span className="section-kicker">
                        SMART ASSISTANCE
                    </span>

                    <h2>
                        Not sure what service
                        <span> you need?</span>
                    </h2>

                    <p>
                        Describe the problem in plain language.
                        ServiConnect can turn your description
                        into a service suggestion and take you
                        to the catalog.
                    </p>

                    <button
                        className="ai-open-button"
                        onClick={() =>
                            setAiOpen(true)
                        }
                    >
                        Open ServiAI
                        <span>→</span>
                    </button>

                </div>


                <div className="ai-demo-window">

                    <div className="ai-window-top">

                        <div className="ai-brand">
                            <span>✦</span>
                            <div>
                                <strong>
                                    ServiAI
                                </strong>
                                <small>
                                    Service assistant
                                </small>
                            </div>
                        </div>

                        <span className="ai-online">
                            online
                        </span>

                    </div>

                    <div className="ai-demo-messages">

                        <div className="ai-demo-user">
                            My AC is not cooling.
                        </div>

                        <div className="ai-demo-bot">
                            Try <strong>AC Repair</strong>.
                            I can take you straight to
                            available services.
                        </div>

                    </div>

                    <button
                        className="ai-demo-action"
                        onClick={() =>
                            handleQuickSearch(
                                "AC Repair"
                            )
                        }
                    >
                        Find AC Repair
                        <span>→</span>
                    </button>

                </div>

            </section>


            {/* =====================================================
                HOW IT WORKS
            ===================================================== */}

            <section className="home-section home-how">

                <div className="section-heading-centered">

                    <span className="section-kicker">
                        HOW IT WORKS
                    </span>

                    <h2>
                        From problem to professional.
                    </h2>

                    <p>
                        A straightforward booking flow for
                        everyday service needs.
                    </p>

                </div>

                <div className="home-how-grid">

                    <div className="how-card">
                        <span>01</span>
                        <div>⌕</div>
                        <h3>
                            Search
                        </h3>
                        <p>
                            Tell us what you need and
                            browse matching services.
                        </p>
                    </div>

                    <div className="how-connector"></div>

                    <div className="how-card">
                        <span>02</span>
                        <div>⚖</div>
                        <h3>
                            Compare
                        </h3>
                        <p>
                            Review prices, descriptions
                            and ratings.
                        </p>
                    </div>

                    <div className="how-connector"></div>

                    <div className="how-card">
                        <span>03</span>
                        <div>📅</div>
                        <h3>
                            Book
                        </h3>
                        <p>
                            Choose your time and confirm
                            your service.
                        </p>
                    </div>

                </div>

                <div className="how-bottom-action">

                    <button
                        onClick={goToServices}
                    >
                        Start browsing services →
                    </button>

                </div>

            </section>


            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="home-final-cta">

                <div className="cta-noise"></div>

                <div className="cta-content">

                    <span>
                        READY WHEN YOU ARE
                    </span>

                    <h2>
                        Your next service
                        starts here.
                    </h2>

                    <p>
                        Explore the live catalog and find the
                        service that fits your needs.
                    </p>

                    <button
                        onClick={goToServices}
                    >
                        Explore Services
                        <span>→</span>
                    </button>

                </div>

            </section>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="home-footer">

                <div className="footer-grid">

                    <div className="footer-brand">

                        <div className="footer-logo">
                            ⚡ ServiConnect
                        </div>

                        <p>
                            A simpler way to discover
                            and book everyday services.
                        </p>

                        <button
                            onClick={() =>
                                scrollToSection("categories")
                            }
                        >
                            Browse categories →
                        </button>

                    </div>

                    <div>

                        <h4>
                            Discover
                        </h4>

                        <button
                            onClick={goToServices}
                        >
                            All Services
                        </button>

                        <button
                            onClick={() =>
                                handleQuickSearch(
                                    "Cleaning"
                                )
                            }
                        >
                            Cleaning
                        </button>

                        <button
                            onClick={() =>
                                handleQuickSearch(
                                    "Electrical"
                                )
                            }
                        >
                            Electrical
                        </button>

                    </div>

                    <div>

                        <h4>
                            Company
                        </h4>

                        <button
                            onClick={() =>
                                navigate("/about")
                            }
                        >
                            About
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/how-it-works"
                                )
                            }
                        >
                            How It Works
                        </button>

                    </div>

                    <div>

                        <h4>
                            Account
                        </h4>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </button>

                        <button
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create Account
                        </button>

                    </div>

                </div>

                <div className="footer-bottom-row">

                    <span>
                        © 2026 ServiConnect
                    </span>

                    <span>
                        Live services:{" "}
                        {services.length}
                    </span>

                </div>

            </footer>


            {/* =====================================================
                FLOATING AI
            ===================================================== */}

            <button
                className={`floating-ai-button ${
                    aiOpen ? "is-open" : ""
                }`}
                onClick={() =>
                    setAiOpen((value) => !value)
                }
                aria-label="Open ServiAI"
            >
                ✦
                <span></span>
            </button>


            {/* =====================================================
                AI PANEL
            ===================================================== */}

            {aiOpen && (

                <div className="ai-panel">

                    <div className="ai-panel-header">

                        <div>
                            <strong>
                                ServiAI
                            </strong>

                            <small>
                                Describe your problem
                            </small>
                        </div>

                        <button
                            onClick={() =>
                                setAiOpen(false)
                            }
                            aria-label="Close AI assistant"
                        >
                            ×
                        </button>

                    </div>

                    <div className="ai-panel-body">

                        <div className="ai-panel-bubble bot">
                            Hi! What do you need help
                            with today?
                        </div>

                        <div className="ai-suggestions">

                            {[
                                "My AC is not cooling",
                                "I need electrical repair",
                                "My house needs cleaning",
                                "I have a plumbing issue"
                            ].map(
                                (item) => (
                                    <button
                                        key={item}
                                        onClick={() =>
                                            askAI(
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    <form
                        className="ai-panel-input"
                        onSubmit={(event) => {
                            event.preventDefault();
                            askAI("");
                        }}
                    >

                        <input
                            value={aiMessage}
                            onChange={(event) =>
                                setAiMessage(
                                    event.target.value
                                )
                            }
                            placeholder="Describe your problem..."
                        />

                        <button type="submit">
                            →
                        </button>

                    </form>

                </div>

            )}

        </div>
    );
}

export default Home;