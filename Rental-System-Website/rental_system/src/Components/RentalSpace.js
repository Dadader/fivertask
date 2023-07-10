import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RentalSpacesList = () => {
  const [rentalSpaces, setRentalSpaces] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/test/rentalspace")
      .then((response) => response.json())
      .then((data) => setRentalSpaces(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/test/rentalspace/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Delete operation successful
        console.log("Rental space deleted successfully");

        // Remove the record from the UI
        setRentalSpaces((prevRentalSpaces) =>
          prevRentalSpaces.filter((rentalSpace) => rentalSpace.id !== id)
        );
        navigate(`/user`);
      } else {
        // Delete operation failed
        console.log("Failed to delete rental space");

        // Handle error response or display error message to the user
        const errorData = await response.json();
        console.log(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or display error message to the user
    }
  };

  const handleCardClick = (id) => {
    // Redirect to the details page with the selected card's ID
    navigate(`/rentalspace/${id}`);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate("/Createspace");
          }}
        >
          Add Space
        </button>
      </div>
      <div className="row">
        {rentalSpaces.map((rentalSpace) => (
          <div
            key={rentalSpace.id}
            className="col-md-4 mb-4"
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick(rentalSpace.id)}
          >
            <div className="card">
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
              </div>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(rentalSpace.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalSpacesList;
