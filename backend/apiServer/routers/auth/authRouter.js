const express = require('express')
const authRouter = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User',require('../../database/schema/userSchema').userSchema);
const { v4: uuidv4 } = require('uuid');
const { passport } = require('./utils/passport')
const session = require('express-session');
const bcrypt = require('bcrypt');
const { sendMail } = require('./utils/sendVerification');
const { frontendURL } = require('../../global/request');

authRouter.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
}));
authRouter.use(passport.initialize());
authRouter.use(passport.session());


authRouter.get('/logout',(req,res)=>{
  if(req.isAuthenticated()==true){
    req.logOut((err)=>{
      if(err!=null){
        res.status(400).send(err);
        res.end();
    }
      res.status(200).send('signed out');
      res.end();
    });
  }
})

authRouter.get('/google',passport.authenticate('google',{successRedirect:'/auth/success',failureRedirect:'/login',scope:['profile','email']}))
authRouter.get('/github',passport.authenticate('github',{successRedirect:'/auth/success',failureRedirect:'/login',scope:['user','user:email','read:user']}))

authRouter.post('/register',async (req,res,next)=>{
  //send email from here
  const data = {...req.body.data,Id:uuidv4()};
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(data.password , 10);

  var user = null;

  user = await User.findOne({email : data.email})
  if(user == null){
    const user = await User.create({
      Id : data.Id,
      email : data.email,
      username : data.username,
      password : hashedPassword,
      verified : false,
      workspaces : []
    })
    const flag = await sendMail(data.email,data.Id);
    if(flag == true){
        res.status(200).send('Verification email sent. Please check your inbox.')
    }
    else{
        await User.deleteOne({Id:data.Id});
        res.status(200).send('Creation failed. An issue occurred.')
    }
  }
  else{
    res.status(200).send('User already exist');
  }
})

authRouter.get('/local',passport.authenticate('local',{failureRedirect:'/auth/localfailure',successRedirect:'/auth/localsuccess',failureFlash:true}
));
authRouter.get('/localsuccess',(req,res)=>{

  res.cookie('userId' ,'a' + req.user.Id ); //quick workaround
  res.status(200).send('logged in successfully!!');   

})
authRouter.get('/localfailure',(req,res)=>{
 s
  const failureMessage = req.flash('error')[0];
  res.status(201).send(failureMessage)
})
authRouter.get('/verify',async(req,res)=>{
  
  const user = await User.findOne({Id:req.query.Id})

  user.verified = true;
  await user.save();
  res.send('Verification successful.');
  
})
authRouter.get('/login',(req,res)=>{
    //fallback for all authentication
    
  })
authRouter.get('/success' , (req , res) => {
  console.log(req.isAuthenticated());
  console.log(req.user)
  res.cookie( 'userId' , 'a' + req.user.Id ); //quick workaround
  res.redirect(frontendURL)
})
authRouter.get('/status',(req,res)=>{
  res.send(req.isAuthenticated());
})

module.exports = { authRouter }
