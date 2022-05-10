const review = require('../models/reviewModel')

const createReview = async (req,res)=>{
    try{

    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}