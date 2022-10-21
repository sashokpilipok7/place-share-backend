const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET REQUEST IN PLACES WORKS FINE");
  res.json({ message: "It works" });
});
