const { default: mongoose } = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const userSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : true,
        madatory : true
    }
})