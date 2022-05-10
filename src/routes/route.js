const express = require('express')
const { creatUser, loginUser } = require('../controllers/userControllers')
const router = express.Router()
const { validateAuthor, validate, authorValidated } = require('../validations/userValidations')




router.post("/register", validateAuthor, authorValidated, creatUser )
router.post("/login",  loginUser )


module.exports = router