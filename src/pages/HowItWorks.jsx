import Navbar from "../components/Navbar";

function HowItWorks() {

  return (

    <div>

      <Navbar />

      <section className="page-header">

        <span>HOW IT WORKS</span>

        <h1>
          Getting a service is simple.
        </h1>

        <p>
          Book trusted professionals in just
          a few simple steps.
        </p>

      </section>


      <section className="section">

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Choose a service
            </h3>

            <p>
              Search and select the service
              you need.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              Select a professional
            </h3>

            <p>
              Compare professionals based on
              rating, price and availability.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              Choose date and time
            </h3>

            <p>
              Select a convenient time for your
              service.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              04
            </div>

            <h3>
              Book & Pay
            </h3>

            <p>
              Confirm your booking and make
              a secure payment.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              05
            </div>

            <h3>
              Track your professional
            </h3>

            <p>
              Track the booking status in
              real time.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              06
            </div>

            <h3>
              Rate the service
            </h3>

            <p>
              Give your feedback after
              completion.
            </p>

          </div>

        </div>

      </section>

    </div>

  );
}

export default HowItWorks;
