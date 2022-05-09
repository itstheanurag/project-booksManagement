const express = require('express')
const { creatUser, loginUser } = require('../Controllers/userControllers')
const router = express.Router()
// const usercontrollers = require('../Controllers/userControllers')
const { validateAuthor, validate } = require('../Validations/userValidations')
// const usercontrollers = require('../Controllers/userControllers')



router.post('/register', validateAuthor,validate, creatUser )
router.post('/login',  loginUser )
