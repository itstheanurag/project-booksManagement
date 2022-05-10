const express = require('express')
const { getBook, createBook, bybookId } = require('../controllers/bookControllers')
const { creatUser, loginUser } = require('../controllers/userControllers')
// const { validateBook, bookValidated } = require('../validations/bookValidations')
const router = express.Router()
const { validateAuthor, validate, authorValidated } = require('../validations/userValidations')




router.post("/register", validateAuthor, authorValidated, creatUser )
router.post("/login",  loginUser )
router.post("/books",  createBook)
router.get("/books", getBook)
router.get("/books/:bookId", bybookId)

module.exports = router