require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express();
const Server = require('socket.io')
const server = http.createServer( app )
const mongoose = require('mongoose')

const Document = mongoose.model('document' , require('./database/documentSchema').documentSchema )
const User = mongoose.model('user' , require('./database/userSchema').userSchema )

const io = Server(server , {
    cors : {
        origin : 'http://localhost:3000',
        method : ["GET" , "POST"]
    }
})
server.listen(process.env.REAL_TIME_PORT , ()=>{
    console.log('real time server is on at ' + process.env.REAL_TIME_PORT)
})
io.on('connection' , (socket) => {
   
    socket.on( 'send-changes' , ( delta , documentId) => {
        socket.broadcast.to( documentId ).emit( 'recieve-change' , delta );
    })

    socket.on( 'join-document-room' , async ( documentId  , memberId ) => {
        console.log(memberId)
        var data = await Document.findOne( { Id : documentId } )
        const user = await User.findOne( { Id : memberId } );

        if( data == null ){
            data = await Document.create( { Id : documentId , data : '' } );
        }
        console.log('requested to join room',documentId)
        data.activeMembers = data.activeMembers.filter((data) => {
            return data != user.Id
        })
        data.activeMembers.push( { Id : user.Id, name : user.username } );
        await data.save();
        socket.join(documentId);
        socket.emit('load-document' , data.data , data.activeMembers)
        socket.broadcast.to(documentId).emit( 'new-member-joined' , memberId , user.username )
        
    })

    socket.on('save-document' , async (documentId , documentData)  => {
        const doc = await Document.findOne({ Id : documentId })
        doc.data = documentData
        await doc.save()
    })

    socket.on( 'member-left' ,  async ( documentId , memberId ) => {
        var doc = await Document.findOne({ Id : documentId })
        doc.activeMembers = doc.activeMembers.filter((data) => {
            return data.Id != documentId
        })
        await doc.save()
        socket.broadcast.to(documentId).emit( 'member-left' , memberId);
    })

    socket.on( 'cursor-movement' , ( documentId , memberId , selection) => {
         console.log(memberId + ' moved')
        socket.to(documentId).emit( 'cursor-movement' , memberId , selection );
    })
})

mongoose.connect("mongodb://127.0.0.1:27017/Odeysey").then(() => {
    console.log('mongodb is online');
})