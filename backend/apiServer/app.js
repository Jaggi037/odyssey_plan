  // ------------- server configuration ----------------------
  require('dotenv').config();
  const cors = require('cors');
  const express = require('express');
  const app = express();
  const axios = require('axios');
  const bodyParser = require('body-parser');
  const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
  };
  app.use(cors(corsOptions));
  app.use((req, res, next) => { //allowing cross origin
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
    next();
  });
  app.use(bodyParser.json( { limit : '50mb' } ));

  const mongoose = require('mongoose');
  const User = mongoose.model('User',require('./database/schema/userSchema').userSchema);
  
  //------------------- authentication --------------------
  const session = require('express-session');
  const {authRouter} = require('./routers/auth/authRouter')
  const {passport} = require('./routers/auth/utils/passport');
  const flash = require('connect-flash')
  app.use(flash());
  app.use(session({
      secret:process.env.SESSION_SECRET,
      resave:false,
      saveUninitialized:false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  

  app.use('/auth', authRouter)
  

  //-----------------data serving--------------------------
  const dataRouter = require('./routers/dataSavers/dataRouter')
  app.use('/data' , dataRouter)

  //------------------ general all purpose end points -------
  
  app.get('/user',(req,res)=>{
    if(!req.isAuthenticated()){
        res.status(500).json({error:'not authenticated'});
    }
    else{
        res.send(req.user);
        res.end();
    }
  })
  app.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        
        res.status(200)
        res.redirect('http://localhost:3000/'); 
    }
    else{
        res.redirect('http://localhost:3000/')
    }
  })
  
// ------------------------ listening the server on endpoint's 
  app.listen(process.env.PORT||3000,()=>{
      console.log(`backend server is listening on ${process.env.port}`);
  })

  mongoose.connect("mongodb://127.0.0.1:27017/Odeysey").then(()=>{console.log("connected")});