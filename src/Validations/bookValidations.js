const {check, validationResult} = require("express-validator")

exports.validateBook = [check('title')
    .trim()
    .not()
    .isEmpty().withMessage('title is Missing'),

    check('excerpt')
    .trim()
    .not()
    .isEmpty().withMessage('excerpt is missing'),

    check('userId')
    .trim()
    .not()
    .isEmpty().withMessage('User Id is missing')
    .isAlphanumeric().withMessage('userId must be an alphanumberic value'),

    check('ISBN')
    .trim()
    .not()
    .isEmpty().withMessage('ISBN is Missing')
    .matches(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/g),
    





]

exports.bookValidated = function (req,res,next){
        const error = validationResult(req).array()
        console.log(error)
        if(!error.length) return next()

        res.status(400).send({status : false, msg: error[0].msg})
    }
