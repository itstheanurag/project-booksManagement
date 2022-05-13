const express = require('express')
const { getBook, createBook, bybookId, updateBook, deleteById } = require('../controllers/bookControllers')
const { createReview, updateReview, deleteReviewById } = require('../Controllers/reviewControllers')
const { creatUser, loginUser } = require('../controllers/userControllers')
const { authenticate, authorization } = require('../middleWares/auth')

const router = express.Router()
const { validateAuthor, authorValidated } = require('../validations/userValidations')

router.post("/register", validateAuthor, authorValidated, creatUser);
router.post("/login", loginUser);
//=========================
router.post("/books", authorization, createBook);
router.get("/books", authenticate, getBook);
router.get("/books/:bookId", authenticate, bybookId);
router.put("/books/:bookId", authorization, updateBook);
router.delete("/books/:bookId", authorization, deleteById);
//================================
router.post("/books/:bookId/review",  createReview);
router.put("/books/:bookId/review/:reviewId", updateReview);
router.delete("/books/:bookId/review/:reviewId", deleteReviewById);



module.exports = router
