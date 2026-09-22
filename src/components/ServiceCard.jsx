import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

function ServiceCard({
    id,
    image,
    title,
    description,
    price,
    rating
}) {

    const navigate = useNavigate();

    const { addToCart } = useCart();


    function handleBookNow() {

        navigate(`/booking?serviceId=${id}`);
    }


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


    function handleImageError(event) {

        event.currentTarget.src =
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80";
    }


    return (

        <div className="service-card">


            {/* SERVICE IMAGE */}

            <div className="service-image-container">

                <img
                    src={image}
                    alt={title}
                    className="service-image"
                    onError={handleImageError}
                    loading="lazy"
                />

            </div>


            {/* SERVICE CONTENT */}

            <div className="service-card-content">


                {/* RATING */}

                <div className="service-rating">

                    ⭐ {rating}

                </div>


                {/* TITLE */}

                <h2>

                    {title}

                </h2>


                {/* DESCRIPTION */}

                <p className="service-description">

                    {description}

                </p>


                {/* PRICE */}

                <div className="service-price">

                    <span>

                        Starting from

                    </span>

                    <strong>

                        ₹{price}

                    </strong>

                </div>


                {/* BUTTONS */}

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
