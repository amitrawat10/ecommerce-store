const app = require("./app");
const connectDB = require("./config/db");
const cloudinary = require("cloudinary");
// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// when its in development
// if (process.env.NODE_ENV !== "PRODUCTION")
require("dotenv").config({ path: "backend/config/config.env" });

connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`shutting down the server due to unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
