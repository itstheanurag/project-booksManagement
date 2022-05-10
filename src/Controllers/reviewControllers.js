const review = require('../models/reviewModel')
const mongoose = require("mongoose")
const book = require("../Models/bookModel")
const user = require("../Models/userModel")

const createReview = async (req,res)=>{
    try{
         let bookId = req.params.bookId
         let data =  req.body

         if(!bookId){
             return res.status(400).send({status : false, message : 'bookId is not present'})
         }

         let validateBookId = mongoose.isValidObjectId(bookId)
         if(!validateBookId){
            return res.status(400).send({status : false, message : 'this is not a valid book Id'})
         }

         let findBook =  await book.findOne(bookId)
         if(!findBook){
            return res.status(400).send({status : false, message : 'no books with this Books id'})
         }

         if(findBook.isDeleted){
            return res.status(400).send({status : false, message : 'This book has been deleted'})
         }
        
        let {review, rating, reviewedBy} = data
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}