const user = require("../models/userModel");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const secretKey = "Thsiuhfidshfs9fjWHERIHWE9E0U";

const creatUser = async (req, res) => {
  try {
    const userData = req.body;
    const { title, name } = userData;

    if (!title) {
      return sendError(
        res,
        "title is a required field and can not be empty",
        400
      );
    }

    let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,12}$/gi;

    if (!name.match(namePattern)) {
      return sendError(res, "this is not a valid name", 400);
    }

    let finduser = await user.findOne(data);

    if (finduser) {
      return sendError(res, "an user with this details already exists", 400);
    }

    let createUser = await user.create(data);
    return res.status(201).send({ status: true,message:"registration successfull" ,data: createUser });
  } catch (err) {
    res.status(500).send({ status: false, err: err.msg });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      found;
      return sendError(res, "email must be present ", 400);
    }

    if (!password) {
      found;
      return sendError(res, "password must be present ", 400);
    }

    let validateEmail = emailValidator.validate(email);

    if (!validateEmail) {
      return sendError(res, "email is not valid", 400);
    }

    let findUser = await user.findOne({ email });
    if (!findUser) return sendError(res, "No user found", 404);

    let verifyUser = await user.findOne({ email: email, password: password });
    if (!verifyUser) return sendError(res, "Password is wrong", 400);

    let token = jwt.sign({ userId: findUser._id }, secretKey, {
      expiresIn: "2d",
    });

    res.header("x-auth-key", token);

    res
      .status(200)
      .send({ status: true, message: "login successful", data: token });
  } catch (err) {
    res.status(500).send({ status: false, err: err.msg });
  }
};


module.exports = {creatUser,loginUser}