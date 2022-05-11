const review = require('../models/reviewModel')
const mongoose = require("mongoose")
const book = require("../models/bookModel")
const user = require("../models/userModel")

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

         let findBook =  await book.findOne({bookId})
         if(!findBook){
            return res.status(400).send({status : false, message : 'no books with this Books id'})
         }

         if(findBook.isDeleted){
            return res.status(400).send({status : false, message : 'This book has been deleted'})
         }

         if(!data.rating){
            return res.status(400).send({status : false, message : 'rating is a required field'})
        }

        if(!(data.rating <= 5 && data.rating >= 1)){
            return res.status(400).send({status : false, message : 'please provide a valid rating'})
        }

        if(!data.reviewedBy){
            return res.status(400).send({status : false, message : 'reviewers Name is a required field'})
        }

        if(data.reviewedBy.trim().length === 0){
            return res.status(400).send({status : false, message : 'reviewers name can not be empty'})
        }
        
        
        let details = {
            bookId : findBook._id,
            reviewedBy : data.reviewedBy,
            reviewedAt : Date.now(),
            rating : data.rating,
            review : data.review
        }

        if(await review.exists({$and :[{data}, {bookId}]})){
            return res.status(400).send({status : false, message : 'a review with this details already exists, please update it'})
        }
       


        let reviewCreated = await review.create(details)
        
        if(reviewCreated){
           
            await book.findOneAndUpdate({_id : bookId}, {$inc : {reviews : 1}}, {new : true, upsert : true})   
        }

        return res.status(201).send({status : true, message : "Review published", data :details })
     
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}



const updateReview = async(req,res)=>{
    try{
        let data =  req.body
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if(!bookId){
            return res.status(400).send({status : false, message : 'bookId is not present'})
        }

        let validateBookId = mongoose.isValidObjectId(bookId)

        if(!validateBookId){
           return res.status(400).send({status : false, message : 'this is not a valid book Id'})
        }

        if(!reviewId){
            return res.status(400).send({status : false, message : 'reviewId is not present'})
        }

        let validatereviewId = mongoose.isValidObjectId(reviewId)
        if(!validatereviewId){
           return res.status(400).send({status : false, message : 'this is not a valid review Id'})
        }
        
        let findBook = await book.find({bookId})

        if(!findBook){
            return res.status(404).send({status : false, message : "A book with this id does not exists"})
        }

        if(findBook.isDeleted){
            return res.status(404).send({status : false, message : "This book has been deleted"})
        }

        let findReview = await review.findOne({reviewId})

        if(!findReview){
            return res.status(404).send({status : false, message : "A review with this id does not exists"})
        }

        if(findReview.isDeleted){
            return res.status(404).send({status : false, message : "This review has been deleted"})
        }

        let updateReview = await review.findOneAndUpdate({_id : reviewId}, {$set :{...data}}, {new : true, upsert : true})

        if(updateReview) return res.status(200).send({status : false, message : "review updated successfully", data : updateReview})


    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}


const deleteReviewById = async(req,res)=>{
    try{

        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if(!bookId){
            return res.status(400).send({status : false, message : 'bookId is not present'})
        }

        let validateBookId = mongoose.isValidObjectId(bookId)

        if(!validateBookId){
           return res.status(400).send({status : false, message : 'this is not a valid book Id'})
        }

        if(!reviewId){
            return res.status(400).send({status : false, message : 'reviewId is not present'})
        }

        let validatereviewId = mongoose.isValidObjectId(reviewId)
        if(!validatereviewId){
           return res.status(400).send({status : false, message : 'this is not a valid review Id'})
        }
        
        let findBook = await book.find({bookId})

        if(!findBook){
            return res.status(404).send({status : false, message : "A book with this id does not exists"})
        }

        if(findBook.isDeleted){
            return res.status(404).send({status : false, message : "This book has been deleted"})
        }

        let findReview = await review.findOne({reviewId})

        if(!findReview){
            return res.status(404).send({status : false, message : "A review with this id does not exists"})
        }

        if(findReview.isDeleted){
            return res.status(404).send({status : false, message : "This review has been deleted"})
        }

        let deletetheReview = await review.findOneAndUpdate({_id : reviewId}, {$set : {isDeleted : true}, deletedAt : Date.now()}, {new : true, upsert : true})
        
        if(deletetheReview){
         await book.findOneAndUpdate({_id : bookId}, {$inc : {reviews : -1}}, {new : true, upsert : true})
        }

        return res.status(200).send({status : true, message : 'review has been deleted', data : deletetheReview})
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}


module.exports = {createReview, updateReview, deleteReviewById}