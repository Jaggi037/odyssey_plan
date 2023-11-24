const express = require('express')
const dataRouter = express.Router()

const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const documentSchema = require('../../database/schema/documentSchema').documentSchema
const workspaceSchema = require('../../database/schema/workspaceSchema').workspaceSchema 
const userSchema = require('../../database/schema/userSchema').userSchema

const Workspace = mongoose.model('Workspace' , workspaceSchema)
const Doc = mongoose.model('Documents' , documentSchema)
const User = mongoose.model('User' , userSchema)

dataRouter.use( bodyParser.json({limit : '50mb'}) )
dataRouter.use( bodyParser.urlencoded({extended : true}) )

dataRouter.post('/saveContent' ,async (req,res) => {
    
    try{
        var doc = await Doc.findOne({Id : req.body.data.databaseId })
       
        if( doc == null ){
            await Doc.create( { 
                Id : req.body.data.databaseId ,
                data : req.body.data.content , 
                type : req.body.data.filetype
            } )
        }
        else{
            doc.data = req.body.data.content
            doc.metaData = req.body.data.metaData
            await doc.save()
        }
        res.status(200)
    }
    catch ( e ){
        res.status(400)
    }
    res.end()
})

dataRouter.get('/getContent' , async (req,res)=>{

    var doc = await Doc.findOne({Id : req.query.databaseId})
    if( doc == null ){
        res.status(201)   //201 flag here represent's use default data
    }
    else{
        res.status(200).send({ 
            data : doc.data , 
            type : doc.type , 
            metaData : doc.metaData==null?{}:doc.metaData
        })
    }
    res.end()
})

dataRouter.get('/getFolder' , async (req , res) => {
    let Id = req.query.workspaceId;
    if( Id == 'personal' ){
        Id = req.user.id
    }
   
    const data = await Workspace.findOne( {Id : Id} )
    if( data == null){
        res.status(201)
    }
    else{
        res.status(200).send({ data : data })
    }
    res.end()
})
var count = 0;
dataRouter.post('/saveFolder' , async ( req , res ) => {
    try{
        console.log(count++)
        let Id = req.body.data.workspaceId
      
        if ( Id == 'personal' ){
            Id = req.user.id
        }
        var fol = await Workspace.findOne({Id : Id })
        if( fol == null ){
            await Workspace.create( { 
                Id : Id ,
                folderStructure : req.body.data.content ,
            } )
        }
        else{
            fol.folderStructure = req.body.data.content
            await fol.save()
        }
        res.status(200)
    
        res.end()
    }   
    catch(e){
        res.status(400)
        console.log(e)
    } 
   
})

dataRouter.post('/createWorkspace' , async (req,res) => {
    // add the workspace ID to user's workspace array
    // this same array would be used to check if a user has access to a specific workspace
    try{
       
        const user = await User.findOne({Id : req.user.Id})
        
        const accessType = req.body.data.accessType
        const name = req.body.data.name
        const icon = req.body.data.icon
        const  workspaceId = req.body.data.workspaceId
        await Workspace.create({
            Id : workspaceId ,
            accessType : accessType,
            name : name,
            icon : icon ,
            folderStructure : '[[]]'
        })
        user.workspaces = [ ...user.workspaces , workspaceId ]
        await user.save()
        res.status(200).send({workspaceId : workspaceId})
    }
    catch (e) {
        cosole.log(e)
        res.status(400)
    }
   
})
dataRouter.get('/getWorkspaces' , async (req , res)=> {
    const workSpaceIdArray = req.user.workspaces
    
    res.status(200).send({ workSpaceIdArray : workSpaceIdArray })
   
})
dataRouter.post('/addWorkspace' , async (req , res) => {
  
    const user = await User.findOne({Id : req.user.Id})
    user.workspaces = [ ...user.workspaces , req.body.data.workspaceId ]
    await user.save()
    res.status(200)
})
module.exports = dataRouter