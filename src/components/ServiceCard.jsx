import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";


function ServiceCard({
    id,
    image,
    fallbackImage,
    title,
    description,
    price,
    rating
}) {

    const navigate = useNavigate();

    const { addToCart } = useCart();


    /*
    BOOK NOW
    */

    function handleBookNow() {

        navigate(
            `/booking?serviceId=${id}`
        );

    }


    /*
    ADD TO CART
    */

    function handleAddToCart() {

        addToCart({

            id,

            title,

            description,

            price,

            rating,

            image

        });

    }


    /*
    IMAGE ERROR
    */

    function handleImageError(event) {

        /*
        Prevent infinite onError loop
        */

        if (
            event.currentTarget.dataset.fallbackUsed ===
            "true"
        ) {

            return;

        }


        event.currentTarget.dataset.fallbackUsed =
            "true";


        /*
        Use service-specific fallback
        */

        if (fallbackImage) {

            event.currentTarget.src =
                fallbackImage;

            return;

        }


        /*
        Final generic fallback
        */

        event.currentTarget.src =
            "https://loremflickr.com/900/600/home,service?lock=999";

    }


    return (

        <div className="service-card">


            {/* =========================================
                IMAGE
            ========================================== */}

            <div className="service-image-container">

                <img
                    src={image}
                    alt={title}
                    className="service-image"
                    onError={handleImageError}
                    loading="lazy"
                />

            </div>


            {/* =========================================
                CONTENT
            ========================================== */}

            <div className="service-card-content">


                {/* =====================================
                    RATING
                ====================================== */}

                <div className="service-rating">

                    ⭐ {rating}

                </div>


                {/* =====================================
                    TITLE
                ====================================== */}

                <h2>

                    {title}

                </h2>


                {/* =====================================
                    DESCRIPTION
                ====================================== */}

                <p className="service-description">

                    {description}

                </p>


                {/* =====================================
                    PRICE
                ====================================== */}

                <div className="service-price">

                    <span>
                        Starting from
                    </span>

                    <strong>
                        ₹{price}
                    </strong>

                </div>


                {/* =====================================
                    ACTION BUTTONS
                ====================================== */}

                <div className="service-actions">


                    {/* ADD TO CART */}

                    <button
                        className="cart-button"
                        onClick={handleAddToCart}
                    >

                        🛒 Add to Cart

                    </button>


                    {/* BOOK NOW */}

                    <button
                        className="book-button"
                        onClick={handleBookNow}
                    >

                        Book Now

                    </button>

                </div>

            </div>

        </div>

    );

}


export default ServiceCard;