const {check, validationResult} = require("express-validator")

exports.validateReview = [check('bookId')
    .trim()
    .not()
    .isEmpty().withMessage('bookId is Missing')
    .isAlphanumeric().withMessage('bookId must be an alphanumberic value'),

    check('reviewedBy')
    .trim()
    .not()
    .isEmpty().withMessage('reviewedBy is missing'),

    check('rating')
    .trim()
    .not()
    .isEmpty().withMessage('rating is missing'),

    check('review')
    .trim()
    .not()
    .isEmpty().withMessage('review is Missing'),
   
    
]

exports.reviewValidated = function (req,res,next){
        const error = validationResult(req).array()
        if(!error.length) return next()

        res.status(400).send({status : false, msg: error[0].msg})
    }
