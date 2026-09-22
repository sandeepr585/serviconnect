import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

function AdminDashboard() {
    const { token } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [providers, setProviders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showProviderForm, setShowProviderForm] =
        useState(false);

    const [providerForm, setProviderForm] = useState({
        name: "",
        email: "",
        phone: "",
        experience: "",
        location: "",
        serviceCategory: "",
    });

    const [savingProvider, setSavingProvider] =
        useState(false);

    /*
     * LOAD BOOKINGS + PROVIDERS
     */
    useEffect(() => {
        async function loadData() {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const [bookingsResponse, providersResponse] =
                    await Promise.all([
                        fetch(
                            "https://serviconnect-backend-f1um.onrender.com/api/bookings",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        ),

                        fetch(
                            "https://serviconnect-backend-f1um.onrender.com/api/providers",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        ),
                    ]);

                const bookingsText =
                    await bookingsResponse.text();

                const providersText =
                    await providersResponse.text();

                let bookingsData;
                let providersData;

                try {
                    bookingsData =
                        JSON.parse(bookingsText);
                } catch {
                    bookingsData = [];
                }

                try {
                    providersData =
                        JSON.parse(providersText);
                } catch {
                    providersData = [];
                }

                if (!bookingsResponse.ok) {
                    throw new Error(
                        typeof bookingsData === "string"
                            ? bookingsData
                            : "Unable to load bookings."
                    );
                }

                if (!providersResponse.ok) {
                    throw new Error(
                        typeof providersData === "string"
                            ? providersData
                            : "Unable to load providers."
                    );
                }

                setBookings(
                    Array.isArray(bookingsData)
                        ? bookingsData
                        : []
                );

                setProviders(
                    Array.isArray(providersData)
                        ? providersData
                        : []
                );
            } catch (err) {
                console.error(
                    "Admin dashboard error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load admin dashboard."
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [token]);


    /*
     * PROVIDER FORM CHANGE
     */
    function handleProviderChange(event) {
        const { name, value } = event.target;

        setProviderForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }


    /*
     * ADD PROVIDER
     */
    async function handleAddProvider(event) {
        event.preventDefault();

        setError("");

        if (!providerForm.name.trim()) {
            setError("Provider name is required.");
            return;
        }

        if (!providerForm.email.trim()) {
            setError("Provider email is required.");
            return;
        }

        if (!providerForm.phone.trim()) {
            setError("Provider phone is required.");
            return;
        }

        if (!providerForm.serviceCategory) {
            setError(
                "Please select a service category."
            );
            return;
        }

        setSavingProvider(true);

        try {
            const response = await fetch(
                "https://serviconnect-backend-f1um.onrender.com/api/providers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: providerForm.name.trim(),
                        email: providerForm.email.trim(),
                        phone: providerForm.phone.trim(),
                        experience:
                            providerForm.experience.trim(),
                        location:
                            providerForm.location.trim(),
                        serviceCategory:
                            providerForm.serviceCategory,
                        rating: 0,
                        status: "AVAILABLE",
                    }),
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
                          "Unable to add provider."
                );
            }

            setProviders((previous) => [
                ...previous,
                data,
            ]);

            setProviderForm({
                name: "",
                email: "",
                phone: "",
                experience: "",
                location: "",
                serviceCategory: "",
            });

            setShowProviderForm(false);
        } catch (err) {
            console.error(
                "Add provider error:",
                err
            );

            setError(
                err.message ||
                "Unable to add provider."
            );
        } finally {
            setSavingProvider(false);
        }
    }


    /*
     * ASSIGN PROVIDER
     */
    async function assignProvider(
        bookingId,
        providerId
    ) {
        if (!providerId) {
            setError(
                "Please select a provider."
            );
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `https://serviconnect-backend-f1um.onrender.com/api/bookings/${bookingId}/assign/${providerId}`,
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
                          "Unable to assign provider."
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
            console.error(
                "Assign provider error:",
                err
            );

            setError(
                err.message ||
                "Unable to assign provider."
            );
        }
    }


    /*
     * GET SERVICE CATEGORY
     *
     * We first try serviceCategory/category
     * because different backend versions
     * may use either property.
     */
    function getBookingCategory(booking) {
        return (
            booking?.serviceCategory ||
            booking?.category ||
            getCategoryFromServiceTitle(
                booking?.serviceTitle
            )
        );
    }


    /*
     * FALLBACK CATEGORY MATCHING
     *
     * This makes the filtering work even if
     * the Booking entity currently does not
     * contain serviceCategory.
     */
    function getCategoryFromServiceTitle(
        serviceTitle
    ) {
        const title = String(
            serviceTitle || ""
        ).toLowerCase();

        if (
            title.includes("salon") ||
            title.includes("spa") ||
            title.includes("makeup")
        ) {
            return "Beauty & Wellness";
        }

        if (
            title.includes("cleaning") ||
            title.includes("sofa") ||
            title.includes("bathroom")
        ) {
            return "Cleaning";
        }

        if (
            title.includes("ac") ||
            title.includes("electrician") ||
            title.includes("plumbing") ||
            title.includes("appliance") ||
            title.includes("painting")
        ) {
            return "Home Repair";
        }

        return "";
    }


    /*
     * NORMALIZE CATEGORY
     */
    function normalizeCategory(category) {
        return String(
            category || ""
        )
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }


    /*
     * GET MATCHING PROVIDERS
     */
    function getMatchingProviders(booking) {
        const bookingCategory =
            normalizeCategory(
                getBookingCategory(booking)
            );

        if (!bookingCategory) {
            return providers;
        }

        return providers.filter(
            (provider) => {
                const providerCategory =
                    normalizeCategory(
                        provider.serviceCategory
                    );

                return (
                    providerCategory ===
                    bookingCategory
                );
            }
        );
    }


    /*
     * STATISTICS
     */
    const totalBookings =
        bookings.length;

    const confirmedBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "CONFIRMED"
        ).length;

    const assignedBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "ASSIGNED"
        ).length;

    const completedBookings =
        bookings.filter(
            (booking) =>
                booking.status ===
                "COMPLETED"
        ).length;


    if (loading) {
        return (
            <div className="admin-dashboard-page">
                <div className="admin-loading">
                    Loading Admin Dashboard...
                </div>
            </div>
        );
    }


    return (
        <div className="admin-dashboard-page">

            <div className="admin-dashboard-container">

                {/* HEADER */}

                <div className="admin-header">

                    <div>
                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Manage bookings and
                            service providers
                        </p>
                    </div>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="admin-error">
                        ❌ {error}

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>
                    </div>
                )}


                {/* STATISTICS */}

                <div className="admin-stats">

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            📋
                        </div>

                        <div>
                            <span>
                                Total Bookings
                            </span>

                            <strong>
                                {totalBookings}
                            </strong>
                        </div>
                    </div>


                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            🕐
                        </div>

                        <div>
                            <span>
                                Confirmed
                            </span>

                            <strong>
                                {confirmedBookings}
                            </strong>
                        </div>
                    </div>


                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            👷
                        </div>

                        <div>
                            <span>
                                Assigned
                            </span>

                            <strong>
                                {assignedBookings}
                            </strong>
                        </div>
                    </div>


                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
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


                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            👥
                        </div>

                        <div>
                            <span>
                                Providers
                            </span>

                            <strong>
                                {providers.length}
                            </strong>
                        </div>
                    </div>

                </div>


                {/* PROVIDER MANAGEMENT */}

                <div className="admin-section">

                    <div className="admin-section-header">

                        <div>
                            <h2>
                                Provider Management
                            </h2>

                            <p>
                                View and add service
                                providers
                            </p>
                        </div>

                        <button
                            className="add-provider-button"
                            onClick={() =>
                                setShowProviderForm(
                                    (previous) =>
                                        !previous
                                )
                            }
                        >
                            {showProviderForm
                                ? "✕ Close"
                                : "＋ Add Provider"}
                        </button>

                    </div>


                    {/* ADD PROVIDER FORM */}

                    {showProviderForm && (

                        <form
                            className="provider-form"
                            onSubmit={
                                handleAddProvider
                            }
                        >

                            <h3>
                                Add New Provider
                            </h3>


                            <div className="provider-form-grid">

                                <div className="form-field">

                                    <label>
                                        Name *
                                    </label>

                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Provider name"
                                        value={
                                            providerForm.name
                                        }
                                        onChange={
                                            handleProviderChange
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Email *
                                    </label>

                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="provider@email.com"
                                        value={
                                            providerForm.email
                                        }
                                        onChange={
                                            handleProviderChange
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Phone *
                                    </label>

                                    <input
                                        name="phone"
                                        type="text"
                                        placeholder="Phone number"
                                        value={
                                            providerForm.phone
                                        }
                                        onChange={
                                            handleProviderChange
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Experience
                                    </label>

                                    <input
                                        name="experience"
                                        type="text"
                                        placeholder="e.g. 5 years"
                                        value={
                                            providerForm.experience
                                        }
                                        onChange={
                                            handleProviderChange
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Location
                                    </label>

                                    <input
                                        name="location"
                                        type="text"
                                        placeholder="Provider location"
                                        value={
                                            providerForm.location
                                        }
                                        onChange={
                                            handleProviderChange
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Service Category *
                                    </label>

                                    <select
                                        name="serviceCategory"
                                        value={
                                            providerForm.serviceCategory
                                        }
                                        onChange={
                                            handleProviderChange
                                        }
                                    >
                                        <option value="">
                                            Select category
                                        </option>

                                        <option value="Home Repair">
                                            Home Repair
                                        </option>

                                        <option value="Cleaning">
                                            Cleaning
                                        </option>

                                        <option value="Beauty & Wellness">
                                            Beauty & Wellness
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="save-provider-button"
                                disabled={
                                    savingProvider
                                }
                            >
                                {savingProvider
                                    ? "Adding Provider..."
                                    : "Add Provider"}
                            </button>

                        </form>
                    )}


                    {/* PROVIDER TABLE */}

                    <div className="provider-table-wrapper">

                        {providers.length === 0 ? (

                            <div className="empty-state">
                                No providers found.
                            </div>

                        ) : (

                            <table className="provider-table">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Experience</th>
                                        <th>Location</th>
                                        <th>Rating</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {providers.map(
                                        (provider) => (

                                            <tr
                                                key={
                                                    provider.id
                                                }
                                            >

                                                <td>
                                                    #
                                                    {
                                                        provider.id
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            provider.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        provider.serviceCategory
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        provider.email
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        provider.phone
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        provider.experience
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        provider.location
                                                    }
                                                </td>

                                                <td>
                                                    ⭐{" "}
                                                    {
                                                        provider.rating ??
                                                        0
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            provider.status ===
                                                            "AVAILABLE"
                                                                ? "provider-status available"
                                                                : "provider-status"
                                                        }
                                                    >
                                                        {
                                                            provider.status ||
                                                            "AVAILABLE"
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>
                        )}

                    </div>

                </div>


                {/* BOOKING MANAGEMENT */}

                <div className="admin-section">

                    <div className="admin-section-header">

                        <div>
                            <h2>
                                Booking Management
                            </h2>

                            <p>
                                Assign providers based
                                on service category
                            </p>
                        </div>

                    </div>


                    {bookings.length === 0 ? (

                        <div className="empty-state">
                            No bookings found.
                        </div>

                    ) : (

                        <div className="admin-bookings-list">

                            {bookings.map(
                                (booking) => {

                                    const matchingProviders =
                                        getMatchingProviders(
                                            booking
                                        );

                                    const bookingCategory =
                                        getBookingCategory(
                                            booking
                                        );

                                    return (

                                        <div
                                            className="admin-booking-card"
                                            key={
                                                booking.id
                                            }
                                        >

                                            <div className="booking-main">

                                                <div>

                                                    <span className="booking-number">
                                                        Booking #
                                                        {
                                                            booking.id
                                                        }
                                                    </span>

                                                    <h3>
                                                        {
                                                            booking.serviceTitle
                                                        }
                                                    </h3>

                                                    <p>
                                                        Customer:{" "}
                                                        {
                                                            booking.userEmail
                                                        }
                                                    </p>

                                                </div>


                                                <div className="booking-price">
                                                    ₹
                                                    {
                                                        booking.price
                                                    }
                                                </div>

                                            </div>


                                            {/* CATEGORY */}

                                            <div className="booking-category-box">

                                                <span>
                                                    Service Category
                                                </span>

                                                <strong>
                                                    {bookingCategory ||
                                                        "Category not available"}
                                                </strong>

                                            </div>


                                            {/* BOOKING INFO */}

                                            <div className="booking-info">

                                                <span>
                                                    📅{" "}
                                                    {
                                                        booking.bookingDate
                                                    }
                                                </span>

                                                <span>
                                                    🕐{" "}
                                                    {
                                                        booking.bookingTime
                                                    }
                                                </span>

                                                <span>
                                                    📍{" "}
                                                    {
                                                        booking.address
                                                    }
                                                </span>

                                                <span
                                                    className={`admin-booking-status ${String(
                                                        booking.status ||
                                                            ""
                                                    ).toLowerCase()}`}
                                                >
                                                    {
                                                        booking.status
                                                    }
                                                </span>

                                            </div>


                                            {/* ASSIGNMENT */}

                                            <div className="assignment-row">

                                                <div className="assignment-label">

                                                    <label>
                                                        Assign Provider
                                                    </label>

                                                    <small>
                                                        {
                                                            matchingProviders.length
                                                        }{" "}
                                                        matching provider
                                                        {matchingProviders.length !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </small>

                                                </div>


                                                <select
                                                    defaultValue={
                                                        booking.providerId
                                                            ? String(
                                                                  booking.providerId
                                                              )
                                                            : ""
                                                    }
                                                    disabled={
                                                        booking.status ===
                                                            "COMPLETED" ||
                                                        booking.status ===
                                                            "CANCELLED"
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        assignProvider(
                                                            booking.id,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                >

                                                    <option value="">
                                                        {matchingProviders.length ===
                                                        0
                                                            ? "No matching providers"
                                                            : "Select provider"}
                                                    </option>


                                                    {matchingProviders.map(
                                                        (
                                                            provider
                                                        ) => (

                                                            <option
                                                                key={
                                                                    provider.id
                                                                }
                                                                value={
                                                                    provider.id
                                                                }
                                                            >
                                                                {
                                                                    provider.name
                                                                }
                                                                {" - "}
                                                                {
                                                                    provider.serviceCategory
                                                                }
                                                                {" - "}
                                                                ⭐
                                                                {
                                                                    provider.rating ??
                                                                    0
                                                                }
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>


                                            {/* NO MATCH */}

                                            {matchingProviders.length ===
                                                0 &&
                                                booking.status !==
                                                    "COMPLETED" &&
                                                booking.status !==
                                                    "CANCELLED" && (

                                                    <div className="no-matching-provider">

                                                        ⚠️ No provider is
                                                        currently available
                                                        for the{" "}
                                                        <strong>
                                                            {
                                                                bookingCategory ||
                                                                "required"
                                                            }
                                                        </strong>{" "}
                                                        category.

                                                    </div>

                                                )}

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

            </div>


            <style>{`

                .admin-dashboard-page {
                    min-height: 100vh;
                    background: #f5f7fb;
                    padding: 40px 20px 70px;
                }

                .admin-dashboard-container {
                    max-width: 1250px;
                    margin: 0 auto;
                }

                .admin-header {
                    margin-bottom: 25px;
                }

                .admin-header h1 {
                    margin: 0 0 7px;
                    font-size: 34px;
                    color: #172033;
                }

                .admin-header p {
                    margin: 0;
                    color: #737b8c;
                }

                .admin-error {
                    background: #fff0f0;
                    border: 1px solid #ffcaca;
                    color: #c62828;
                    padding: 13px 16px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .admin-error button {
                    border: none;
                    background: transparent;
                    color: #c62828;
                    font-size: 20px;
                    cursor: pointer;
                }

                .admin-stats {
                    display: grid;
                    grid-template-columns:
                        repeat(5, 1fr);
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .admin-stat-card {
                    background: white;
                    border-radius: 14px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    box-shadow:
                        0 4px 15px
                        rgba(0,0,0,0.06);
                }

                .admin-stat-icon {
                    font-size: 28px;
                }

                .admin-stat-card span {
                    display: block;
                    color: #777;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .admin-stat-card strong {
                    font-size: 25px;
                    color: #172033;
                }

                .admin-section {
                    background: white;
                    border-radius: 18px;
                    padding: 25px;
                    margin-bottom: 25px;
                    box-shadow:
                        0 5px 20px
                        rgba(0,0,0,0.06);
                }

                .admin-section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 22px;
                }

                .admin-section-header h2 {
                    margin: 0 0 5px;
                    color: #172033;
                }

                .admin-section-header p {
                    margin: 0;
                    color: #7b8190;
                    font-size: 14px;
                }

                .add-provider-button {
                    border: none;
                    background: #6c4cff;
                    color: white;
                    padding: 11px 18px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .add-provider-button:hover {
                    background: #5639dc;
                }

                .provider-form {
                    background: #f8f9fc;
                    border: 1px solid #e8ebf2;
                    border-radius: 13px;
                    padding: 20px;
                    margin-bottom: 25px;
                }

                .provider-form h3 {
                    margin-top: 0;
                    color: #172033;
                }

                .provider-form-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(3, 1fr);
                    gap: 15px;
                }

                .form-field label {
                    display: block;
                    font-weight: 600;
                    font-size: 13px;
                    margin-bottom: 7px;
                    color: #404758;
                }

                .form-field input,
                .form-field select {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 11px 12px;
                    border: 1px solid #dfe3eb;
                    border-radius: 8px;
                    background: white;
                    font-size: 14px;
                    outline: none;
                }

                .form-field input:focus,
                .form-field select:focus {
                    border-color: #6c4cff;
                }

                .save-provider-button {
                    margin-top: 18px;
                    border: none;
                    background: #168044;
                    color: white;
                    padding: 11px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 700;
                }

                .save-provider-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .provider-table-wrapper {
                    overflow-x: auto;
                }

                .provider-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 950px;
                }

                .provider-table th {
                    text-align: left;
                    padding: 13px 10px;
                    background: #f7f8fb;
                    color: #6f7583;
                    font-size: 12px;
                    white-space: nowrap;
                }

                .provider-table td {
                    padding: 15px 10px;
                    border-bottom: 1px solid #edf0f5;
                    color: #555;
                    font-size: 13px;
                }

                .provider-table td strong {
                    color: #172033;
                }

                .provider-status {
                    display: inline-block;
                    padding: 6px 10px;
                    border-radius: 15px;
                    background: #eeeeee;
                    font-size: 11px;
                    font-weight: 700;
                }

                .provider-status.available {
                    background: #e2f8eb;
                    color: #168044;
                }

                .empty-state {
                    text-align: center;
                    padding: 40px;
                    color: #777;
                }

                .admin-bookings-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .admin-booking-card {
                    border: 1px solid #edf0f5;
                    border-radius: 13px;
                    padding: 20px;
                }

                .booking-main {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                }

                .booking-number {
                    color: #8a91a0;
                    font-size: 12px;
                }

                .booking-main h3 {
                    margin: 5px 0;
                    color: #172033;
                }

                .booking-main p {
                    margin: 0;
                    color: #777;
                    font-size: 13px;
                }

                .booking-price {
                    font-size: 20px;
                    font-weight: 700;
                    color: #172033;
                }

                .booking-category-box {
                    display: inline-flex;
                    flex-direction: column;
                    gap: 3px;
                    background: #f4f1ff;
                    border: 1px solid #e5defd;
                    padding: 10px 14px;
                    border-radius: 9px;
                    margin-top: 15px;
                }

                .booking-category-box span {
                    color: #7a718f;
                    font-size: 10px;
                    text-transform: uppercase;
                    font-weight: 700;
                }

                .booking-category-box strong {
                    color: #5c42ad;
                    font-size: 13px;
                }

                .booking-info {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 18px;
                    margin: 18px 0;
                    padding: 15px 0;
                    border-top: 1px solid #edf0f5;
                    border-bottom: 1px solid #edf0f5;
                    color: #666;
                    font-size: 13px;
                }

                .admin-booking-status {
                    padding: 6px 10px;
                    border-radius: 15px;
                    background: #eeeeee;
                    font-weight: 700;
                    font-size: 11px;
                }

                .admin-booking-status.confirmed {
                    background: #fff3d6;
                    color: #996500;
                }

                .admin-booking-status.assigned {
                    background: #e9e5ff;
                    color: #5c42ad;
                }

                .admin-booking-status.accepted {
                    background: #e0f4ff;
                    color: #08749c;
                }

                .admin-booking-status.in_progress {
                    background: #e0f4ff;
                    color: #08749c;
                }

                .admin-booking-status.completed {
                    background: #e2f8eb;
                    color: #168044;
                }

                .admin-booking-status.cancelled {
                    background: #fff0f0;
                    color: #c62828;
                }

                .assignment-row {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .assignment-label {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    min-width: 150px;
                }

                .assignment-label label {
                    font-weight: 700;
                    color: #404758;
                    font-size: 13px;
                }

                .assignment-label small {
                    color: #8a91a0;
                    font-size: 11px;
                }

                .assignment-row select {
                    min-width: 330px;
                    padding: 10px;
                    border: 1px solid #dfe3eb;
                    border-radius: 8px;
                    background: white;
                }

                .assignment-row select:disabled {
                    background: #f3f3f3;
                    cursor: not-allowed;
                }

                .no-matching-provider {
                    margin-top: 14px;
                    padding: 12px 15px;
                    background: #fff8e6;
                    border: 1px solid #f5df9d;
                    border-radius: 9px;
                    color: #8a6700;
                    font-size: 13px;
                }

                .admin-loading {
                    min-height: 500px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    color: #555;
                }

                @media (max-width: 1000px) {

                    .admin-stats {
                        grid-template-columns:
                            repeat(3, 1fr);
                    }

                    .provider-form-grid {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                }

                @media (max-width: 650px) {

                    .admin-dashboard-page {
                        padding: 25px 12px 50px;
                    }

                    .admin-stats {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .provider-form-grid {
                        grid-template-columns: 1fr;
                    }

                    .admin-section-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .booking-main {
                        flex-direction: column;
                    }

                    .assignment-row {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .assignment-row select {
                        min-width: 0;
                        width: 100%;
                    }

                }

                @media (max-width: 400px) {

                    .admin-stats {
                        grid-template-columns: 1fr;
                    }

                }

            `}</style>

        </div>
    );
}

export default AdminDashboard;
