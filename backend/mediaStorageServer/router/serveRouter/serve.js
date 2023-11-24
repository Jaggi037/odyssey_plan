require('dotenv').config()
const express = require('express')
const serverRouter = express.Router()
const fs = require('fs')
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');

serverRouter.use(bodyParser.json())
serverRouter.use(bodyParser.urlencoded({extended:true}))
serverRouter.use(cors())
serverRouter.use(fileUpload());

serverRouter.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your client's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
    next();
});

const storagePath = 'C:/Users/lokes/Desktop/odyssey_plan/backend/storage'
serverRouter.post('/api/upload', (req, res) => {
    console.log('s')
    console.log(req.query)
    console.log(req.params)
    console.log(req.body)
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    console.log('s1')
    const uploadedFile = req.files.file;
    const uploadPath = path.join( storagePath , req.query.id + '.' + uploadedFile.mimetype.split('/')[1] );
    console.log(uploadedFile)

    fs.writeFile(uploadPath, uploadedFile.data , (err) => {
        if (err) {
        console.error('Error writing image file:', err);
        } else {
            res.send({ endpoint : '/photo' , path : req.query.id + '.' + uploadedFile.mimetype.split('/')[1] })
        console.log('Image file written successfully:', uploadPath);
        }
    })
    
    
    
      console.log('s2')
      
});

serverRouter.get('/photo' , async (req,res) => {
    console.log(req.query)
    const filePath = storagePath + '/' + req.query.id  
    console.log(filePath)
    console.log('here')
    fs.createReadStream(filePath).pipe(res)
})

serverRouter.get('/non-video' , async ( req , res ) => {
    const filePath = req.query.filePath
    const actualPath = process.env.STORAGE_DIRECTORY + '/' + filePath

    fs.createReadStream(filePath).pipe(res)

})

module.exports =  { serverRouter }