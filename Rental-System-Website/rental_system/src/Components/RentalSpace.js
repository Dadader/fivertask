import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authHeader from "../Services/auth-header";
import AuthService from "../Services/auth.service";

const RentalSpacesList = () => {
  const [rentalSpaces, setRentalSpaces] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  let navigate = useNavigate();

  useEffect(() => {
    //This functions loads the user from the cookies and check whether he is admin or not
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  useEffect(() => {
    //When the page mounts it fetches all the the rental spaces from the Database.
    fetch("http://localhost:5000/api/test/rentalspace")
      .then((response) => response.json())
      .then((data) => setRentalSpaces(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleDelete = async (id) => {
    //It deletes the rental Space by Id.
    try {
      const response = await fetch(
        `http://localhost:5000/api/test/rentalspace/${id}`,
        {
          method: "DELETE",
          headers: authHeader(),
        }
      );

      if (response.ok) {
        // Delete operation successful
        console.log("Rental space deleted successfully");

        // Remove the record from the UI
        setRentalSpaces((prevRentalSpaces) =>
          prevRentalSpaces.filter((rentalSpace) => rentalSpace.id !== id)
        );
        //  navigate(`/user`);
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

  const handleUpdateSpace = (id) => {
    navigate(`/Updatespace/${id}`);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const filteredRentalSpaces = rentalSpaces.filter((rentalSpace) => {
    const isNameMatch = rentalSpace.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isPriceMatch =
      (minPrice === "" || rentalSpace.Price >= parseInt(minPrice)) &&
      (maxPrice === "" || rentalSpace.Price <= parseInt(maxPrice));
    const isLocationMatch =
      location === "" ||
      rentalSpace.location.toLowerCase().includes(location.toLowerCase());

    return isNameMatch && isPriceMatch && isLocationMatch;
  });

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        {showAdminBoard && (
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate("/Createspace");
            }}
          >
            Add Space
          </button>
        )}
      </div>
      <div className="row">
        <div className="col-md-12 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Minimum Price"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Maximum Price"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            value={location}
            onChange={handleLocationChange}
          />
        </div>
      </div>
      <div className="row">
        {filteredRentalSpaces.map((rentalSpace) => (
          <div key={rentalSpace.id} className="col-md-4 mb-4">
            <div className="card">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(rentalSpace.id)}
              >
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
                </div>
                <hr />
              </div>

              {showAdminBoard && (
                <div className="card-buttons d-flex">
                  <button
                    className="btn btn-danger mr-2"
                    onClick={() => handleDelete(rentalSpace.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdateSpace(rentalSpace.id)}
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalSpacesList;
