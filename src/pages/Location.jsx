import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Location() {
  const navigate = useNavigate();

  const [location, setLocation] =
    useState("");

  const [address, setAddress] =
    useState("");

  function saveLocation() {
    if (!location) {
      alert("Please select a city.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your full address.");
      return;
    }

    localStorage.setItem(
      "bookingLocation",
      JSON.stringify({
        city: location,
        address: address.trim()
      })
    );

    navigate("/booking");
  }

  return (
    <div className="simple-page">

      <div className="simple-card">

        <div className="big-icon">
          📍
        </div>

        <h1>
          Where should we provide the service?
        </h1>

        <p>
          Enter the location where you
          want our professional to visit.
        </p>

        <select
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        >
          <option value="">
            Select city
          </option>

          <option value="Hyderabad">
            Hyderabad
          </option>

          <option value="Bangalore">
            Bangalore
          </option>

          <option value="Chennai">
            Chennai
          </option>

          <option value="Mumbai">
            Mumbai
          </option>

          <option value="Delhi">
            Delhi
          </option>

        </select>

        <textarea
          placeholder="Enter your complete address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          rows="4"
        />

        <button
          className="auth-button"
          onClick={saveLocation}
        >
          Save Location →
        </button>

        <button
          className="text-button"
          onClick={() =>
            navigate("/booking")
          }
        >
          ← Back to Booking
        </button>

      </div>

    </div>
  );
}

export default Location;
