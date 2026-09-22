import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function HowItWorks() {

    const steps = [
        {
            number: "01",
            icon: "🔎",
            title: "Choose a service",
            short: "Start with what you need.",
            description:
                "Browse our service marketplace and choose the type of professional help you need."
        },
        {
            number: "02",
            icon: "👨‍🔧",
            title: "Select a professional",
            short: "Compare your options.",
            description:
                "Compare service details, ratings, prices and availability before making your choice."
        },
        {
            number: "03",
            icon: "📅",
            title: "Choose date and time",
            short: "Pick what works for you.",
            description:
                "Select a convenient date and time that fits your schedule."
        },
        {
            number: "04",
            icon: "✅",
            title: "Book & Pay",
            short: "Confirm your booking.",
            description:
                "Review the booking details and confirm your service appointment."
        },
        {
            number: "05",
            icon: "📍",
            title: "Track your professional",
            short: "Stay updated.",
            description:
                "Follow your booking progress and check the current status of your service."
        },
        {
            number: "06",
            icon: "⭐",
            title: "Rate the service",
            short: "Share your experience.",
            description:
                "After completion, rate your service and help other customers make better choices."
        }
    ];

    const [activeStep, setActiveStep] = useState(0);

    const active = steps[activeStep];

    return (
        <div className="how-page page-enter">

            <Navbar />

            {/* HERO */}

            <section className="page-header how-hero">

                <div className="floating-orb orb-three"></div>
                <div className="floating-orb orb-four"></div>

                <span className="animated-label">
                    HOW IT WORKS
                </span>

                <h1>
                    Getting a service is
                    <span> simple.</span>
                </h1>

                <p>
                    From finding a professional to completing your booking,
                    everything happens in a few simple steps.
                </p>

            </section>


            {/* INTERACTIVE STEPS */}

            <section className="how-work-section">

                <div className="how-work-heading">

                    <span>
                        YOUR JOURNEY
                    </span>

                    <h2>
                        From search to service.
                    </h2>

                    <p>
                        Select a step below to see how ServiConnect works.
                    </p>

                </div>


                <div className="interactive-process">

                    <div className="process-line">
                        <div
                            className="process-line-progress"
                            style={{
                                width: `${(activeStep / (steps.length - 1)) * 100}%`
                            }}
                        />
                    </div>

                    <div className="process-steps">

                        {steps.map((step, index) => (

                            <button
                                key={step.number}
                                className={`process-step ${
                                    activeStep === index
                                        ? "active"
                                        : ""
                                } ${
                                    index < activeStep
                                        ? "completed"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveStep(index)
                                }
                            >

                                <span className="process-number">
                                    {step.number}
                                </span>

                                <span className="process-icon">
                                    {step.icon}
                                </span>

                                <span className="process-title">
                                    {step.title}
                                </span>

                            </button>

                        ))}

                    </div>


                    {/* ACTIVE DETAIL CARD */}

                    <div className="step-detail-card">

                        <div className="step-detail-icon">
                            {active.icon}
                        </div>

                        <div className="step-detail-content">

                            <span>
                                STEP {active.number}
                            </span>

                            <h3>
                                {active.title}
                            </h3>

                            <p>
                                {active.description}
                            </p>

                        </div>

                        <div className="step-detail-side">
                            {active.short}
                        </div>

                    </div>

                </div>

            </section>


            {/* SIMPLE GRID */}

            <section className="section simple-steps-section">

                <div className="section-heading-center">

                    <span>
                        SIX SIMPLE STEPS
                    </span>

                    <h2>
                        A smoother way to book services.
                    </h2>

                </div>

                <div className="steps enhanced-steps">

                    {steps.map((step, index) => (

                        <div
                            className="step enhanced-step"
                            key={step.number}
                            onClick={() =>
                                setActiveStep(index)
                            }
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >

                            <div className="step-top">

                                <span className="step-number">
                                    {step.number}
                                </span>

                                <span className="step-icon">
                                    {step.icon}
                                </span>

                            </div>

                            <h3>
                                {step.title}
                            </h3>

                            <p>
                                {step.description}
                            </p>

                            <span className="step-learn">
                                Explore step →
                            </span>

                        </div>

                    ))}

                </div>

            </section>


            {/* CTA */}

            <section className="how-final-cta">

                <div>

                    <span>
                        READY?
                    </span>

                    <h2>
                        Your next service is just a few clicks away.
                    </h2>

                    <Link
                        to="/services"
                        className="primary-cta dark-cta"
                    >
                        Explore Services
                        <span>→</span>
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default HowItWorks;