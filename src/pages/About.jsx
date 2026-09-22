import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function About() {
    const features = [
        {
            icon: "🛡️",
            title: "Trusted professionals",
            text: "Discover service professionals with transparent ratings and clear pricing."
        },
        {
            icon: "⚡",
            title: "Fast booking",
            text: "Find a service, select a convenient time and confirm your booking in minutes."
        },
        {
            icon: "✨",
            title: "Simple experience",
            text: "Everything from discovery to booking and tracking is managed in one place."
        }
    ];

    const stats = [
        ["12+", "Service categories"],
        ["24/7", "Booking access"],
        ["4.7★", "Average service rating"],
        ["1", "Simple platform"]
    ];

    return (
        <div className="about-page page-enter">

            <Navbar />

            {/* HERO */}

            <section className="page-header about-hero">

                <div className="floating-orb orb-one"></div>
                <div className="floating-orb orb-two"></div>

                <div className="page-header-content">

                    <span className="animated-label">
                        ABOUT SERVICONNECT
                    </span>

                    <h1>
                        Making everyday
                        <span> services easier.</span>
                    </h1>

                    <p>
                        ServiConnect connects customers with trusted
                        service professionals through one simple platform.
                    </p>

                    <div className="about-hero-actions">

                        <Link
                            to="/services"
                            className="primary-cta"
                        >
                            Explore Services
                            <span>→</span>
                        </Link>

                        <Link
                            to="/how-it-works"
                            className="secondary-cta"
                        >
                            See How It Works
                        </Link>

                    </div>

                </div>

            </section>


            {/* STATS */}

            <section className="about-stats-section">

                <div className="about-stats">

                    {stats.map(([number, label], index) => (
                        <div
                            className="about-stat"
                            key={label}
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            <strong>{number}</strong>
                            <span>{label}</span>
                        </div>
                    ))}

                </div>

            </section>


            {/* MAIN CONTENT */}

            <section className="section about-content enhanced-about-content">

                <div className="about-story">

                    <div className="section-eyebrow">
                        ONE PLATFORM
                    </div>

                    <h2>
                        Everything you need to
                        <span> get things done.</span>
                    </h2>

                    <p>
                        ServiConnect is designed to make finding and booking
                        professional services simple, transparent and convenient.
                    </p>

                    <p>
                        Customers can discover services, compare ratings and
                        prices, choose a convenient time and track their bookings.
                    </p>

                    <p>
                        Service providers can manage bookings, customers,
                        availability and their daily work from one platform.
                    </p>

                    <Link
                        to="/services"
                        className="text-link"
                    >
                        Browse available services →
                    </Link>

                </div>


                <div className="about-feature-grid">

                    {features.map((feature, index) => (
                        <div
                            className="enhanced-feature-card"
                            key={feature.title}
                            style={{
                                animationDelay: `${index * 140}ms`
                            }}
                        >

                            <div className="feature-icon">
                                {feature.icon}
                            </div>

                            <h3>
                                {feature.title}
                            </h3>

                            <p>
                                {feature.text}
                            </p>

                            <div className="feature-arrow">
                                ↗
                            </div>

                        </div>
                    ))}

                </div>

            </section>


            {/* CTA */}

            <section className="about-final-cta">

                <div>

                    <span>
                        READY TO GET STARTED?
                    </span>

                    <h2>
                        Find the right professional today.
                    </h2>

                    <p>
                        Browse services and book a professional
                        for your next task.
                    </p>

                    <Link
                        to="/services"
                        className="primary-cta dark-cta"
                    >
                        Find a Service
                        <span>→</span>
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default About;