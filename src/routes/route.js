const express = require('express')
const { creatUser, loginUser } = require('../controllers/userControllers')
const router = express.Router()
// const usercontrollers = require('../Controllers/userControllers')
const { validateAuthor, validate } = require('../validations/userValidations')
// const usercontrollers = require('../Controllers/userControllers')



router.post("/register", validateAuthor,validate, creatUser )
router.post("/login",  loginUser )


module.exports = router