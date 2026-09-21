import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";
import ServiceCard from "../components/ServiceCard";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

function Home() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    function handleSearch() {
        if (search.trim() === "") {
            return;
        }

        navigate(
            `/search?q=${encodeURIComponent(search)}`
        );
    }

    function handleQuickSearch(value) {
        setSearch(value);

        navigate(
            `/search?q=${encodeURIComponent(value)}`
        );
    }

    const categories = [
        {
            icon: "💇",
            title: "Beauty & Wellness",
            count: 25,
        },
        {
            icon: "🔧",
            title: "Home Repair",
            count: 18,
        },
        {
            icon: "🧹",
            title: "Cleaning",
            count: 15,
        },
        {
            icon: "🚗",
            title: "Vehicle Care",
            count: 10,
        },
        {
            icon: "🐜",
            title: "Pest Control",
            count: 8,
        },
        {
            icon: "💻",
            title: "Computer Repair",
            count: 12,
        },
    ];

    const services = [
        {
            id: 1,
            image:
                "https://images.unsplash.com/photo-1560066984-138dadb4c035",
            title: "Salon at Home",
            description:
                "Professional salon services at your doorstep",
            price: 499,
            rating: 4.8,
        },
        {
            id: 3,
            image:
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
            title: "AC Repair",
            description:
                "Quick and reliable AC repair service",
            price: 299,
            rating: 4.7,
        },
        {
            id: 4,
            image:
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
            title: "Home Cleaning",
            description:
                "Deep cleaning for a fresh and clean home",
            price: 699,
            rating: 4.9,
        },
        {
            id: 2,
            image:
                "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1",
            title: "Spa at Home",
            description:
                "Relaxing spa experience at your home",
            price: 999,
            rating: 4.8,
        },
    ];

    return (
        <div className="home-page">

            <Navbar />

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="hero">

                <div className="hero-background-shape hero-shape-one"></div>
                <div className="hero-background-shape hero-shape-two"></div>
                <div className="hero-background-shape hero-shape-three"></div>

                <div className="hero-content">

                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        ✨ Trusted professionals at your doorstep
                    </div>

                    <h1>
                        Services that
                        <span> make life easier.</span>
                    </h1>

                    <p>
                        Book trusted professionals for your home
                        and personal needs. Fast, reliable and
                        convenient.
                    </p>

                    <div className="search-box">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="What service do you need?"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />

                        <button onClick={handleSearch}>
                            Search
                        </button>

                    </div>

                    <div className="quick-search">

                        <span>Popular:</span>

                        <button
                            onClick={() =>
                                handleQuickSearch("Salon")
                            }
                        >
                            Salon
                        </button>

                        <button
                            onClick={() =>
                                handleQuickSearch("AC Repair")
                            }
                        >
                            AC Repair
                        </button>

                        <button
                            onClick={() =>
                                handleQuickSearch("Cleaning")
                            }
                        >
                            Cleaning
                        </button>

                        <button
                            onClick={() =>
                                handleQuickSearch("Electrician")
                            }
                        >
                            Electrician
                        </button>

                    </div>

                    <div className="hero-stats">

                        <div className="hero-stat">
                            <strong>50+</strong>
                            <span>Services</span>
                        </div>

                        <div className="hero-stat-divider"></div>

                        <div className="hero-stat">
                            <strong>100+</strong>
                            <span>Professionals</span>
                        </div>

                        <div className="hero-stat-divider"></div>

                        <div className="hero-stat">
                            <strong>4.8</strong>
                            <span>Average Rating ⭐</span>
                        </div>

                    </div>

                </div>

                {/* =================================================
                    HERO VISUAL
                ================================================= */}

                <div className="hero-image">

                    <div className="hero-glow"></div>

                    <div className="hero-main-circle">

                        <div className="hero-house">
                            🏠
                        </div>

                    </div>

                    <div className="hero-floating-card booking-floating-card">

                        <div className="hero-card-icon">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Professional booked!
                            </strong>

                            <p>
                                Your service is confirmed
                            </p>
                        </div>

                    </div>

                    <div className="hero-floating-card rating-floating-card">

                        <div className="floating-star">
                            ⭐
                        </div>

                        <div>
                            <strong>
                                4.9/5
                            </strong>

                            <p>
                                Customer rating
                            </p>
                        </div>

                    </div>

                    <div className="hero-floating-card service-floating-card">

                        <span className="mini-service-icon">
                            🔧
                        </span>

                        <div>
                            <strong>
                                Expert Service
                            </strong>

                            <p>
                                Available near you
                            </p>
                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                CATEGORIES
            ===================================================== */}

            <section
                className="section categories-section"
                id="services"
            >

                <div className="section-heading">

                    <div>
                        <span>EXPLORE</span>

                        <h2>
                            What do you need help with?
                        </h2>
                    </div>

                    <button
                        className="view-all"
                        onClick={() =>
                            navigate("/services")
                        }
                    >
                        View all →
                    </button>

                </div>

                <div className="category-grid">

                    {categories.map(
                        (category, index) => (
                            <div
                                className="animated-category"
                                key={index}
                                style={{
                                    animationDelay:
                                        `${index * 0.08}s`,
                                }}
                            >
                                <CategoryCard
                                    icon={category.icon}
                                    title={category.title}
                                    count={category.count}
                                />
                            </div>
                        )
                    )}

                </div>

            </section>

            {/* =====================================================
                POPULAR SERVICES
            ===================================================== */}

            <section className="section popular-section">

                <div className="section-heading">

                    <div>
                        <span>
                            POPULAR SERVICES
                        </span>

                        <h2>
                            Services people love
                        </h2>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/services")
                        }
                    >
                        View All Services
                    </button>

                </div>

                <div className="service-grid">

                    {services.map(
                        (service, index) => (
                            <div
                                className="animated-service"
                                key={service.id}
                                style={{
                                    animationDelay:
                                        `${index * 0.1}s`,
                                }}
                            >
                                <ServiceCard
                                    id={service.id}
                                    image={service.image}
                                    title={service.title}
                                    description={
                                        service.description
                                    }
                                    price={service.price}
                                    rating={service.rating}
                                />
                            </div>
                        )
                    )}

                </div>

            </section>

            {/* =====================================================
                AI SECTION
            ===================================================== */}

            <section className="ai-section">

                <div className="ai-background-circle ai-circle-one"></div>
                <div className="ai-background-circle ai-circle-two"></div>

                <div className="ai-content">

                    <div className="ai-label">
                        ✨ AI POWERED
                    </div>

                    <h2>
                        Not sure what service
                        <br />
                        you need?
                    </h2>

                    <p>
                        Tell our AI assistant what's wrong.
                        We'll understand your problem and
                        recommend the right service and
                        professionals for you.
                    </p>

                    <button className="ai-button">
                        Ask AI Assistant →
                    </button>

                </div>

                <div className="ai-chat">

                    <div className="chat-header">

                        <div className="chat-bot-icon">
                            🤖
                        </div>

                        <div>
                            <strong>
                                ServiAI
                            </strong>

                            <small>
                                AI Service Assistant
                            </small>
                        </div>

                        <span className="online-dot"></span>

                    </div>

                    <div className="chat-message user-message">
                        My AC is not cooling properly.
                    </div>

                    <div className="chat-message ai-message">
                        I can help! It sounds like you may
                        need an AC repair service. Would you
                        like me to find available professionals
                        near you?
                    </div>

                    <button className="find-btn">
                        Find AC Professionals
                    </button>

                </div>

            </section>

            {/* =====================================================
                HOW IT WORKS
            ===================================================== */}

            <section
                className="section how-section"
                id="how-it-works"
            >

                <div className="center-heading">

                    <span>
                        HOW IT WORKS
                    </span>

                    <h2>
                        Get your service in 3 simple steps
                    </h2>

                    <p>
                        Everything is designed to make booking
                        simple and stress-free.
                    </p>

                </div>

                <div className="steps">

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <div className="step-icon">
                            🔎
                        </div>

                        <h3>
                            Choose a service
                        </h3>

                        <p>
                            Browse professional services
                            according to your needs.
                        </p>

                    </div>

                    <div className="step-connector"></div>

                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <div className="step-icon">
                            👨‍🔧
                        </div>

                        <h3>
                            Pick a professional
                        </h3>

                        <p>
                            Compare ratings, prices and
                            availability before choosing.
                        </p>

                    </div>

                    <div className="step-connector"></div>

                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <div className="step-icon">
                            🏠
                        </div>

                        <h3>
                            Book & relax
                        </h3>

                        <p>
                            Select your time and enjoy
                            reliable service at home.
                        </p>

                    </div>

                </div>

            </section>

            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="home-cta">

                <div className="cta-glow"></div>

                <div className="cta-content">

                    <span>
                        READY WHEN YOU ARE
                    </span>

                    <h2>
                        Let's make your day easier.
                    </h2>

                    <p>
                        Find the right professional for your
                        next home service.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/services")
                        }
                    >
                        Explore Services →
                    </button>

                </div>

            </section>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer id="about">

                <div className="footer-main">

                    <div className="footer-brand">

                        <div className="logo">
                            <span>⚡</span>
                            ServiConnect
                        </div>

                        <p>
                            Making everyday services simple,
                            reliable and accessible.
                        </p>

                        <div className="footer-socials">
                            <span>f</span>
                            <span>𝕏</span>
                            <span>◎</span>
                        </div>

                    </div>

                    <div>
                        <h4>Services</h4>
                        <p>Beauty & Wellness</p>
                        <p>Home Repair</p>
                        <p>Cleaning</p>
                        <p>Vehicle Care</p>
                    </div>

                    <div>
                        <h4>Company</h4>
                        <p>About Us</p>
                        <p>Contact</p>
                        <p>Careers</p>
                        <p>Become a Provider</p>
                    </div>

                    <div>
                        <h4>Support</h4>
                        <p>Help Center</p>
                        <p>Terms</p>
                        <p>Privacy</p>
                        <p>Refund Policy</p>
                    </div>

                </div>

                <div className="footer-bottom">
                    © 2026 ServiConnect. All rights reserved.
                </div>

            </footer>

            {/* =====================================================
                FLOATING AI
            ===================================================== */}

            <button
                className="floating-ai"
                title="Ask ServiAI"
            >
                ✨
                <span className="floating-ai-pulse"></span>
            </button>

        </div>
    );
}

export default Home;