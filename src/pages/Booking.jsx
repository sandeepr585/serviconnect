import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

function Booking() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const serviceId = searchParams.get("serviceId");

    const { token, isLoggedIn } = useAuth();

    const {
        cartItems,
        cartTotal,
        clearCart
    } = useCart();


    /*
     * ---------------------------------------------------------
     * BOOKING STATE
     * ---------------------------------------------------------
     */

    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");

    /*
     * Read saved address during initial state creation.
     * This avoids calling setAddress() synchronously inside
     * useEffect and fixes the React lint warning.
     */
    const [address, setAddress] = useState(() => {
        const savedLocation =
            localStorage.getItem("bookingLocation");

        if (!savedLocation) {
            return "";
        }

        try {
            const locationData =
                JSON.parse(savedLocation);

            return locationData.address || "";

        } catch (error) {
            console.error(
                "Unable to read saved location",
                error
            );

            return "";
        }
    });


    /*
     * ---------------------------------------------------------
     * PAYMENT STATE
     * ---------------------------------------------------------
     */

    const [paymentMethod, setPaymentMethod] =
        useState("CASH");

    /*
     * Dummy payment screen
     */
    const [showPayment, setShowPayment] =
        useState(false);

    const [paymentType, setPaymentType] =
        useState("UPI");

    const [paymentProcessing, setPaymentProcessing] =
        useState(false);

    const [paymentSuccess, setPaymentSuccess] =
        useState(false);


    /*
     * Dummy UPI details
     */
    const [upiId, setUpiId] =
        useState("demo@upi");


    /*
     * Dummy card details
     */
    const [cardNumber, setCardNumber] =
        useState("4111 1111 1111 1111");

    const [cardName, setCardName] =
        useState("Demo User");

    const [cardExpiry, setCardExpiry] =
        useState("12/30");

    const [cardCvv, setCardCvv] =
        useState("123");


    /*
     * ---------------------------------------------------------
     * ERROR / SUCCESS
     * ---------------------------------------------------------
     */

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /*
     * ---------------------------------------------------------
     * LOGIN CHECK
     * ---------------------------------------------------------
     */

    useEffect(() => {

        if (!isLoggedIn) {
            navigate("/login");
        }

    }, [isLoggedIn, navigate]);


    /*
     * ---------------------------------------------------------
     * LOAD SERVICES
     *
     * CART:
     *     Uses services already in cart.
     *
     * BOOK NOW:
     *     Loads service using serviceId.
     * ---------------------------------------------------------
     */

    useEffect(() => {

        async function loadBookingServices() {

            setLoading(true);
            setError("");

            try {

                /*
                 * CART BOOKING
                 */

                if (
                    cartItems.length > 0 &&
                    !serviceId
                ) {

                    setServices(cartItems);

                    setLoading(false);

                    return;
                }


                /*
                 * DIRECT BOOK NOW
                 */

                if (serviceId) {

                    const response =
                        await fetch(
                            `https://serviconnect-backend-f1um.onrender.com/api/services/${serviceId}`
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Unable to load service"
                        );

                    }


                    const data =
                        await response.json();


                    setServices([
                        {
                            ...data,

                            id:
                                data.id ||
                                data.serviceId,

                            quantity: 1
                        }
                    ]);


                    setLoading(false);

                    return;
                }


                /*
                 * NOTHING SELECTED
                 */

                setServices([]);

                setLoading(false);

            } catch (error) {

                console.error(
                    "Service loading error:",
                    error
                );

                setError(
                    "Unable to load service details."
                );

                setLoading(false);
            }
        }


        loadBookingServices();

    }, [cartItems, serviceId]);


    /*
     * ---------------------------------------------------------
     * TOTAL AMOUNT
     * ---------------------------------------------------------
     */

    const bookingTotal =
        services.length > 0
            ? services.reduce(
                  (total, item) =>
                      total +
                      Number(item.price || 0) *
                          Number(item.quantity || 1),
                  0
              )
            : Number(cartTotal || 0);


    /*
     * ---------------------------------------------------------
     * VALIDATE BOOKING
     * ---------------------------------------------------------
     */

    function validateBooking() {

        setError("");

        /*
         * DATE
         */

        if (!bookingDate) {

            setError(
                "Please select a booking date."
            );

            return false;
        }


        /*
         * TIME
         */

        if (!bookingTime) {

            setError(
                "Please select a booking time."
            );

            return false;
        }


        /*
         * ADDRESS
         */

        if (!address.trim()) {

            setError(
                "Please enter your service address."
            );

            return false;
        }


        /*
         * SERVICE
         */

        if (services.length === 0) {

            setError(
                "Please add a service before booking."
            );

            return false;
        }


        /*
         * TOKEN
         */

        if (!token) {

            setError(
                "Please login before booking."
            );

            navigate("/login");

            return false;
        }


        return true;
    }


    /*
     * ---------------------------------------------------------
     * CREATE BOOKING
     * ---------------------------------------------------------
     */

    async function createBookings() {

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {

            /*
             * Create one booking for every selected service.
             */

            for (const item of services) {

                const selectedServiceId =
                    item.serviceId ||
                    item.id;


                if (!selectedServiceId) {

                    throw new Error(
                        `Service ID missing for ${item.title}`
                    );

                }


                const response =
                    await fetch(
                        "https://serviconnect-backend-f1um.onrender.com/api/bookings",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                serviceId:
                                    Number(
                                        selectedServiceId
                                    ),

                                bookingDate:
                                    bookingDate,

                                bookingTime:
                                    bookingTime,

                                address:
                                    address.trim()

                            })
                        }
                    );


                const responseText =
                    await response.text();


                let data;

                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch {

                    data =
                        responseText;

                }


                if (!response.ok) {

                    throw new Error(
                        typeof data === "string"
                            ? data
                            : data.message ||
                              "Booking failed"
                    );

                }
            }


            /*
             * BOOKING SUCCESS
             */

            setSuccess(
                "Booking confirmed successfully!"
            );


            /*
             * Clear cart only for cart booking.
             *
             * If user clicked Book Now directly,
             * don't remove unrelated cart items.
             */

            if (!serviceId) {
                clearCart();
            }


            /*
             * Remove saved location
             */

            localStorage.removeItem(
                "bookingLocation"
            );


            /*
             * Go to My Bookings
             */

            setTimeout(() => {

                navigate("/my-bookings");

            }, 1500);


        } catch (error) {

            console.error(
                "Booking error:",
                error
            );

            setError(
                error.message ||
                "Unable to create booking."
            );

        } finally {

            setSubmitting(false);

        }
    }


    /*
     * ---------------------------------------------------------
     * CASH BOOKING
     * ---------------------------------------------------------
     */

    async function handleCashBooking() {

        if (!validateBooking()) {
            return;
        }

        await createBookings();
    }


    /*
     * ---------------------------------------------------------
     * ONLINE PAYMENT
     * ---------------------------------------------------------
     */

    function handleOnlinePayment() {

        if (!validateBooking()) {
            return;
        }


        setError("");

        setPaymentSuccess(false);

        setPaymentProcessing(false);

        setShowPayment(true);
    }


    /*
     * ---------------------------------------------------------
     * DUMMY PAYMENT VALIDATION
     * ---------------------------------------------------------
     */

    function validateDummyPayment() {

        setError("");


        /*
         * UPI VALIDATION
         */

        if (paymentType === "UPI") {

            if (!upiId.trim()) {

                setError(
                    "Please enter a UPI ID."
                );

                return false;
            }


            if (
                !upiId.includes("@") ||
                upiId.startsWith("@") ||
                upiId.endsWith("@")
            ) {

                setError(
                    "Please enter a valid demo UPI ID."
                );

                return false;
            }
        }


        /*
         * CARD VALIDATION
         */

        if (paymentType === "CARD") {

            const cleanCardNumber =
                cardNumber.replace(
                    /\s/g,
                    ""
                );


            if (!cardName.trim()) {

                setError(
                    "Please enter card holder name."
                );

                return false;
            }


            if (
                cleanCardNumber.length !== 16
            ) {

                setError(
                    "Please enter a 16-digit demo card number."
                );

                return false;
            }


            if (
                !/^\d{2}\/\d{2}$/.test(
                    cardExpiry
                )
            ) {

                setError(
                    "Please enter expiry in MM/YY format."
                );

                return false;
            }


            if (
                !/^\d{3}$/.test(
                    cardCvv
                )
            ) {

                setError(
                    "Please enter a 3-digit CVV."
                );

                return false;
            }
        }


        return true;
    }


    /*
     * ---------------------------------------------------------
     * PROCESS DUMMY PAYMENT
     * ---------------------------------------------------------
     */

    function handleDummyPayment() {

        if (!validateDummyPayment()) {
            return;
        }


        setPaymentProcessing(true);
        setPaymentSuccess(false);
        setError("");


        /*
         * Simulate payment processing.
         *
         * No real payment gateway is used.
         */

        setTimeout(() => {

            setPaymentProcessing(false);

            setPaymentSuccess(true);


            /*
             * Wait a little so the user can see
             * Payment Successful.
             */

            setTimeout(() => {

                setShowPayment(false);

                createBookings();

            }, 1000);

        }, 2000);
    }


    /*
     * ---------------------------------------------------------
     * TODAY'S DATE
     * ---------------------------------------------------------
     */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    /*
     * ---------------------------------------------------------
     * LOADING SCREEN
     * ---------------------------------------------------------
     */

    if (loading) {

        return (

            <div className="booking-page">

                <div className="booking-message">

                    Loading booking details...

                </div>

            </div>
        );
    }


    /*
     * ---------------------------------------------------------
     * DUMMY PAYMENT SCREEN
     * ---------------------------------------------------------
     */

    if (showPayment) {

        return (

            <div className="booking-page">

                <div
                    className="booking-container"
                    style={{
                        maxWidth: "650px"
                    }}
                >

                    {/* PAYMENT HEADER */}

                    <div className="booking-header">

                        <span className="booking-label">
                            SERVICONNECT
                        </span>

                        <h1>
                            Dummy Payment
                        </h1>

                        <p>
                            Demo payment for your
                            project. No real money
                            will be charged.
                        </p>

                    </div>


                    {/* AMOUNT */}

                    <div className="booking-section">

                        <div
                            style={{
                                textAlign: "center",
                                padding: "20px"
                            }}
                        >

                            <span>
                                Amount to Pay
                            </span>

                            <h1
                                style={{
                                    margin:
                                        "10px 0"
                                }}
                            >
                                ₹{bookingTotal}
                            </h1>

                            <small>
                                Demo transaction only
                            </small>

                        </div>

                    </div>


                    {/* PAYMENT SUCCESS */}

                    {paymentSuccess ? (

                        <div
                            className="booking-success"
                            style={{
                                textAlign: "center",
                                padding: "40px 20px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "60px",
                                    marginBottom: "15px"
                                }}
                            >
                                ✅
                            </div>

                            <h2>
                                Payment Successful!
                            </h2>

                            <p>
                                Dummy payment of ₹
                                {bookingTotal}
                                {" "}was successful.
                            </p>

                            <p>
                                Creating your booking...
                            </p>

                        </div>

                    ) : (

                        <div className="booking-section">

                            {/* PAYMENT TYPE */}

                            <h2>
                                Choose Payment
                            </h2>


                            <div
                                className="payment-options"
                            >

                                <label
                                    className="payment-option"
                                >

                                    <input
                                        type="radio"
                                        name="dummyPayment"
                                        value="UPI"
                                        checked={
                                            paymentType ===
                                            "UPI"
                                        }
                                        onChange={(event) =>
                                            setPaymentType(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <span>
                                        📱 UPI
                                    </span>

                                </label>


                                <label
                                    className="payment-option"
                                >

                                    <input
                                        type="radio"
                                        name="dummyPayment"
                                        value="CARD"
                                        checked={
                                            paymentType ===
                                            "CARD"
                                        }
                                        onChange={(event) =>
                                            setPaymentType(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <span>
                                        💳 Card
                                    </span>

                                </label>

                            </div>


                            {/* UPI */}

                            {paymentType === "UPI" && (

                                <div
                                    className="booking-field"
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >

                                    <label>
                                        Demo UPI ID
                                    </label>

                                    <input
                                        type="text"
                                        value={upiId}
                                        placeholder="demo@upi"
                                        onChange={(event) =>
                                            setUpiId(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <small>
                                        Example:
                                        {" "}
                                        demo@upi
                                    </small>

                                </div>

                            )}


                            {/* CARD */}

                            {paymentType === "CARD" && (

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "15px",
                                        marginTop: "20px"
                                    }}
                                >

                                    <div
                                        className="booking-field"
                                    >

                                        <label>
                                            Card Number
                                        </label>

                                        <input
                                            type="text"
                                            value={cardNumber}
                                            placeholder="4111 1111 1111 1111"
                                            maxLength="19"
                                            onChange={(event) => {

                                                const value =
                                                    event.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                        .slice(
                                                            0,
                                                            16
                                                        );

                                                const formatted =
                                                    value.replace(
                                                        /(.{4})/g,
                                                        "$1 "
                                                    ).trim();

                                                setCardNumber(
                                                    formatted
                                                );

                                            }}
                                        />

                                    </div>


                                    <div
                                        className="booking-field"
                                    >

                                        <label>
                                            Card Holder Name
                                        </label>

                                        <input
                                            type="text"
                                            value={cardName}
                                            placeholder="Demo User"
                                            onChange={(event) =>
                                                setCardName(
                                                    event.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    <div
                                        className="booking-fields"
                                    >

                                        <div
                                            className="booking-field"
                                        >

                                            <label>
                                                Expiry
                                            </label>

                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                placeholder="12/30"
                                                maxLength="5"
                                                onChange={(event) => {

                                                    let value =
                                                        event.target.value
                                                            .replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                            .slice(
                                                                0,
                                                                4
                                                            );

                                                    if (
                                                        value.length >
                                                        2
                                                    ) {

                                                        value =
                                                            value.slice(
                                                                0,
                                                                2
                                                            ) +
                                                            "/" +
                                                            value.slice(
                                                                2
                                                            );

                                                    }

                                                    setCardExpiry(
                                                        value
                                                    );

                                                }}
                                            />

                                        </div>


                                        <div
                                            className="booking-field"
                                        >

                                            <label>
                                                CVV
                                            </label>

                                            <input
                                                type="password"
                                                value={cardCvv}
                                                placeholder="123"
                                                maxLength="3"
                                                onChange={(event) =>
                                                    setCardCvv(
                                                        event.target.value
                                                            .replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                            .slice(
                                                                0,
                                                                3
                                                            )
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* ERROR */}

                            {error && (

                                <div
                                    className="booking-form-error"
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >
                                    {error}
                                </div>

                            )}


                            {/* PAYMENT BUTTONS */}

                            <div
                                className="booking-actions"
                                style={{
                                    marginTop: "25px"
                                }}
                            >

                                <button
                                    type="button"
                                    className="booking-back-button"
                                    disabled={
                                        paymentProcessing
                                    }
                                    onClick={() => {

                                        setShowPayment(
                                            false
                                        );

                                        setError("");

                                    }}
                                >
                                    ← Back
                                </button>


                                <button
                                    type="button"
                                    className="booking-submit-button"
                                    disabled={
                                        paymentProcessing
                                    }
                                    onClick={
                                        handleDummyPayment
                                    }
                                >

                                    {paymentProcessing
                                        ? "Processing..."
                                        : `Pay ₹${bookingTotal}`}

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>
        );
    }


    /*
     * ---------------------------------------------------------
     * EMPTY SERVICE
     * ---------------------------------------------------------
     */

    if (
        !loading &&
        services.length === 0
    ) {

        return (

            <div className="booking-page">

                <div className="booking-message">

                    <h2>
                        No service selected
                    </h2>

                    <p>
                        Please add a service before
                        continuing.
                    </p>

                    {error && (

                        <div
                            className="booking-form-error"
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            {error}
                        </div>

                    )}

                    <button
                        className="booking-submit-button"
                        onClick={() =>
                            navigate("/services")
                        }
                    >
                        Browse Services
                    </button>

                </div>

            </div>
        );
    }


    /*
     * ---------------------------------------------------------
     * MAIN BOOKING PAGE
     * ---------------------------------------------------------
     */

    return (

        <div className="booking-page">

            <div className="booking-container">


                {/* HEADER */}

                <div className="booking-header">

                    <span className="booking-label">
                        SERVICONNECT BOOKING
                    </span>

                    <h1>
                        Complete Your Booking
                    </h1>

                    <p>
                        Schedule your service at
                        a time that works for you.
                    </p>

                </div>


                {/* SELECTED SERVICES */}

                <div className="booking-section">

                    <h2>
                        Selected Services
                    </h2>


                    {services.map(
                        (item, index) => (

                            <div
                                className="booking-service-card"
                                key={
                                    item.id ||
                                    item.serviceId ||
                                    index
                                }
                            >

                                <img
                                    src={
                                        item.image ||
                                        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80"
                                    }
                                    alt={
                                        item.title ||
                                        "Service"
                                    }
                                    className="booking-service-image"
                                />


                                <div
                                    className="booking-service-info"
                                >

                                    <div
                                        className="booking-rating"
                                    >
                                        ⭐{" "}
                                        {item.rating ||
                                            "4.8"}
                                    </div>


                                    <h2>
                                        {item.title}
                                    </h2>


                                    <p>
                                        {item.description}
                                    </p>


                                    <strong>

                                        ₹
                                        {Number(
                                            item.price ||
                                            0
                                        )}

                                        {" × "}

                                        {item.quantity ||
                                            1}

                                    </strong>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {/* BOOKING FORM */}

                <form
                    className="booking-form"
                    onSubmit={(event) => {

                        event.preventDefault();

                        if (
                            paymentMethod ===
                            "ONLINE"
                        ) {

                            handleOnlinePayment();

                        } else {

                            handleCashBooking();

                        }

                    }}
                >


                    {/* DATE AND TIME */}

                    <div className="booking-section">

                        <h2>
                            Select Date & Time
                        </h2>


                        <div
                            className="booking-fields"
                        >

                            <div
                                className="booking-field"
                            >

                                <label htmlFor="bookingDate">
                                    Booking Date
                                </label>


                                <input
                                    id="bookingDate"
                                    type="date"
                                    value={bookingDate}
                                    min={today}
                                    onChange={(event) =>
                                        setBookingDate(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div
                                className="booking-field"
                            >

                                <label htmlFor="bookingTime">
                                    Booking Time
                                </label>


                                <input
                                    id="bookingTime"
                                    type="time"
                                    value={bookingTime}
                                    onChange={(event) =>
                                        setBookingTime(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* ADDRESS */}

                    <div className="booking-section">

                        <h2>
                            Service Address
                        </h2>


                        <div
                            className="booking-field"
                        >

                            <label htmlFor="address">
                                Full Address
                            </label>


                            <textarea
                                id="address"
                                rows="5"
                                placeholder="House / Flat, Street, Area, City, Pincode"
                                value={address}
                                onChange={(event) =>
                                    setAddress(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <button
                            type="button"
                            className="booking-back-button"
                            onClick={() =>
                                navigate("/location")
                            }
                        >
                            📍 Change Location
                        </button>

                    </div>


                    {/* PAYMENT METHOD */}

                    <div className="booking-section">

                        <h2>
                            Payment Method
                        </h2>


                        <div
                            className="payment-options"
                        >

                            {/* CASH */}

                            <label
                                className="payment-option"
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="CASH"
                                    checked={
                                        paymentMethod ===
                                        "CASH"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <span>
                                    💵 Cash on Service
                                </span>

                            </label>


                            {/* ONLINE */}

                            <label
                                className="payment-option"
                            >

                                <input
                                    type="radio"
                                    name="payment"
                                    value="ONLINE"
                                    checked={
                                        paymentMethod ===
                                        "ONLINE"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <span>
                                    💳 UPI / Card
                                </span>

                            </label>

                        </div>


                        {paymentMethod ===
                            "ONLINE" && (

                            <div
                                className="payment-info"
                            >

                                <strong>
                                    Dummy Online Payment
                                </strong>

                                <p>
                                    No real payment will
                                    be made. Clicking
                                    Pay & Confirm will
                                    open the demo payment
                                    screen.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            className="booking-form-error"
                        >
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div
                            className="booking-success"
                        >
                            {success}
                        </div>

                    )}


                    {/* TOTAL */}

                    <div className="booking-total">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{bookingTotal}
                        </strong>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="booking-actions">

                        <button
                            type="button"
                            className="booking-back-button"
                            onClick={() =>
                                navigate("/cart")
                            }
                        >
                            ← Back to Cart
                        </button>


                        <button
                            type="submit"
                            className="booking-submit-button"
                            disabled={submitting}
                        >

                            {submitting

                                ? "Confirming..."

                                : paymentMethod ===
                                  "ONLINE"

                                    ? "Pay & Confirm"

                                    : "Confirm Booking"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Booking;
