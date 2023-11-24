const mongoose=require('mongoose');

const workspaceSchema = mongoose.Schema(
    {
        Id : String ,
        folderStructure : String ,
        accessType : String,
        icon : String,
        name : String,
    }
)

module.exports = { workspaceSchema }