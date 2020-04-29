const express = require('express');
const app = express();
const cookieParser = require('cookie-parser'); //when the user is aunthenticated this given a token which is set 
                                               //as a cookie within the client browser and every request afterwards this send cookie to us
const mongoose = require('mongoose');
app.use(cookieParser());
app.use(express.json());

const port = 5000;



//const uri = process.env.ATLAS_URI;
mongoose.connect('mongodb+srv://Sidharth:Sidharth@cluster0-jc0gi.mongodb.net/test?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);

const connection = mongoose.connection; 
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const userRouter = require('./routes/User');
app.use('/user',userRouter);

app.listen(5000,()=>{
    console.log('express server started');
});