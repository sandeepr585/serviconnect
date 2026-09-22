import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function MyBookings() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchBookings() {
            if (!token) {
                setBookings([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://serviconnect-backend-f1um.onrender.com/api/bookings/my-bookings",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const text = await response.text();

                let data;

                try {
                    data = JSON.parse(text);
                } catch {
                    data = text;
                }

                if (!response.ok) {
                    throw new Error(
                        typeof data === "string"
                            ? data
                            : data?.message ||
                              "Unable to load bookings."
                    );
                }

                setBookings(
                    Array.isArray(data) ? data : []
                );
            } catch (err) {
                console.error(
                    "Booking loading error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load bookings."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchBookings();
    }, [token]);

    function getStatusClass(status) {
        switch (
            String(status || "").toUpperCase()
        ) {
            case "CONFIRMED":
                return "confirmed";

            case "ASSIGNED":
                return "assigned";

            case "ACCEPTED":
                return "accepted";

            case "IN_PROGRESS":
                return "in-progress";

            case "COMPLETED":
                return "completed";

            case "CANCELLED":
                return "cancelled";

            default:
                return "default";
        }
    }

    function getStatusText(status) {
        switch (
            String(status || "").toUpperCase()
        ) {
            case "CONFIRMED":
                return "Booking Confirmed";

            case "ASSIGNED":
                return "Provider Assigned";

            case "ACCEPTED":
                return "Provider Accepted";

            case "IN_PROGRESS":
                return "Service In Progress";

            case "COMPLETED":
                return "Service Completed";

            case "CANCELLED":
                return "Booking Cancelled";

            default:
                return status || "Unknown";
        }
    }

    function getProgress(status) {
        switch (
            String(status || "").toUpperCase()
        ) {
            case "CONFIRMED":
                return 20;

            case "ASSIGNED":
                return 40;

            case "ACCEPTED":
                return 60;

            case "IN_PROGRESS":
                return 80;

            case "COMPLETED":
                return 100;

            default:
                return 0;
        }
    }

    function formatDate(date) {
        if (!date) {
            return "Not available";
        }

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function formatTime(time) {
        if (!time) {
            return "Not available";
        }

        const parts = String(time).split(":");

        const date = new Date();

        date.setHours(
            Number(parts[0]),
            Number(parts[1]),
            0,
            0
        );

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    }

    if (loading) {
        return (
            <div className="my-bookings-page">
                <div className="loading-box">
                    <div className="spinner"></div>

                    <h2>
                        Loading your bookings...
                    </h2>

                    <p>
                        Please wait.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-bookings-page">

            <div className="my-bookings-container">

                <div className="bookings-header">
                    <div>
                        <h1>
                            My Bookings
                        </h1>

                        <p>
                            Track your service bookings
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        🔄 Refresh
                    </button>
                </div>


                {error && (
                    <div className="error-box">
                        ❌ {error}
                    </div>
                )}


                {!error &&
                    bookings.length === 0 && (
                        <div className="empty-box">

                            <div className="empty-icon">
                                📅
                            </div>

                            <h2>
                                No Bookings Yet
                            </h2>

                            <p>
                                You have not booked
                                any services yet.
                            </p>

                            <button
                                className="browse-button"
                                onClick={() =>
                                    navigate(
                                        "/services"
                                    )
                                }
                            >
                                Browse Services
                            </button>

                        </div>
                    )}


                <div className="booking-list">

                    {bookings.map((booking) => {

                        const status =
                            String(
                                booking.status || ""
                            ).toUpperCase();

                        const progress =
                            getProgress(status);

                        const completed =
                            status === "COMPLETED";

                        const cancelled =
                            status === "CANCELLED";

                        return (
                            <div
                                className="booking-card"
                                key={booking.id}
                            >

                                <div className="booking-card-header">

                                    <div>
                                        <span className="booking-number">
                                            Booking #{booking.id}
                                        </span>

                                        <h2>
                                            {booking.serviceTitle}
                                        </h2>
                                    </div>

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            status
                                        )}`}
                                    >
                                        {getStatusText(
                                            status
                                        )}
                                    </span>

                                </div>


                                <div className="booking-details">

                                    <div className="detail">
                                        <span>📅</span>

                                        <div>
                                            <small>
                                                Date
                                            </small>

                                            <strong>
                                                {formatDate(
                                                    booking.bookingDate
                                                )}
                                            </strong>
                                        </div>
                                    </div>


                                    <div className="detail">
                                        <span>🕐</span>

                                        <div>
                                            <small>
                                                Time
                                            </small>

                                            <strong>
                                                {formatTime(
                                                    booking.bookingTime
                                                )}
                                            </strong>
                                        </div>
                                    </div>


                                    <div className="detail">
                                        <span>📍</span>

                                        <div>
                                            <small>
                                                Address
                                            </small>

                                            <strong>
                                                {booking.address}
                                            </strong>
                                        </div>
                                    </div>


                                    <div className="detail">
                                        <span>💰</span>

                                        <div>
                                            <small>
                                                Price
                                            </small>

                                            <strong>
                                                ₹{booking.price}
                                            </strong>
                                        </div>
                                    </div>

                                </div>


                                {!cancelled && (
                                    <div className="progress-section">

                                        <div className="progress-header">

                                            <strong>
                                                Booking Progress
                                            </strong>

                                            <span>
                                                {progress}%
                                            </span>

                                        </div>

                                        <div className="progress-bar">

                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width:
                                                        `${progress}%`,
                                                }}
                                            ></div>

                                        </div>

                                        <div className="progress-labels">
                                            <span>
                                                Confirmed
                                            </span>

                                            <span>
                                                Assigned
                                            </span>

                                            <span>
                                                Accepted
                                            </span>

                                            <span>
                                                In Progress
                                            </span>

                                            <span>
                                                Completed
                                            </span>
                                        </div>

                                    </div>
                                )}


                                {cancelled && (
                                    <div className="cancelled-box">

                                        ❌

                                        <div>
                                            <strong>
                                                Booking Cancelled
                                            </strong>

                                            <p>
                                                This booking
                                                has been
                                                cancelled.
                                            </p>
                                        </div>

                                    </div>
                                )}


                                {completed && (
                                    <div className="completed-section">

                                        <div className="completed-message">

                                            <span>
                                                🎉
                                            </span>

                                            <div>
                                                <strong>
                                                    Service Completed
                                                </strong>

                                                <p>
                                                    Your service
                                                    has been
                                                    completed
                                                    successfully.
                                                </p>
                                            </div>

                                        </div>

                                        <button
                                            className="review-button"
                                            onClick={() =>
                                                navigate(
                                                    `/review/${booking.id}`
                                                )
                                            }
                                        >
                                            ⭐ Rate Service
                                        </button>

                                    </div>
                                )}

                            </div>
                        );
                    })}

                </div>

            </div>


            <style>{`

                .my-bookings-page {
                    min-height: 100vh;
                    background: #f5f7fb;
                    padding: 40px 20px;
                }

                .my-bookings-container {
                    max-width: 1100px;
                    margin: auto;
                }

                .bookings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    gap: 20px;
                }

                .bookings-header h1 {
                    margin: 0 0 8px;
                    font-size: 34px;
                    color: #172033;
                }

                .bookings-header p {
                    margin: 0;
                    color: #737b8c;
                }

                .refresh-button {
                    border: none;
                    background: white;
                    padding: 12px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    box-shadow:
                        0 3px 12px
                        rgba(0,0,0,0.08);
                }

                .error-box {
                    background: #fff0f0;
                    color: #c62828;
                    border: 1px solid #ffcaca;
                    padding: 16px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }

                .empty-box {
                    background: white;
                    border-radius: 18px;
                    padding: 70px 20px;
                    text-align: center;
                    box-shadow:
                        0 5px 25px
                        rgba(0,0,0,0.06);
                }

                .empty-icon {
                    font-size: 55px;
                    margin-bottom: 15px;
                }

                .empty-box h2 {
                    margin: 0 0 8px;
                    color: #172033;
                }

                .empty-box p {
                    color: #737b8c;
                    margin-bottom: 25px;
                }

                .browse-button {
                    border: none;
                    background: #6c4cff;
                    color: white;
                    padding: 13px 25px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 700;
                }

                .booking-list {
                    display: flex;
                    flex-direction: column;
                    gap: 22px;
                }

                .booking-card {
                    background: white;
                    border-radius: 18px;
                    padding: 25px;
                    border: 1px solid #edf0f5;
                    box-shadow:
                        0 5px 25px
                        rgba(0,0,0,0.07);
                }

                .booking-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #edf0f5;
                }

                .booking-number {
                    font-size: 13px;
                    color: #7b8190;
                    font-weight: 600;
                }

                .booking-card h2 {
                    margin: 7px 0 0;
                    color: #172033;
                    font-size: 23px;
                }

                .status-badge {
                    padding: 9px 15px;
                    border-radius: 30px;
                    font-size: 13px;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .confirmed {
                    background: #e8f0ff;
                    color: #2457b8;
                }

                .assigned {
                    background: #fff3d6;
                    color: #9a6500;
                }

                .accepted {
                    background: #e9e5ff;
                    color: #5c42ad;
                }

                .in-progress {
                    background: #e0f4ff;
                    color: #08749c;
                }

                .completed {
                    background: #e2f8eb;
                    color: #168044;
                }

                .cancelled {
                    background: #ffe5e5;
                    color: #c62828;
                }

                .default {
                    background: #eeeeee;
                    color: #555;
                }

                .booking-details {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap: 20px;
                    padding: 22px 0;
                }

                .detail {
                    display: flex;
                    gap: 10px;
                }

                .detail > span {
                    font-size: 21px;
                }

                .detail small {
                    display: block;
                    color: #8a91a0;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .detail strong {
                    display: block;
                    color: #252b38;
                    font-size: 14px;
                    word-break: break-word;
                }

                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    font-size: 14px;
                }

                .progress-header span {
                    color: #6c4cff;
                    font-weight: 700;
                }

                .progress-bar {
                    width: 100%;
                    height: 9px;
                    background: #edf0f5;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: #6c4cff;
                    border-radius: 20px;
                }

                .progress-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    color: #8a91a0;
                    font-size: 11px;
                }

                .completed-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #edf0f5;
                }

                .completed-message {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .completed-message > span {
                    font-size: 30px;
                }

                .completed-message strong {
                    color: #168044;
                    display: block;
                }

                .completed-message p {
                    margin: 4px 0 0;
                    color: #777f8f;
                    font-size: 13px;
                }

                .review-button {
                    border: none;
                    background: #6c4cff;
                    color: white;
                    padding: 13px 22px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 700;
                }

                .review-button:hover {
                    background: #5639dc;
                }

                .cancelled-box {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                    padding: 16px;
                    background: #fff5f5;
                    border-radius: 10px;
                    color: #c62828;
                }

                .cancelled-box p {
                    margin: 4px 0 0;
                    color: #777;
                    font-size: 13px;
                }

                .loading-box {
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .loading-box h2 {
                    margin-bottom: 5px;
                }

                .loading-box p {
                    color: #777;
                }

                .spinner {
                    width: 42px;
                    height: 42px;
                    border: 4px solid #e5e7eb;
                    border-top-color: #6c4cff;
                    border-radius: 50%;
                    animation:
                        booking-spin
                        0.8s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes booking-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (max-width: 800px) {

                    .booking-details {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .booking-card-header {
                        flex-direction: column;
                    }

                    .completed-section {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 550px) {

                    .my-bookings-page {
                        padding: 25px 12px;
                    }

                    .bookings-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .booking-details {
                        grid-template-columns: 1fr;
                    }

                    .progress-labels {
                        font-size: 8px;
                    }
                }

            `}</style>

        </div>
    );
}

export default MyBookings;
