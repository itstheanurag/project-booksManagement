const jwt = require('jsonwebtoken')
const secretKey = "Gr34t mind5 think 4like"

const authenticate = (req, res, next)=>{
    try{
        let token = req.headers['x-auth-key']

        if(!token){
            return res.status(400).send({status : false, message : "You are not Logged in Please logIn"})
        }
      
        let decodeToken = jwt.verify(token, secretKey)

        if(!decodeToken){
            return res.status(400).send({status : false, message : "Token validation failed"})
        }

        next()
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}

//=======================

const authorization = (req, res, next)=>{
    try{
        let token = req.headers['x-auth-key']

        if(!token){
            return res.status(400).send({status : false, message : "You are not Logged in Please logIn"})
        }

        let decodeToken = jwt.verify(token, secretKey)

        if(!decodeToken){
            return res.status(400).send({status : false, message : "Token validation failed"})
        }

        let userId = req.body.userId || req.query.userId || req.params.userId

        if(!userId){
            return res.status(400).send({status : false, message : "userId must be present to do this action"})
        }

        if(userId != decodeToken.userId){
            return res.status(401).send({status : false, message : "you are not authorized to do this"})
        }

        next()
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}


module.exports = {authenticate, authorization}