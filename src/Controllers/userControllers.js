const user = require("../models/userModel");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const secretKey = "Gr34t mind5 think 4like";

const creatUser = async (req, res) => {
  try {
    const userData = req.body;
    const { title, name, email, phone } = userData;

    if (!title) {
      return res.status(400).send({status : false, message : "Title must be present"});
    }

    let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){2,24}$/gi;

    if (!name.match(namePattern)) {
      return res.status(400).send({status : false, message : "This is not a valid name"})
    }

    let finduser = await user.findOne({email});

    if (finduser) {
      return res.status(400).send({status : false, message : "this email is already being used"})
    }

    let checkPhone = await user.findOne({phone})
    if (checkPhone) {
        return res.status(400).send({status : false, message : "this phone number is already being used"})
      }

    let createUser = await user.create(userData);
    return res.status(201).send({ status: true, message:"registration successfull" , data: createUser });
  } catch (err) {
    res.status(500).send({ status: false, err: err.message });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({status : false, message : "email is required"});
    }

    if (!password) {
      return res.status(400).send({status : false, message : "password is required"});
    }

    let validateEmail = emailValidator.validate(email);

    if (!validateEmail) {
      return res.status(400).send({status : false, message : "this is not a valid email"});
    }

    let findUser = await user.findOne({ email });
    if (!findUser) return res.status(404).send({status : false, message : "no user with this email exists"});

    let verifyUser = await user.findOne({ email: email, password: password });
    if (!verifyUser) return res.status(400).send({status : false, message : "password are wrong"});

    let token = jwt.sign({ userId: verifyUser._id }, secretKey, {
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