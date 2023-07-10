import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./Services/auth.service";

import LoginUser from "./Pages/Login/index";
import RegisterUser from "./Pages/RegisterUser/index";
import Home from "./Components/Home";
import Profile from "./Pages/Profile/index";
import RentalSpacesList from "./Components/RentalSpace";
import BoardAdmin from "./Components/BoardAdmin";
import ChoiceUser from "./Pages/Choice";
import Createspace from "./Pages/CreateSpace";

import EventBus from "./common/EventBus";
import LoginAdmin from "./Pages/LoginAdmin";
import RentalSpace from "./Pages/RentalSpace";

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
        <Link to={"/"} className="navbar-brand">
          bezKoder
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
              <Link to={"/user"} className="nav-link">
                User
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
        ) : // ) : (
        //   <div className="navbar-nav ml-auto">
        //     <li className="nav-item">
        //       <Link to={"/login"} className="nav-link">
        //         Login
        //       </Link>
        //     </li>

        //     <li className="nav-item">
        //       <Link to={"/register"} className="nav-link">
        //         Sign Up
        //       </Link>
        //     </li>
        //   </div>
        // )}
        null}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<ChoiceUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/choice" element={<ChoiceUser />} />
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/rentalspace/:id" element={<RentalSpace />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<RentalSpacesList />} />
          <Route path="/CreateSpace" element={<Createspace />} />
          <Route path="/admin" element={<BoardAdmin />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
