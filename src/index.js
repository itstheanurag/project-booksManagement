const express = require('express');
const bodyParser = require('body-parser');
const route = require('./Routes/route.js');
// const dotenv = require('dotenv').config()
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://itstheanurag:gaurav9878764239@cluster0.dirde.mongodb.net/BookManagement-Group9", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
