import Navbar from "../components/Navbar";

function About() {

  return (

    <div>

      <Navbar />

      <section className="page-header">

        <span>ABOUT SERVICONNECT</span>

        <h1>
          Making everyday services easier.
        </h1>

        <p>
          ServiConnect connects customers with
          trusted service professionals.
        </p>

      </section>


      <section className="section about-content">

        <h2>
          One platform for everyday services
        </h2>

        <p>
          ServiConnect is a service marketplace
          designed to make finding and booking
          professional services simple.
        </p>

        <p>
          Customers can discover professionals,
          compare ratings and prices, select a
          convenient time and track their booking.
        </p>

        <p>
          Service providers can manage their
          services, bookings, availability,
          customers and earnings.
        </p>


        <div className="about-features">

          <div>
            <h3>🔒 Trusted</h3>
            <p>
              Verified professionals and transparent
              ratings.
            </p>
          </div>

          <div>
            <h3>⚡ Fast</h3>
            <p>
              Find and book services quickly.
            </p>
          </div>

          <div>
            <h3>🤖 AI Powered</h3>
            <p>
              AI recommendations to help users
              find the right service.
            </p>
          </div>

        </div>

      </section>

    </div>

  );
}

export default About;
