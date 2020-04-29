const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;  //used to authenticate against the Database using username and password
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/User');     //user model is authenticating
                                            // here passport is authenticated middleware

//custom function yo extract the  JWT-TOKEN fromthe request
const cookieExtractor = req =>{      //this funx get back the req obj
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
}

// authorization 
passport.use(new JwtStrategy({
    jwtFromRequest : cookieExtractor,        //option object "cookieExtracter" is function here
    secretOrKey : "NavuCoder"                // this is the key that we asigned to the token

},(payload,done)=>{     //payload is the data that we set in the JWT TOKEN

    User.findById({_id : payload.sub},(err,user)=>{   //sub is primary key of that user
        if(err)
            return done(err,false);
        if(user)
            return done(null,user);
        else
            return done(null,false);
    });
}));

// *** sab se phle ye function truggered hota hai jab user sign krta hai with username or password or jab user authenticate ho jata hai to ek cookie create hoti  client browser pe, this cookie is JWT token
// authenticated local strategy using username and password
passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username},(err,user)=>{        // mongofunction to find with "username"
      
         // something went wrong with database
        if(err)                 
            return done(err);

        // if no user exist
        if(!user)
            return done(null,false);

        // check if password is correct
        user.comparePassword(password,done);
        
    });
}));
