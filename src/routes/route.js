const express = require("express");
const { creatUser, loginUser } = require("../controllers/userControllers");
const {
  createBook,
  getBook,
  getByBookId,
  updateBook,
  deleteById,
} = require("../controllers/bookControllers");
const {
  createReview,
  updateReview,
  deleteReviewById,
} = require("../controllers/bookControllers");
const router = express.Router();
const {
  validateAuthor,
  validate,
  authorValidated,
} = require("../validations/userValidations");
const {
  validateBook,
  bookValidated,
} = require("../validations/bookValidations");

router.post("/register", creatUser);
router.post("/login", loginUser);
//=========================
router.post("/books", bookValidated,validateBook,  createBook);
router.get("/books", getBook);
router.get("/books/:bookId", getByBookId);
router.put("/books/:bookId", updateBook);
router.delete("/books/:bookId", deleteById);
//================================
// router.post("/books/:bookId/review", createReview);

module.exports = router;
