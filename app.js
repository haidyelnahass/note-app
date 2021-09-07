const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = '';


app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods:['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(authRoutes);

app.use((error,req,res,next) => {
    console.log(error);

    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data
    })
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {

    app.listen(8000);
    console.log('Connected!!!!');

    // bcrypt.hash('1234',12)
    // .then(hashedPass => {
    //     const user = new User({
    //         email: 'test2@test.com',
    //         password: hashedPass,
    //         name: 'maxi'
    //     });
    
    //     return user.save();

    // })
    // .then(result => {
    //     console.log(result);
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    
})
.catch(err => {
    console.log(err);
})