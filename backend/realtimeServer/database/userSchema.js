const mongoose=require('mongoose');


const userSchema = new mongoose.Schema({
    username:String,
    Id:String,
    password:String,
    email:String,
    profilePic:String,//just have the file path
    profileURL:String,
    verified:Boolean,
})

module.exports = {userSchema}