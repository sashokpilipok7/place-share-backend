const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/%D0%86%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D1%96%D0%B0%D0%BB%D1%8C%D0%BD%D0%B8%D0%B9_%D0%BA%D0%BE%D0%BB%D0%B5%D0%B4%D0%B6.jpg",
    title: "Кам'янець-Подільський індустріальний ",
    description: "державний вищий навчальний заклад у Кам'янці-Подільському",
    address: "вулиця Суворова, 17, Кам'янець-Подільський",
    creator: "u1",
    location: {
      lat: 48.686041877319035,
      lng: 26.571066315655322,
    },
  },
  { creator: "u1" },
  { creator: "u1" },
];

router.get("/:pid", (req, res, next) => {
  console.log("GET REQUEST IN PLACES WORKS FINE");
  const placeID = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeID);

  if (!place) {
    const error = new Error("Couldn't find a place");
    error.code = 404;
    throw error;
  } else {
    res.json({ place });
  }
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places.length) {
    const error = new Error("Couldn't find a places list");
    error.code = 404;
    next(error);
  } else {
    res.json(places);
  }
});

module.exports = router;
