import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";

function SearchResults() {

  const [searchParams] = useSearchParams();

  const search = searchParams.get("q") || "";


  const services = [

    {
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      title: "Salon at Home",
      description: "Professional salon service at home",
      price: 499,
      rating: 4.8
    },

    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      title: "AC Repair",
      description: "Professional AC repair",
      price: 299,
      rating: 4.7
    },

    {
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      title: "Home Cleaning",
      description: "Deep home cleaning service",
      price: 699,
      rating: 4.9
    },

    {
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1",
      title: "Spa at Home",
      description: "Relaxing spa service",
      price: 999,
      rating: 4.8
    },

    {
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e",
      title: "Electrician",
      description: "Electrical repair service",
      price: 249,
      rating: 4.6
    }

  ];


  const results = services.filter(
    service =>
      service.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      service.description
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  return (

    <div>

      <Navbar />


      <section className="page-header">

        <span>SEARCH RESULTS</span>

        <h1>
          Results for "{search}"
        </h1>

      </section>


      <section className="section">

        {results.length > 0 ? (

          <div className="service-grid">

            {results.map(
              (service, index) => (

                <ServiceCard
                  key={index}
                  image={service.image}
                  title={service.title}
                  description={service.description}
                  price={service.price}
                  rating={service.rating}
                />

              )
            )}

          </div>

        ) : (

          <div className="empty-message">

            <h2>
              No services found
            </h2>

            <p>
              Try searching for salon, cleaning,
              AC repair, electrician, etc.
            </p>

          </div>

        )}

      </section>

    </div>

  );
}

export default SearchResults;