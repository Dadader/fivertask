import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import AuthService from "../../Services/auth.service";

const RentalSpace = () => {
  const { id } = useParams();
  const [rentalSpace, setRentalSpace] = useState(null);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  //This functions books the rental space for the user.
  const handleRentIt = () => {
    const bookingData = {
      rentalSpaceId: id,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      userId: currentUser.id,
    };

    fetch("http://localhost:5000/api/test/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => {
        if (response.status === 201) {
          alert("Successful rent");
          // Show a success message to the user
        } else if (response.status === 409) {
          alert("Space occupied");
          // Show an error message to the user
        } else {
          console.log("Error occurred");
          // Handle other possible error cases
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any network or API errors
      });
  };

  //This Api fethces the bookings for that particular rental Space.
  useEffect(() => {
    fetch(`http://localhost:5000/api/test/viewrentalspace/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRentalSpace(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [id]);

  //This Api fethces the bookings for that particular rental Space.
  const handleShowBookings = () => {
    fetch(`http://localhost:5000/api/test/viewrentalspace/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRentalSpace(data);
      })
      .catch((error) => console.error("Error:", error));
    setShowBookingsModal(true);
  };

  if (!rentalSpace) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img
            src={rentalSpace.rentalSpace.image}
            alt="Rental Space"
            className="img-fluid"
          />
        </div>
        <div className="col-md-6">
          <h1>{rentalSpace.name}</h1>
          <p className="text-muted">{rentalSpace.rentalSpace.location}</p>
          <p className="text-primary">${rentalSpace.rentalSpace.Price}</p>
          <p>{rentalSpace.rentalSpace.Description}</p>
          <p>
            Size: {rentalSpace.rentalSpace.size} Sq. Yard
            <br />
            Has Outdoor Space:{" "}
            {rentalSpace.rentalSpace.hasOutdoorSpace ? "Yes" : "No"}
            <br />
            Catering Included:{" "}
            {rentalSpace.rentalSpace.cateringIncluded ? "Yes" : "No"}
          </p>
          <div className="d-flex">
            <button
              className="btn btn-success mr-2"
              data-toggle="modal"
              data-target="#rentModal2"
              onClick={handleShowBookings}
            >
              Show booking
            </button>
            {currentUser && (
              <button
                className="btn btn-success"
                data-toggle="modal"
                data-target="#rentModal"
              >
                Rent It
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bookings Modal */}
      <div className="modal fade" id="rentModal2" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Bookings</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              {rentalSpace.bookings.map((booking, index) => (
                <div key={booking.id}>
                  <h6>Booking {index + 1}:</h6>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <p>
                        <b>Start Date:</b>{" "}
                        {new Date(booking.startDateTime).toLocaleDateString()}
                      </p>
                      <p>
                        <b>Start Time: </b>{" "}
                        {new Date(booking.startDateTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p>
                        <b>End Date:</b>{" "}
                        {new Date(booking.endDateTime).toLocaleDateString()}
                      </p>
                      <p>
                        <b>End Time:</b>{" "}
                        {new Date(booking.endDateTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rent Modal */}
      <div className="modal fade" id="rentModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Rent It</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="startDateTime">Start Date/Time:</label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  className="form-control"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDateTime">End Date/Time:</label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  className="form-control"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRentIt}
                data-dismiss="modal"
              >
                Rent
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalSpace;
