import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./Services/auth.service";

import LoginUser from "./Pages/Login/index";
import RegisterUser from "./Pages/RegisterUser/index";
import Profile from "./Pages/Profile/index";
import RentalSpacesList from "./Components/RentalSpace";
import BoardAdmin from "./Components/BoardAdmin";

import Createspace from "./Pages/CreateSpace";
import EventBus from "./common/EventBus";
import RentalSpace from "./Pages/RentalSpace";
import UpdateSpace from "./Pages/UpdateSpace";
import MyBooking from "./Pages/MyBooking";

const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();

    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/Home"} className="navbar-brand">
          RentalSystem
        </Link>

        <div className="navbar-nav mr-auto">
          {/* <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li> */}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/Home"} className="nav-link">
                Market Place
              </Link>
            </li>
          )}
          {currentUser && !showAdminBoard && (
            <li className="nav-item">
              <Link to={"/MyBooking"} className="nav-link">
                My Bookings
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<RentalSpacesList />} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/rentalspace/:id" element={<RentalSpace />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Home" element={<RentalSpacesList />} />
          <Route path="/CreateSpace" element={<Createspace />} />
          <Route path="/MyBooking" element={<MyBooking />} />
          <Route path="/admin" element={<BoardAdmin />} />
          <Route path="/Updatespace/:id" element={<UpdateSpace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
