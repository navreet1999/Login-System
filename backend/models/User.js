const mongoose = require('mongoose');  
const bcrypt = require('bcrypt');          //used to hash the password

const UserSchema = new mongoose.Schema({   //user table k attributes
    username :{
        type : String,
        required : true,
        min : 6,
        max : 15
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user','admin'],
        required: true
    },
    //array of product  and here objectId is the primary key
    products : [{type : mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

//MONGOS PRE-HOOK -> this fuction is triggered before the password save bcz
// we need to the hash password before we actucally save it into a DB

//mongoose version of middleware
UserSchema.pre('save',function(next){
    if(!this.isModified('password'))     //yha check kr rhe hai whether we need to hash or not
        return next();                   //here we checking if the  password field within the document has been modified already
                                         //if yes that means there is no need to hash the password
                                         // we have to need to hash the password only if it is PLAIN-TEXT

    bcrypt.hash(this.password,10,(err,passwordHash)=>{     // callback function is used to get back the password that is hashed
        if(err)                                            // **** yha arrow function ki bjaye simple is liye use kiya bcz we want to access this. _____ *****
            return next(err);
        this.password = passwordHash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password,cb){    // this fxn is required bcz we need to compare the PLAIN-TEXT version of
                                                               // the password with that we recived from the client to the hashed version within our database 
    bcrypt.compare(password,this.password,(err,isMatch)=>{     // here password is the first argument(pass in)password from the client  
        if(err)                                                // second argument is the hashed password and third argument is callback fxn
            return cb(err);                
        else{
            if(!isMatch)                  //excute if the password we get is not matched with password which is present in th database
                return cb(null,isMatch);
            return cb(null,this);          //successfull user
        }
    });
}

module.exports = mongoose.model('User',UserSchema);