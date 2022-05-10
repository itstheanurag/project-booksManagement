const {check, validationResult} = require("express-validator")

exports.validateBook = [check('title')
    .trim()
    .not()
    .isEmpty().withMessage('title is Missing').exists(),

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
    .isEmpty().withMessage('ISBN is Missing'),
    
    check('category')
    .trim()
    .not()
    .isEmpty()
    .withMessage('category is missing')
    .isAlpha()
    .withMessage('only alphabets allowed'),

    check('subcategory')
    .trim()
    .not()
    .isEmpty()
    .withMessage('subcategory is missing')
    .isAlpha()
    .withMessage('only alphabets allowed'),

    check('reviews')
    .trim()
    .not()
    .isEmpty()
    .withMessage('subcategory is missing')
    .isNumeric()
    .withMessage('only Numeric valiue allowed'),

    check('releasedAt')
    .trim()
    .not()
    .isEmpty()
    .withMessage('released date is missing')
]

exports.bookValidated = function (req,res,next){
        const error = validationResult(req).array()
        if(!error.length) return next()

        res.status(400).send({status : false, msg: error[0].msg})
    }
