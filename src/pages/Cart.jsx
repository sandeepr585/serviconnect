import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { useCart } from "../context/useCart";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const totalDiscount = cartItems.reduce(
    (total, item) =>
      total +
      (
        (Number(item.originalPrice || item.price) -
          Number(item.price || 0)) *
        item.quantity
      ),
    0
  );

  const originalTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.originalPrice || item.price || 0) *
        item.quantity,
    0
  );

  function proceedToBooking() {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Check that every service has an ID
    const invalidItem = cartItems.find(
      (item) =>
        !item.serviceId &&
        !item.id
    );

    if (invalidItem) {
      alert(
        `Service ID missing for ${invalidItem.title}. Please remove it and add it again.`
      );
      return;
    }

    navigate("/booking");
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />

        <section className="cart-page">
          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h1>Your cart is empty</h1>

            <p>
              Add some services to your cart
              and book them together.
            </p>

            <button
              className="auth-button"
              onClick={() =>
                navigate("/services")
              }
            >
              Browse Services
            </button>

          </div>
        </section>
      </div>
    );
  }

  return (
    <div>

      <Navbar />

      <section className="cart-page">

        <div className="cart-header">

          <span>SERVICONNECT</span>

          <h1>Your Cart</h1>

          <p>
            Review your selected services
            before booking.
          </p>

        </div>

        <div className="cart-container">

          <div className="cart-items">

            {cartItems.map((item) => (

              <div
                className="cart-item"
                key={item.title}
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div className="cart-item-details">

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                  {item.discount > 0 && (
                    <span className="cart-offer">
                      🔥 {item.discount}% OFF
                    </span>
                  )}

                  <div className="cart-price">

                    <strong>
                      ₹{item.price}
                    </strong>

                    {item.discount > 0 && (
                      <del>
                        ₹{item.originalPrice}
                      </del>
                    )}

                  </div>

                </div>

                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item.title
                      )
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(
                        item.title
                      )
                    }
                  >
                    +
                  </button>

                </div>

                <div className="cart-item-total">
                  ₹
                  {Number(item.price) *
                    item.quantity}
                </div>

                <button
                  className="remove-button"
                  onClick={() =>
                    removeFromCart(
                      item.title
                    )
                  }
                >
                  ✕
                </button>

              </div>

            ))}

          </div>

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">
              <span>
                Original Price
              </span>

              <span>
                ₹{originalTotal}
              </span>
            </div>

            <div className="summary-row discount-row">

              <span>
                Offer Discount
              </span>

              <span>
                - ₹{totalDiscount}
              </span>

            </div>

            <hr />

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{cartTotal}
              </strong>

            </div>

            <button
              className="checkout-button"
              onClick={proceedToBooking}
            >
              Proceed to Booking →
            </button>

            <button
              className="continue-button"
              onClick={() =>
                navigate("/services")
              }
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Cart;
