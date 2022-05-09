const user = require("../Models/userModel")


const creatUser = async (req,res)=>{
    try{
        const userData = req.body
        const {title, name} = userData

        if(!title){
            return sendError(res, 'title is a required field and can not be empty', 400)
        }
        
        let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,12}$/gi 
        
        if(!name.match(namePattern)){
            return sendError(res, 'this is not a valid name', 400)
        }

        let finduser = await user.findOne(data)

        if(finduser){
            return sendError(res, 'an user with this details already exists', 400)
        }
         
        let createUser = await user.create(data)
            return res.status(201).send({status : true, message : createUser})
        
    }
    catch(err){
        res.status(500).send({status : false, err : err.msg})
    }
}