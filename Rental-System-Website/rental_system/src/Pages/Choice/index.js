import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ChoiceUser = () => {
  let navigate = useNavigate();

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <h4>Welcome To Rental Space System</h4>
        <button
          className="btn bg-primary mr-2 ml-2 mt-2 mb-2"
          onClick={() => {
            navigate("/loginadmin");
          }}
        >
          Login As Admin
        </button>
        <button
          className="btn bg-primary mr-2 ml-2  mb-2"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login As User
        </button>
      </div>
    </div>
  );
};

export default ChoiceUser;
