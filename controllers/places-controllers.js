const uuid = require("uuid");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../utils/location");
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

  if (!places || !places.length) {
    next(new HttpError("Couldn't find a places list", 404));
  } else {
    res.json(places);
  }
}

async function createPlace(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }
  const { title, description, coordinates, address, creator } = req.body;

  // let coords;
  // getCoordsForAddress()
  //   .then((data) => console.log(data, "second this, after 2 seconds"))
  //   .catch((error) => next(error));

  // console.log(coords, "first this");

  let coords;
  try {
    coords = await getCoordsForAddress();
    console.log(coords, "1");
  } catch (error) {
    return next(error);
  }

  console.log(coords, "2");

  const createdPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coords,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); // or unshift(createdPlace)

  res.status(201).json({ place: createdPlace });
}

function updatePlace(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }

  const placeID = req.params.pid;
  const { title, description } = req.body;

  const idx = DUMMY_PLACES.findIndex((item) => item.id === placeID);
  const updatedPlace = { ...DUMMY_PLACES[idx], title, description };

  if (idx === -1) {
    next(new HttpError("Couldn't find a place", 404));
  } else {
    DUMMY_PLACES.splice(idx, 1, updatedPlace);
    res.status(200).json({ place: updatedPlace });
  }
}

function deletePlace(req, res, next) {
  const placeID = req.params.pid;

  const idx = DUMMY_PLACES.findIndex((item) => item.id === placeID);

  if (idx === -1) {
    throw new HttpError("Couldn't find a place", 404);
  } else {
    DUMMY_PLACES.splice(idx, 1);
    res.status(200).json({ message: "Success!" });
  }
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
