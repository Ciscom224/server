const express= require("express");
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const userRoutes=require('./routes/user.routes');
const quizRoutes=require("./routes/quiz.routes.js")
const { Server } = require('socket.io');
const { createServer } = require('http');

require('dotenv').config({path:' .env'})
require('./db.js')
const {verifyUser, requireAuth}=require('./middleware/auth.middleware.js')
const cors =require('cors');
const socketHandler = require("./socket.Controllers.js");
const app=express();
const server = createServer(app);
app.use(cors({origin:process.env.URL_CLIENT,credentials:true}));
//app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//Pour Socket

const io = new Server(server,{cors:{origin:process.env.URL_CLIENT}});
//const io = new Server(server,{cors:{origin: 'http://localhost:3000'}});
const rooms = {};
let playersInGame = [];
let roomNumber = 1;

function findNextAvailableIndex() {
    const roomIDs = Object.keys(rooms).map(id => parseInt(id, 10));
    let nextIndex = 0;
    while (roomIDs.includes(nextIndex)) {
        nextIndex++;
    }
    return nextIndex;
}
function findIndexById(id) {
    for (const roomID in rooms) {
        const room = rooms[roomID];
        if (room.roomID === id) {
            (roomID)
            return roomID;
        }
    }
    return null;
}

io.on('connection',(socket) => {
    socketHandler(io,socket);
    
})

app.use(bodyParser.json()) 
app.use(cookieParser())

// jwt 
app.get('*',verifyUser)
app.get('/jwtid',requireAuth,(req,res)=>{
    res.status(201).send(res.locals.user._id);
})
//Les routes 
app.use('/api/user',userRoutes);
app.use('/api/quiz',quizRoutes);
// lancement du server
server.listen(process.env.PORT,() => {
    console.log("Serveur actif ... "+process.env.PORT+" port")
})