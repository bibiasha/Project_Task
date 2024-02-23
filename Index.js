const express= require('express');
const route = require('./route/route.js');
const mongoose= require('mongoose');
const bodyParse= require('body-parser');

//configure route, handle HTTP route and define middle ware

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://asha:asha@cluster0.xhvp1qr.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);

app.use('/*', function (req, res) {
    return res.status(400).send({ status: false, msg: 'Page Not Found' })
 })

app.listen(3000, function () {
    console.log('Express app running on port ' +3000)
});