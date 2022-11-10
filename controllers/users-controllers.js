const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

async function getUsersList(req, res, next) {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not get a users",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((item) => item.toObject({ getters: true })) });
}
async function signUp(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data passed", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exists", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent-Picture.png",
    password,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.json({ success: true, user: createdUser.toObject({ getters: true }) });
}
async function logIn(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data passed", 422));
  }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  res.json({
    message: "Logged in",
    user: existingUser.toObject({ getters: true }),
  });
}

exports.getUsersList = getUsersList;
exports.signUp = signUp;
exports.logIn = logIn;
