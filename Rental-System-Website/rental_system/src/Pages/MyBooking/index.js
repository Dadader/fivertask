import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Services/auth.service";

function MyBooking() {
  const [rentalSpaces, setRentalSpaces] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  let navigate = useNavigate();

  useEffect(() => {
    //This functions loads the user from the cookies and check whether he is admin or not
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    //When the page mounts it fetches all the the rental spaces from the Database.
    fetch("http://localhost:5000/api/test/rentalspace")
      .then((response) => response.json())
      .then((data) => setRentalSpaces(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleCardClick = (id) => {
    // Redirect to the details page with the selected card's ID
    navigate(`/rentalspace/${id}`);
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>My Bookings</h3>
      </header>
      <div className="row">
        {rentalSpaces.map((rentalSpace) => (
          <div key={rentalSpace.id} className="col-md-4 mb-4">
            <div className="card">
              <div>
                <img
                  src={`${rentalSpace.image}`}
                  className="card-img-top"
                  alt="Rental Space"
                  height={200}
                  width={200}
                />
                <div className="card-body">
                  <h5 className="card-title">{rentalSpace.name}</h5>
                  <p className="card-text">Location: {rentalSpace.location}</p>
                  <p className="card-text">Size: {rentalSpace.size} Sq. Yard</p>
                  <p className="card-text">
                    Has Outdoor Space:{" "}
                    {rentalSpace.hasOutdoorSpace ? "Yes" : "No"}
                  </p>
                  <p className="card-text">
                    Catering Included:{" "}
                    {rentalSpace.cateringIncluded ? "Yes" : "No"}
                  </p>
                  <p className="card-text">
                    Rent charges: {rentalSpace.Price}$ /hr
                  </p>
                  <p>Booking Date:</p>
                  <p>Booking Time:</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBooking;
