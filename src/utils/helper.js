module.sendError = (res, message, status=401)=>{
    res.status(status).send({status : false, message})
}