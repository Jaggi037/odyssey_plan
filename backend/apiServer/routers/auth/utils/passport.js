const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStartegy = require('passport-github2').Strategy;
const { sendMail } = require('./sendVerification');

const axios = require('axios')
const mongoose = require('mongoose');
const User = mongoose.model('User',require('../../../database/schema/userSchema').userSchema);


passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:8000/auth/google",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },async(accesstoken,refreshtoken,profile,done)=>{
        //these accesstoken and refreshtoken cannot be used by us so that's a problem
        console.log(profile);
        var user=await User.findOne({email:profile.emails[0].value});
    
        if(user==null){
          await User.create({Id:profile.id,username:profile.displayName,email:profile.emails[0].value,profilePic:profile.photos[0].value , workspaces : []}); 
        }
        user=await User.findOne({email:profile.emails[0].value});
        user.profilePic=profile.photos[0].value;
        
        await user.save();
        return done(null,user);
  
  }));
  
passport.use(new GithubStartegy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/github",
  userEmailURL:'https://api.github.com/user/emails'
},
async(accesstoken,refreshtoken,profile,done)=>{
  //these accesstoken and refreshtoken cannot be used by us so that's a problem
  console.log(profile)
  const headers = {
    'Authorization': 'token '+accesstoken,
  };
  const res = await axios.get('https://api.github.com/user/emails',{
    headers : headers,
  })
  console.log(res.data)
  let i=0;
  for(i=0;i<res.data.length;i++){
    if(res.data[i].primary==true){
      break
    }
  }
  const userEmail = res.data[i].email;
  var user = await User.findOne({email:userEmail});

  if(user == null){
    await User.create({Id:profile.id,username:profile.username,email:userEmail,profileURL:profile.profileUrl,profilePic : profile.photos[0].value,workspaces : []}); 
  }
  user = await User.findOne({Id:profile.id});
  console.log(user)
  console.log(user.profilePic)
  console.log(user.profileURL)
  user.profileURL = profile.profileUrl;
  user.profilePic = profile.photos[0].value;
  await user.save();
  return done(null,user);
}))  

passport.use(new LocalStrategy({usernameField:'username',passwordField:'password'},async (username,password,done)=>{
  try{
    const user=await User.findOne({username:username});
    console.log("here");
    if( user == null ){
        done(null,false,{message:"Invalid Username or Password"});
    }
    else{
      const flag = await bcrypt.compare(password,user.password);
      if(flag && user.verified){
        done(null,user);
      }
      else{
        if(user.verified == false){
         
            const flag = await sendMail(user.email , user.Id);
            if(flag==false){
                done(null,false,{message : "Verification Email Sent!"});
            }
            else{
                done(null,false,{message : "Email verification failed. Please try again later."})
            }
        }
        else{
          done(null,false,{message:"Incorrect Password"});
        }  
      }   
    }  
}
catch{
    done(null,false,{message:"Something went wrong."});
}
}));

passport.serializeUser((user,done)=>{
  done(null,user._id);
});
passport.deserializeUser(async (userid,done)=>{
  const user=await User.findOne({_id:userid});
  return done(null,user);
})

module.exports = { passport }