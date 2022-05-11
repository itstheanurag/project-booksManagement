const book = require("../models/bookModel");
const mongoose = require("mongoose");
const user = require("../models/userModel");
const review = require("../models/reviewModel");

const createBook = async (req, res) => {
    try {
        let bookData = req.body;
        let { title, userId, ISBN, category, subcategory, excerpt, releasedAt } =
            bookData;

        if (title) {
            if (title.trim().length === 0) {
                return res
                    .status(400)
                    .send({ status: false, message: "Title can not be empty" });
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "Title is a required field" });
        }

        let isUniqueTitle = await book.findOne({ title: title });
        if (isUniqueTitle) {
            return res
                .status(400)
                .send({ status: false, message: "this title is being used" });
        }

        if (excerpt) {
            if (excerpt.trim().length === 0) {
                return res
                    .status(400)
                    .send({ status: false, message: "excerpt can not be empty" });
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "excerpt is a required field" });
        }

        if (userId) {
            let validUserId = mongoose.isValidObjectId(userId);
            if (!validUserId) {
                return res
                    .status(400)
                    .send({ status: false, message: "This is not a valid user id" });
            }

            let findUser = await user.findOne({_id : userId });
            if (!findUser) {
                return res
                    .status(404)
                    .send({ status: false, message: "User with this Id does not exist" });
            }
        } else {
            return res
                .status(404)
                .send({ status: false, message: "User Id is a required field" });
        }

        if (ISBN) {
            let isbnPattern = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/g;

            if (!ISBN.match(isbnPattern)) {
                return res.status(400).send({
                    status: false,
                    message: "Please provide a valid isbn number",
                });
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "isbn Number is a required field" });
        }

        let isUniqueISBN = await book.findOne({ ISBN: ISBN });

        if (isUniqueISBN) {
            return res
                .status(400)
                .send({ status: false, message: "This ISBN is already being used" });
        }

        if (!category) {
            return res
                .status(400)
                .send({ status: false, message: "category is a required field" });
        } else {
            if (category.trim().length === 0) {
                return res
                    .status(400)
                    .send({ status: false, message: "category can not be empty" });
            }
        }

        if (subcategory) {
            if (subcategory.length === 0) {
                return res
                    .status(400)
                    .send({ status: false, message: "subcategory is can not be empty" });
            }

            if (Array.isArray(subcategory)) {
                let uniqueSub = [...new Set(subcategory)];
                bookData.subcategory = uniqueSub;
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "subcategory is a required field" });
        }

        if (releasedAt) {
            let datePattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/g;
            if (!releasedAt.match(datePattern)) {
                return res.status(400).send({ status: false, message: "Date format is not valid" });
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "Released date is a required field" });
        }

       
            let saveBook = await book.create(bookData);
            return res.status(201).send({
                status: true,
                message: "you book has been saved",
                data: saveBook})
        
        
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const getBook = async (req, res) => {
    try {
        let data = req.query;
        let { userId, category, subcategory } = data;
        let filter = {
            isDeleted: false,
            ...data,
        };

        if (userId) {
            let verifyuser = mongoose.isValidObjectId(userId);
            if (!verifyuser) {
                return res
                    .status(400)
                    .send({ status: false, message: "this is not a valid user Id" });
            }

            let findbyUserId = await book.findOne({ userId });
            if (!findbyUserId) {
                return res
                    .status(404)
                    .send({ status: false, message: "no books with this userId exists" });
            }
        }

        if (category) {
            let findbyCategory = await book.findOne({ category : category });
            if (!findbyCategory) {
                return res.status(404).send({
                    status: false,
                    message: "no books with this category exists",
                });
            }
        }
        if (subcategory) {
            let findbysubcategory = await book.findOne({ subcategory: subcategory });
            if (!findbysubcategory) {
                return res.status(404).send({
                    status: false,
                    message: "no books with this subcategory exists",
                });
            }
        }

        let findBook = await book
            .find(filter)
            .select({
                _id: 1,
                title: 1,
                excerpt: 1,
                userId: 1,
                catergory: 1,
                releasedAt: 1,
                reviews: 1,
            })
            .sort({ title: 1 });

        if (!findBook.length) {
            return res
                .status(404)
                .send({ status: false, message: "No books with this query exists" });
        } else {
            return res
                .status(200)
                .send({ status: true, message: "Book List", data: findBook });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const bybookId = async (req, res) => {
    try {
        let bookId = req.params.bookId;

        if (bookId) {
            let verifyBookId = mongoose.isValidObjectId(bookId);
            if (!verifyBookId) {
                return res
                    .status(400)
                    .send({ status: false, message: "this is not a valid bookId " });
            }
        } else {
            return res.status(400).send({
                status: false,
                message: "Book Id must be present in order to search it",
            });
        }

        let findBook = await book.findOne({ _id: bookId }).lean();

        if (!findBook) {
            return res.status(404).send({
                status: false,
                message: "No document exists with this book Id",
            });
        }

        if (findBook.isDeleted === true) {
            return res.status(404).send({
                status: false,
                message: "This book has been deleted by the user",
            });
        }

        let findReview = await review.find({ bookId: findBook._id, isDeleted : false });

        findBook["reviewsData"] = findReview;
        
        //if we don't use lean then we have to do this to get the expected results

        /* let details = {
                _id : findBook._id,
                title : findBook.title,
                excerpt : findBook.excerpt,
                userId : findBook.userId,
                category : findBook.category,
                subcategory : findBook.subcategory,
                deleted : false,
                reviews : findReview.length,
                deletedAt : findBook.deletedAt,
                releasedAt : findBook.releasedAt,
                createdAt : findBook.createdAt,
                updatedAt : findBook.updatedAt,
                reviewsData : findReview
            } 
    
        */

        return res
            .status(200)
            .send({ status: false, message: "Book details", data: findBook });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const updateBook = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        if (bookId) {
            let verifyBookId = mongoose.isValidObjectId(bookId);
            if (!verifyBookId) {
                return res
                    .status(400)
                    .send({ status: false, message: "this is not a valid bookId " });
            }
        } else {
            return res.status(400).send({
                status: false,
                message: "Book Id must be present in order to search it",
            });
        }

        let checkBook = await book.findOne({_id : bookId})
        
        if (!checkBook) {
            return res
                .status(404)
                .send({ status: false, message: "No book with this Id exists" });
        }
     
        if (checkBook.isDeleted) {
            return res
                .status(404)
                .send({ status: false, message: "this book has been deleted by you" });
        }

        let data = req.body;

        let findBook = await book.findOneAndUpdate(
            { _id: bookId },
            { $set: { ...data }, updatedAt: Date.now() },
            { new: true, upsert: true }
        );

            return res.status(200).send({
                status: true,
                message: "Updated successfully",
                data: findBook,
            });
        
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const deleteById = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let userId = req.query.userId;
        if (bookId) {
            let verifyBookId = mongoose.isValidObjectId(bookId);

            if (!verifyBookId) {
                return res
                    .status(400)
                    .send({ status: false, message: "this is not a valid bookId " });
            }
        } else {
            return res.status(400).send({
                status: false,
                message: "Book Id must be present in order to search it",
            });
        }

        if (userId) {
            let verifyuserId = mongoose.isValidObjectId(userId);

            if (!verifyuserId) {
                return res
                    .status(400)
                    .send({ status: false, message: "this is not a valid userId " });
            }
        } else {
            return res.status(400).send({
                status: false,
                message: "User Id must be present in order to perform this action",
            });
        }

        let findOne = await book.findOne({_id : bookId});

        if (!findOne) {
            return res.status(404).send({
                status: false,
                message: "No book are present with this book Id",
            });
        }

        if (findOne.userId != userId) {
            return res.status(401).send({
                status: false,
                message: "This book doesn't belong to you, hence you can't delete it",
            });
        }

        if (findOne.isDeleted === true) {
            return res
                .status(401)
                .send({ status: false, message: "This book has been already deleted" });
        }

        let deleteBook = await book.findOneAndUpdate(
            { _id: bookId, userId: userId },
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true, upsert: true }
        );

        if (deleteBook) {
            return res.status(400).send({
                status: false,
                message: "Your book has been deleted",
                data: deleteBook,
            });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports = { createBook, getBook, bybookId, updateBook, deleteById };
