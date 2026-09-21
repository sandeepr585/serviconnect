import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

function ProviderDashboard() {
    const { token, user } = useAuth();

    const [providers, setProviders] = useState([]);
    const [selectedProviderId, setSelectedProviderId] =
        useState("");

    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /*
     * LOAD PROVIDERS
     */
    useEffect(() => {
        async function loadProviders() {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/providers"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        "Unable to load providers."
                    );
                }

                setProviders(
                    Array.isArray(data)
                        ? data
                        : []
                );

                /*
                 * Try to automatically select
                 * the logged-in provider.
                 */
                if (user?.email && Array.isArray(data)) {
                    const currentProvider =
                        data.find(
                            (provider) =>
                                provider.email?.toLowerCase() ===
                                user.email?.toLowerCase()
                        );

                    if (currentProvider) {
                        setSelectedProviderId(
                            String(currentProvider.id)
                        );
                    }
                }

            } catch (err) {
                console.error(
                    "Provider loading error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load providers."
                );
            }
        }

        loadProviders();
    }, [user]);


    /*
     * LOAD BOOKINGS + REVIEWS
     */
    useEffect(() => {
        async function loadProviderData() {
            if (!selectedProviderId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const [bookingsResponse, reviewsResponse] =
                    await Promise.all([
                        fetch(
                            `http://localhost:8080/api/bookings/provider/${selectedProviderId}`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        ),

                        fetch(
                            `http://localhost:8080/api/reviews/provider/${selectedProviderId}`
                        ),
                    ]);

                const bookingsText =
                    await bookingsResponse.text();

                const reviewsText =
                    await reviewsResponse.text();

                let bookingsData;
                let reviewsData;

                try {
                    bookingsData =
                        JSON.parse(bookingsText);
                } catch {
                    bookingsData = [];
                }

                try {
                    reviewsData =
                        JSON.parse(reviewsText);
                } catch {
                    reviewsData = [];
                }

                if (!bookingsResponse.ok) {
                    throw new Error(
                        typeof bookingsData === "string"
                            ? bookingsData
                            : "Unable to load bookings."
                    );
                }

                if (!reviewsResponse.ok) {
                    throw new Error(
                        typeof reviewsData === "string"
                            ? reviewsData
                            : "Unable to load reviews."
                    );
                }

                setBookings(
                    Array.isArray(bookingsData)
                        ? bookingsData
                        : []
                );

                setReviews(
                    Array.isArray(reviewsData)
                        ? reviewsData
                        : []
                );

            } catch (err) {
                console.error(
                    "Provider dashboard error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load provider data."
                );

            } finally {
                setLoading(false);
            }
        }

        loadProviderData();
    }, [selectedProviderId, token]);


    /*
     * CHANGE BOOKING STATUS
     */
    async function updateBookingStatus(
        bookingId,
        status
    ) {
        try {
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/bookings/${bookingId}/status?providerId=${selectedProviderId}&status=${status}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const text =
                await response.text();

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
                          "Unable to update booking."
                );
            }

            setBookings((previous) =>
                previous.map((booking) =>
                    booking.id === bookingId
                        ? data
                        : booking
                )
            );

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to update booking."
            );
        }
    }


    /*
     * CALCULATE RATING
     */
    const totalReviews =
        reviews.length;

    const averageRating =
        totalReviews === 0
            ? 0
            : reviews.reduce(
                  (sum, review) =>
                      sum +
                      Number(
                          review.rating || 0
                      ),
                  0
              ) / totalReviews;


    const completedBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "COMPLETED"
        ).length;

    const pendingBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                    "ASSIGNED" ||
                booking.status ===
                    "ACCEPTED"
        ).length;

    const inProgressBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "IN_PROGRESS"
        ).length;


    function renderStars(rating) {
        const rounded =
            Math.round(rating);

        return (
            <span className="rating-stars">
                {[1, 2, 3, 4, 5].map(
                    (star) => (
                        <span
                            key={star}
                            className={
                                star <= rounded
                                    ? "star-filled"
                                    : "star-empty"
                            }
                        >
                            ★
                        </span>
                    )
                )}
            </span>
        );
    }


    if (loading && !selectedProviderId) {
        return (
            <div className="provider-dashboard-page">
                <div className="provider-loading">
                    Loading provider dashboard...
                </div>
            </div>
        );
    }


    return (
        <div className="provider-dashboard-page">

            <div className="provider-dashboard-container">

                {/* HEADER */}

                <div className="provider-dashboard-header">

                    <div>
                        <h1>
                            Provider Dashboard
                        </h1>

                        <p>
                            Manage your service
                            bookings and reviews
                        </p>
                    </div>

                    {user && (
                        <div className="provider-user">
                            👤 {user.name}
                        </div>
                    )}

                </div>


                {/* PROVIDER SELECT */}

                <div className="provider-selector-card">

                    <label>
                        Select Provider
                    </label>

                    <select
                        value={
                            selectedProviderId
                        }
                        onChange={(event) =>
                            setSelectedProviderId(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Select provider
                        </option>

                        {providers.map(
                            (provider) => (
                                <option
                                    key={provider.id}
                                    value={provider.id}
                                >
                                    {provider.name}
                                    {" - "}
                                    {provider.serviceCategory}
                                </option>
                            )
                        )}

                    </select>

                </div>


                {error && (
                    <div className="provider-error">
                        ❌ {error}
                    </div>
                )}


                {/* STAT CARDS */}

                <div className="provider-stats">

                    <div className="provider-stat-card">

                        <div className="stat-icon">
                            📋
                        </div>

                        <div>
                            <span>
                                Total Bookings
                            </span>

                            <strong>
                                {bookings.length}
                            </strong>
                        </div>

                    </div>


                    <div className="provider-stat-card">

                        <div className="stat-icon">
                            ⏳
                        </div>

                        <div>
                            <span>
                                Pending
                            </span>

                            <strong>
                                {pendingBookings}
                            </strong>
                        </div>

                    </div>


                    <div className="provider-stat-card">

                        <div className="stat-icon">
                            🔧
                        </div>

                        <div>
                            <span>
                                In Progress
                            </span>

                            <strong>
                                {inProgressBookings}
                            </strong>
                        </div>

                    </div>


                    <div className="provider-stat-card">

                        <div className="stat-icon">
                            ✅
                        </div>

                        <div>
                            <span>
                                Completed
                            </span>

                            <strong>
                                {completedBookings}
                            </strong>
                        </div>

                    </div>


                    {/* RATING */}

                    <div className="provider-stat-card rating-card">

                        <div className="stat-icon">
                            ⭐
                        </div>

                        <div>

                            <span>
                                Average Rating
                            </span>

                            <strong>
                                {averageRating.toFixed(1)}
                            </strong>

                            <div className="rating-small">
                                {renderStars(
                                    averageRating
                                )}

                                <small>
                                    ({totalReviews} reviews)
                                </small>
                            </div>

                        </div>

                    </div>

                </div>


                {/* REVIEWS */}

                <div className="reviews-section">

                    <div className="section-header">

                        <div>
                            <h2>
                                Customer Reviews
                            </h2>

                            <p>
                                Feedback from your
                                customers
                            </p>
                        </div>

                        <div className="average-rating">

                            <strong>
                                {averageRating.toFixed(
                                    1
                                )}
                            </strong>

                            {renderStars(
                                averageRating
                            )}

                            <span>
                                {totalReviews} reviews
                            </span>

                        </div>

                    </div>


                    {reviews.length === 0 ? (

                        <div className="no-reviews">
                            ⭐

                            <h3>
                                No Reviews Yet
                            </h3>

                            <p>
                                Customer reviews will
                                appear here after
                                completed services.
                            </p>
                        </div>

                    ) : (

                        <div className="reviews-list">

                            {reviews.map(
                                (review) => (

                                    <div
                                        className="review-card"
                                        key={review.id}
                                    >

                                        <div className="review-top">

                                            <div>

                                                <strong>
                                                    Customer
                                                </strong>

                                                <div>
                                                    {renderStars(
                                                        review.rating
                                                    )}
                                                </div>

                                            </div>

                                            <span>
                                                {review.createdAt
                                                    ? new Date(
                                                          review.createdAt
                                                      ).toLocaleDateString(
                                                          "en-IN"
                                                      )
                                                    : ""}
                                            </span>

                                        </div>


                                        {review.comment && (
                                            <p>
                                                "{review.comment}"
                                            </p>
                                        )}

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>


                {/* BOOKINGS */}

                <div className="provider-bookings-section">

                    <div className="section-header">

                        <div>
                            <h2>
                                My Service Bookings
                            </h2>

                            <p>
                                Manage assigned
                                customer bookings
                            </p>
                        </div>

                    </div>


                    {bookings.length === 0 ? (

                        <div className="no-bookings">
                            📋

                            <h3>
                                No Bookings
                            </h3>

                            <p>
                                You don't have any
                                assigned bookings.
                            </p>
                        </div>

                    ) : (

                        <div className="provider-bookings-list">

                            {bookings.map(
                                (booking) => {

                                    const status =
                                        String(
                                            booking.status ||
                                            ""
                                        ).toUpperCase();

                                    return (

                                        <div
                                            className="provider-booking-card"
                                            key={booking.id}
                                        >

                                            <div className="provider-booking-top">

                                                <div>

                                                    <span>
                                                        Booking #
                                                        {booking.id}
                                                    </span>

                                                    <h3>
                                                        {
                                                            booking.serviceTitle
                                                        }
                                                    </h3>

                                                </div>

                                                <span
                                                    className={`booking-status ${status.toLowerCase()}`}
                                                >
                                                    {status}
                                                </span>

                                            </div>


                                            <div className="provider-booking-details">

                                                <div>
                                                    📅
                                                    <span>
                                                        {
                                                            booking.bookingDate
                                                        }
                                                    </span>
                                                </div>

                                                <div>
                                                    🕐
                                                    <span>
                                                        {
                                                            booking.bookingTime
                                                        }
                                                    </span>
                                                </div>

                                                <div>
                                                    📍
                                                    <span>
                                                        {
                                                            booking.address
                                                        }
                                                    </span>
                                                </div>

                                                <div>
                                                    💰
                                                    <span>
                                                        ₹
                                                        {
                                                            booking.price
                                                        }
                                                    </span>
                                                </div>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="booking-actions">

                                                {status ===
                                                    "ASSIGNED" && (

                                                    <button
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking.id,
                                                                "ACCEPTED"
                                                            )
                                                        }
                                                    >
                                                        ✓ Accept Booking
                                                    </button>
                                                )}


                                                {status ===
                                                    "ACCEPTED" && (

                                                    <button
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking.id,
                                                                "IN_PROGRESS"
                                                            )
                                                        }
                                                    >
                                                        🔧 Start Service
                                                    </button>
                                                )}


                                                {status ===
                                                    "IN_PROGRESS" && (

                                                    <button
                                                        onClick={() =>
                                                            updateBookingStatus(
                                                                booking.id,
                                                                "COMPLETED"
                                                            )
                                                        }
                                                    >
                                                        ✓ Complete Service
                                                    </button>
                                                )}


                                                {status ===
                                                    "COMPLETED" && (

                                                    <div className="completed-label">
                                                        🎉 Service Completed
                                                    </div>
                                                )}

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

            </div>


            <style>{`

                .provider-dashboard-page {
                    min-height: 100vh;
                    background: #f5f7fb;
                    padding: 40px 20px 70px;
                }

                .provider-dashboard-container {
                    max-width: 1150px;
                    margin: 0 auto;
                }

                .provider-dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                }

                .provider-dashboard-header h1 {
                    margin: 0 0 7px;
                    color: #172033;
                    font-size: 34px;
                }

                .provider-dashboard-header p {
                    margin: 0;
                    color: #737b8c;
                }

                .provider-user {
                    background: white;
                    padding: 12px 18px;
                    border-radius: 10px;
                    box-shadow:
                        0 3px 12px
                        rgba(0,0,0,0.07);
                    font-weight: 600;
                }

                .provider-selector-card {
                    background: white;
                    padding: 20px;
                    border-radius: 14px;
                    margin-bottom: 20px;
                    box-shadow:
                        0 4px 15px
                        rgba(0,0,0,0.06);
                }

                .provider-selector-card label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 700;
                }

                .provider-selector-card select {
                    width: 100%;
                    max-width: 500px;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 15px;
                }

                .provider-error {
                    background: #fff0f0;
                    color: #c62828;
                    border: 1px solid #ffcaca;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }

                .provider-stats {
                    display: grid;
                    grid-template-columns:
                        repeat(5, 1fr);
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .provider-stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    box-shadow:
                        0 4px 15px
                        rgba(0,0,0,0.06);
                }

                .stat-icon {
                    font-size: 27px;
                }

                .provider-stat-card span {
                    display: block;
                    color: #7b8190;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .provider-stat-card strong {
                    display: block;
                    color: #172033;
                    font-size: 25px;
                }

                .rating-small {
                    margin-top: 5px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .rating-small small {
                    color: #777;
                    font-size: 10px;
                }

                .rating-stars {
                    letter-spacing: 1px;
                }

                .star-filled {
                    color: #f5b301;
                }

                .star-empty {
                    color: #d7d7d7;
                }

                .reviews-section,
                .provider-bookings-section {
                    background: white;
                    padding: 25px;
                    border-radius: 18px;
                    margin-bottom: 25px;
                    box-shadow:
                        0 5px 20px
                        rgba(0,0,0,0.06);
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 22px;
                }

                .section-header h2 {
                    margin: 0 0 5px;
                    color: #172033;
                }

                .section-header p {
                    margin: 0;
                    color: #7b8190;
                    font-size: 14px;
                }

                .average-rating {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .average-rating strong {
                    font-size: 27px;
                    color: #172033;
                }

                .average-rating span:last-child {
                    color: #777;
                    font-size: 13px;
                }

                .reviews-list {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .review-card {
                    border: 1px solid #edf0f5;
                    border-radius: 12px;
                    padding: 17px;
                }

                .review-top {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                }

                .review-top > span {
                    color: #999;
                    font-size: 12px;
                }

                .review-card p {
                    margin: 12px 0 0;
                    color: #555;
                    line-height: 1.5;
                }

                .no-reviews,
                .no-bookings {
                    text-align: center;
                    padding: 40px 20px;
                    color: #777;
                }

                .no-reviews > :first-child,
                .no-bookings > :first-child {
                    font-size: 45px;
                }

                .no-reviews h3,
                .no-bookings h3 {
                    color: #333;
                    margin-bottom: 5px;
                }

                .no-reviews p,
                .no-bookings p {
                    margin: 0;
                }

                .provider-bookings-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .provider-booking-card {
                    border: 1px solid #edf0f5;
                    border-radius: 13px;
                    padding: 20px;
                }

                .provider-booking-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                }

                .provider-booking-top > div > span {
                    color: #8a91a0;
                    font-size: 12px;
                }

                .provider-booking-top h3 {
                    margin: 5px 0 0;
                    color: #172033;
                }

                .booking-status {
                    padding: 7px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    background: #eeeeee;
                }

                .booking-status.assigned {
                    background: #fff3d6;
                    color: #9a6500;
                }

                .booking-status.accepted {
                    background: #e9e5ff;
                    color: #5c42ad;
                }

                .booking-status.in_progress {
                    background: #e0f4ff;
                    color: #08749c;
                }

                .booking-status.completed {
                    background: #e2f8eb;
                    color: #168044;
                }

                .provider-booking-details {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap: 15px;
                    margin: 20px 0;
                    color: #555;
                    font-size: 13px;
                }

                .provider-booking-details div {
                    display: flex;
                    gap: 7px;
                }

                .booking-actions {
                    border-top: 1px solid #edf0f5;
                    padding-top: 15px;
                }

                .booking-actions button {
                    border: none;
                    background: #6c4cff;
                    color: white;
                    padding: 11px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 700;
                }

                .booking-actions button:hover {
                    background: #5639dc;
                }

                .completed-label {
                    color: #168044;
                    font-weight: 700;
                }

                .provider-loading {
                    min-height: 500px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: #555;
                }

                @media (max-width: 1000px) {

                    .provider-stats {
                        grid-template-columns:
                            repeat(3, 1fr);
                    }

                }

                @media (max-width: 700px) {

                    .provider-dashboard-page {
                        padding: 25px 12px;
                    }

                    .provider-dashboard-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .provider-stats {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .booking-details {
                        grid-template-columns: 1fr;
                    }

                    .provider-booking-details {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .section-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                }

                @media (max-width: 450px) {

                    .provider-stats {
                        grid-template-columns: 1fr;
                    }

                    .provider-booking-details {
                        grid-template-columns: 1fr;
                    }

                }

            `}</style>

        </div>
    );
}

export default ProviderDashboard;