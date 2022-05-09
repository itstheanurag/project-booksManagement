const {check, validationResult} = require("express-validator")

exports.validateAuthor = [check('title')
    .trim()
    .not()
    .isEmpty().withMessage('title is Missing')
    .isLength({ min: 2, max: 4 })
    .withMessage(' titile must be within 2 to 4 characters long').isIn(['Mr', 'Mrs', 'Miss']).withMessage('title must be Mr, Mrs, Miss'),
    
    check('name') 
    .trim()
    .not()
    .isEmpty().withMessage('First Name is Missing')
    .isLength({ min: 3, max: 12 })
    .withMessage('Invalid First Name, Name must be within 3 to 12 characters long'),

    check('phone')
    .trim()
    .not()
    .isEmpty().withMessage('Phone number is missing')
    .isLength({equal : 10}),

    check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is Invalid'),

    check('password')
    .trim()
    .not()
    .isEmpty().withMessage('password is Missing')
    .isLength({ min: 8, max: 15})
    .withMessage(' Password must be within 8 to 15 characters long')]

exports.validate = function (req,res,next){
        const error = validationResult(req).array()
        if(!error.length) return next()

        res.status(400).send({status : false, msg: error[0].msg})
    }
