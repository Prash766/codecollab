import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)


io.on('connection' , (socket)=>{
    console.log(`Socket connected` , socket.id)

})





server.listen(process.env.PORT , ()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})