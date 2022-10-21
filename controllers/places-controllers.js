const uuid = require("uuid");

const HttpError = require("../models/http-error");

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

function getPlaceById(req, res, next) {
  console.log("GET REQUEST IN PLACES WORKS FINE");
  const placeID = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeID);

  if (!place) {
    throw new HttpError("Couldn't find a place", 404);
  } else {
    res.json({ place });
  }
}

function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places.length) {
    next(new HttpError("Couldn't find a places list", 404));
  } else {
    res.json(places);
  }
}

function createPlace(req, res, next) {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); // or unshift(createdPlace)

  res.status(201).json({ place: createdPlace });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
