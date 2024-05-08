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

const io = require('socket.io')(server);
//const io = new Server(server,{cors:{origin: 'http://localhost:3000'}});

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
server.listen(process.env.PORT || 5004,() => {
    console.log("Serveur actif ... "+process.env.PORT+" port")
})