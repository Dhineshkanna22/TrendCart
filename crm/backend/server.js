const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const collectionRoutes = require("./routes/collectionRoute");
const itemsRoute = require("./routes/itemRoutes");

const app = express();

// Connect to the database
connectDB();

// Middleware for Cross-Origin Resource Sharing
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/collection", collectionRoutes);
app.use("/items", itemsRoute);

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
