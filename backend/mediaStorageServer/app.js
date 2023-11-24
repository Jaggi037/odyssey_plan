require('dotenv').config()
const { server } = require('./router/uploadRouter/upload')
const express = require('express')
const app = express()
const  serveRouter  = require('./router/serveRouter/serve').serverRouter
const host = '127.0.0.1' 
const port = 1080
app.use( '/serve' , serveRouter )

app.listen( process.env.SERVE_PORT , () => {
    console.log(`server is listening ${process.env.SERVE_PORT}`)
})
server.listen( { host , port } )