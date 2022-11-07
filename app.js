const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("can't find such route");
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://sasha:testtest2001@cluster0.zxvtkjc.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to db");
    app.listen(5000);
  })
  .catch((err) => console.log(err));
