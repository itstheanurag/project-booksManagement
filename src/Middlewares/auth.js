const jwt = require('jsonwebtoken')

const authenticate = (req, res)=>{
    try{
        let token = req.Headers['x-auth-key']
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}