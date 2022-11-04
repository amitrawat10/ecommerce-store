const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const path = require("path");
const compression = require("compression");
// when its in development
if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "backend/config/config.env" });

app.use(compression()); // compress all routes
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/frontend/build/index.html"));
});

// global error middlewares
app.use(errorMiddleware);
module.exports = app;
