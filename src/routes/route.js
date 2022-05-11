const express = require('express')
const { getBook, createBook, bybookId, updateBook, deleteById } = require('../controllers/bookControllers')
const { creatUser, loginUser } = require('../controllers/userControllers')

const router = express.Router()
const { validateAuthor, authorValidated } = require('../validations/userValidations')

router.post("/register", validateAuthor, authorValidated, creatUser);
router.post("/login", loginUser);
//=========================
router.post("/books",  createBook);
router.get("/books", getBook);
router.get("/books/:bookId", bybookId);
router.put("/books/:bookId", updateBook);
router.delete("/books/:bookId", deleteById);
//================================
// router.post("/books/:bookId/review", createReview);



module.exports = router
