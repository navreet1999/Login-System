const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');   // this is used to sign our JWT token
const User = require('../models/User');
const Product = require('../models/Product');


const signToken = userID =>{    //userId is primary key
    return JWT.sign({           
        iss : "NavuCoder",     //how issue this JWT TOKEN
        sub : userID
    },"NavuCoder",{expiresIn : "1h"});
}

userRouter.post('/register',(req,res)=>{
    const { username,password,role } = req.body;   //here we pull out username,password,role ffrom the req-body
    console.log(req.body);
    User.findOne({username},(err,user)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        if(user)
            res.status(400).json({message : {msgBody : "Username is already taken", msgError: true}});
        else{
            const newUser = new User({username,password,role});
            newUser.save(err=>{
                if(err)
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                else
                    res.status(201).json({message : {msgBody : "Account successfully created", msgError: false}});
            });
        }
    });
});

userRouter.post('/login',passport.authenticate('local',{session : false}),(req,res)=>{
    if(req.isAuthenticated()){
       const {_id,username,role} = req.user;
       const token = signToken(_id);

       // this below line is important for security so that JWT TOKEN is not stolen
       res.cookie('access_token',token,{httpOnly: true, sameSite:true});    // httpOnly is used to protect  to access the cookie using javascript from client sitr and  "same site" is used to protect the cross-site attack
       res.status(200).json({isAuthenticated : true,user : {username,role}});
    }
});

userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
    res.clearCookie('access_token');
    res.json({user:{username : "", role : ""},success : true});
});

userRouter.post('/product',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const product = new Product(req.body);   //mongo instance
    console.log(product);
    product.save(err=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else{
            req.user.products.push(product);
            req.user.save(err=>{
                if(err)
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                else
                    res.status(200).json({message : {msgBody : "Successfully created product", msgError : false}});
            });
        }
    })
});

userRouter.get('/products',passport.authenticate('jwt',{session : false}),(req,res)=>{
    User.findById({_id : req.user._id}).populate('products').exec((err,document)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else{
            res.status(200).json({products : document.products, authenticated : true});
        }
    });
});

userRouter.get('/admin',passport.authenticate('jwt',{session : false}),(req,res)=>{
    if(req.user.role === 'admin'){
        res.status(200).json({message : {msgBody : 'You are an admin', msgError : false}});
    }
    else
        res.status(403).json({message : {msgBody : "You're not an admin,go away", msgError : true}});
});

userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const {username,role} = req.user;
    res.status(200).json({isAuthenticated : true, user : {username,role}});
});





module.exports = userRouter;