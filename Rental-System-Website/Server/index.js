require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const cors = require("cors");

const Customer_routes=require("./routes/User");

const corsOptions = {
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Accept-Language",
      "Accept-Encoding",
      "Accept-Charset",
      "Content-Length",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "Access-Control-Expose-Headers",
      "Access-Control-Max-Age",
      "Access-Control-Allow-Credentials",
    ],
    exposedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Accept-Language",
      "Accept-Encoding",
      "Accept-Charset",
      "Content-Length",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "Access-Control-Expose-Headers",
      "Access-Control-Max-Age",
      "Access-Control-Allow-Credentials",
    ],
  };
  app.use(cors(corsOptions));

app.use("/api/Customer",Customer_routes);

if (!process.env.TOKEN_KEY) {
  console.error("FATAL ERROR:jwtPrivateKEy is not defined.");
  process.exit(1);
}

const PORT = process.env.PORT || 3080;

app.listen(PORT, () => {
  console.log("Server is now listening at port 3080");
});