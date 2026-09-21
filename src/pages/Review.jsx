import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Review.css";

function Review() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess(false);

        if (!rating) {
            setError("Please select a rating.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8080/api/reviews/booking/${bookingId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        rating: Number(rating),
                        comment: comment.trim(),
                    }),
                }
            );

            const responseText =
                await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch {
                data = responseText;
            }

            if (!response.ok) {
                throw new Error(
                    typeof data === "string"
                        ? data
                        : data?.message ||
                          "Unable to submit review."
                );
            }

            setSuccess(true);

            setTimeout(() => {
                navigate("/my-bookings");
            }, 1200);

        } catch (err) {

            setError(
                err.message ||
                "Unable to submit review."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="review-page">

            <div className="review-card">

                <div className="review-header">

                    <div className="review-icon">
                        ⭐
                    </div>

                    <h1>Rate Your Service</h1>

                    <p>
                        How was your experience?
                    </p>

                </div>

                {error && (
                    <div className="review-error">
                        ❌ {error}
                    </div>
                )}

                {success && (
                    <div className="review-success">
                        ✅ Review submitted successfully!
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="review-form"
                >

                    <div className="rating-section">

                        <label>
                            Your Rating
                        </label>

                        <div className="stars">

                            {[1, 2, 3, 4, 5].map(
                                (star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={
                                            star <= rating
                                                ? "star active"
                                                : "star"
                                        }
                                        onClick={() =>
                                            setRating(star)
                                        }
                                    >
                                        ★
                                    </button>
                                )
                            )}

                        </div>

                        <p className="rating-text">
                            {rating} out of 5
                        </p>

                    </div>

                    <div className="comment-section">

                        <label htmlFor="comment">
                            Your Review
                        </label>

                        <textarea
                            id="comment"
                            name="comment"
                            rows="5"
                            maxLength="1000"
                            placeholder="Tell us about your experience..."
                            value={comment}
                            onChange={(event) =>
                                setComment(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        />

                        <small>
                            {comment.length}/1000
                        </small>

                    </div>

                    <button
                        type="submit"
                        className="submit-review-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Review"}
                    </button>

                    <button
                        type="button"
                        className="cancel-review-button"
                        onClick={() =>
                            navigate("/my-bookings")
                        }
                        disabled={loading}
                    >
                        Back to My Bookings
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Review;