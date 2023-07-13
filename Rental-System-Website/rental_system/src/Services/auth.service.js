import axios from "axios";


const API_URL = "http://localhost:5000/api/auth/";

//This Api Registers the User.
const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

//This Api Logins the User
const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

//This function delete the JWT token from the Local Storage
const logout = () => {
  localStorage.removeItem("user");
};
//This functions get the JWT token from the Local Storage
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
