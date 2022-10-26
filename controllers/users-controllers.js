const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Sasha Pylypenko",
    email: "Sashapylypenko.pov@gmail.com",
    passsword: "testtest",
  },
];

function getUsersList(req, res, next) {
  console.log("GET REQUEST IN USERS WORKS FINE");
  res.json({ users: DUMMY_USERS });
}
function signUp(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid data passed", 422);
  }
  const { name, email, password } = req.body;

  if (DUMMY_USERS.find((item) => item.email === email)) {
    throw new HttpError("This email already exists", 401);
  }

  const createdUser = {
    id: uuid.v4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.json({ success: true, user: createdUser });
}
function logIn(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid data passed", 422);
  }
  const { email, passsword } = req.body;

  const identUser = DUMMY_USERS.find((item) => item.email === email);
  if (!identUser || identUser.passsword !== passsword) {
    throw new HttpError("Couldnt find user or credetials is wrong");
  }

  res.json({ success: true, token: "fgskjnafmkjna", id: "u2" });
}

exports.getUsersList = getUsersList;
exports.signUp = signUp;
exports.logIn = logIn;
