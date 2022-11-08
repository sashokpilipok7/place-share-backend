const { default: mongoose } = require("mongoose");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../utils/location");
const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");

async function getPlaceById(req, res, next) {
  const placeID = req.params.pid;

  try {
    var place = await Place.findById(placeID);
  } catch (err) {
    const error = new HttpError(
      "Something went wront, could not find a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Couldn't find a place", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
}

async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;

  try {
    var places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wront, could not find a place list",
      500
    );
    return next(error);
  }

  if (!places || !places.length) {
    return next(
      new HttpError("Couldn't find a place list for the provided id", 404)
    );
  }
  res.json({ places: places.map((item) => item.toObject({ getters: true })) });
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

  const createdPlace = new Place({
    title,
    description,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/%D0%86%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D1%96%D0%B0%D0%BB%D1%8C%D0%BD%D0%B8%D0%B9_%D0%BA%D0%BE%D0%BB%D0%B5%D0%B4%D0%B6.jpg",
    address,
    location: coords,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find a user for provided id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
}

async function updatePlace(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const placeID = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeID);
  } catch (err) {
    const error = new HttpError("Could not update a place", 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Could not update a place", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
}

async function deletePlace(req, res, next) {
  const placeID = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeID).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete a place"
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find a place", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete a place"
    );
    return next(error);
  }

  res.status(200).json({ message: "Success!" });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
