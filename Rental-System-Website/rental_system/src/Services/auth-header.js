//This function Separates the JWT token from the Header to display.
export default function authHeader() {

  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    // for Node.js Express back-end
    return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
}
