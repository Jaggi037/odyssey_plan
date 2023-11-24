require('dotenv').config()
const {Server,EVENTS} = require('@tus/server') 
const {FileStore} = require('@tus/file-store') 
const fs=require('fs');
const server = new Server({
  path: '/storage',
  datastore: new FileStore({directory: '../storage'}), 
  
})

server.on(EVENTS.POST_FINISH,async(req,res,upload)=>{//EVENTS contains all the event's on this server
  try{
      await fs.rename( 'C:/Users/lokes/Desktop/odyssey_plan/backend/storage'+ '/' + upload.id , 'C:/Users/lokes/Desktop/odyssey_plan/backend/storage' + '/'+ upload.id + '.'+upload.metadata.filetype.split('/')[1],(e)=>{
        console.log(e)
      });
      console.log( upload.id + '.'+upload.metadata.filetype.split('/')[1] )
      console.log(res)
  }
  catch(e){
     console.log(e);
  }
})

module.exports = { server }