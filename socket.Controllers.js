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
            return roomID;
        }
    }
    return null;
}
function socketHandler(io,socket) {
    socket.on('send_message',(messages,roomID) => {
        if (rooms[findIndexById(parseInt(roomID, 10))]){socket.to(parseInt(roomID,10)).emit('message',messages)}
    })

    socket.on('getRoom',(roomID,site,callback) => {
        roomIDint = parseInt(roomID, 10)
        const index = findIndexById(roomIDint)
        if (rooms[index]) {callback([rooms[index].playersDetails,rooms[index].themeSelect,rooms[index].playersReady]);}
        else {
         
            callback(null)
        }

    })

    socket.on('deleteRoom',(room_ID) => {
        const roomID = findIndexById(parseInt(room_ID, 10))
        if(roomID){
            delete rooms[roomID];
            io.to(parseInt(room_ID,10)).emit('roomDeleted');
            io.emit('lobby_changed');
        }
    })
    socket.on('new_points',(room_ID,username,points) => {
        const roomID = findIndexById(parseInt(room_ID, 10))
        if(roomID){
            const room = rooms[roomID];
            const playersDetails = room.playersDetails;

            for (let i = 0; i < playersDetails.length; i++) {
                const playerDetail = playersDetails[i];
                const playerName = playerDetail[0];
                if (playerName === username) {
                    rooms[roomID].playersDetails[i][2] = points;
                }
        }}
    })
    socket.on('getSubmitted',(room_ID,callback) => {
        const roomID = findIndexById(parseInt(room_ID,10))
        if(roomID){
            const room = rooms[roomID];
            const allSubmitted = room.playersSubmit.every((value) => value === true);
            callback(allSubmitted);
        } else {
            callback(null);
        }
    })

    socket.on('getRooms',(callback) => {
        const allPlayersDetails = [];
        for (const roomID in rooms) {
            if (Object.hasOwnProperty.call(rooms, roomID)) {
                const room = rooms[roomID];
                const playerDetails = room.playersDetails;
                allPlayersDetails.push([playerDetails,roomID]);
            }
        }
        callback(allPlayersDetails)
    })

    socket.on('kick',(roomID,username) => {
        const index = findIndexById(parseInt(roomID,10))
        if (index) {
            rooms[index].kicked.push(username);
            socket.to(rooms[index].roomID).emit('playerKicked',username,rooms[index].roomID);
            io.emit('lobby_changed');
        }
    })
    socket.on('getQuiz',(roomID,callback) => {
        const index = findIndexById(parseInt(roomID,10))
        if(index) {
        const room = rooms[index];
        callback([room.questions,room.choices,room.answers,room.theme])
        } else {callback(null)}
    })

    socket.on('join_room',(id,username,room_ID,callback) => {
        const roomID = parseInt(room_ID,10)
        if (playersInGame.includes(id) && !rooms[roomID].players.includes(id))
            {
                return callback([false,"Vous avez déja rejoins un lobby ! "])
            }

        if (rooms[roomID]) {
            if (rooms[roomID].started === false) {
                if (rooms[roomID].kicked.includes(username)) {
                    return callback([false,"Vous etes kick de cette salle !"]);
                }
                if (rooms[roomID].players.length < 5 &&  !rooms[roomID].players.includes(id)) {
                    
                    rooms[roomID].players.push(id)
                    playersInGame.push(id)
                    rooms[roomID].playersDetails.push([username,"border-transparent",0])
                    rooms[roomID].playersSubmit.push(false)
                    rooms[roomID].playersReady.push(false)
                    socket.join(rooms[roomID].roomID);
                    io.emit('lobby_changed');
                } 
                if (rooms[roomID].players.length === 5 &&  !rooms[roomID].players.includes(id)){
                    return callback([false,"Ce lobby est full! "]);
                }
                if (rooms[roomID].players.length === 5 &&  !rooms[roomID].players.includes(id)){
                    return callback([false,"Ce lobby est full! "]);
                }
                return callback([true,rooms[roomID].roomID]);
            } else { return callback([false,"La game est en cours !"]);}
        } else {
            return callback([false,"Cette Room n'existe plus"]);
        }
    })

    socket.on('disconnected',(id,room_ID,site) => {
        const roomID = findIndexById(parseInt(room_ID,10))
        if (rooms[roomID]) {
            const playerIndex = rooms[roomID].players.findIndex(playerId => playerId === id);
            playersInGame = playersInGame.filter(item => item !== id);
            socket.leave(rooms[roomID].roomID);
            if (playerIndex !== -1) {
                rooms[roomID].players.splice(playerIndex, 1);
                rooms[roomID].playersDetails.splice(playerIndex, 1);
                rooms[roomID].playersSubmit.splice(playerIndex, 1);
                rooms[roomID].playersReady.splice(playerIndex, 1);
                io.emit('lobby_changed');
            
        }} else if (playersInGame.includes(id)) {
            console.log("on a déco "+ site)
            playersInGame = playersInGame.filter(item => item !== id);
            socket.leave(parseInt(room_ID,10));
        }
        
    })

    socket.on('reset_submit',(roomID) => {
        const index = findIndexById(parseInt(roomID,10))
        if (rooms[index]){rooms[index].playersSubmit.fill(false);}
    })

    socket.on('ready',(id,roomID,callback) => {
        const room = findIndexById(parseInt(roomID,10))
        if (rooms[room]) {
            const index = rooms[room].players.indexOf(id);
            console.log(index)
            rooms[room].playersReady[index] = !rooms[room].playersReady[index];
            const allReady = rooms[room].playersReady.every((value) => value === true);
            if (allReady) {
                socket.to(parseInt(roomID,10)).emit('allReady');
                callback(true)
            }
            socket.to(parseInt(roomID,10)).emit('newReady');
            callback(false)
        }
    })

    socket.on('new_border', (roomID, username, color,callback) => {
        const index = findIndexById(parseInt(roomID,10))
        let allSubmitted = null;
        if (index) {
            const room = rooms[index];
            const playersDetails = room.playersDetails;
            for (let i = 0; i < playersDetails.length; i++) {
                const playerDetail = playersDetails[i];
                const playerName = playerDetail[0];
                if (playerName === username) {
                    rooms[index].playersDetails[i][1] = color;
                    if (color === "border-[#ADA3A1]") {
                        rooms[index].playersSubmit[i] = true;
                        console.log("submit de  "+ username)
                        console.log("Les Submits "+ rooms[index].playersSubmit)
                        allSubmitted = room.playersSubmit.every((value) => value === true);
                        if (allSubmitted) {
                            socket.to(parseInt(roomID,10)).emit('allSubmit');
                            console.log("Allsubmit send ! ")
                        }
                        
                    }
                    //console.log("La couleur du joueur", username, "dans la salle", roomID, "a été mise à jour avec", color);
                    socket.to(parseInt(roomID,10)).emit('color_changed');
                    break; 
                }
            }
        }
            if (typeof callback === 'function') {{ 
                if (allSubmitted) {callback(true)}
                else {callback(false)}
            }
        }
    
    
    });
    socket.on('create_room',(id,username,themeSelect,theme,questions,choices,answers,callback) => {
        const ingame = playersInGame.includes(id)
        console.log(ingame)
        if (!ingame){
            console.log("on est la")
            const newRoom = findNextAvailableIndex() ;
            socket.join(roomNumber)
            rooms[newRoom] = {
                roomID:roomNumber,
                players:[id],
                playersDetails:[[username,"border-transparent",0]],
                playersSubmit:[false],
                playersReady:[false],
                started:false,
                kicked:[],
                themeSelect:themeSelect,
                theme:theme,
                questions:questions,
                choices:choices,
                answers:answers
            }
            playersInGame.push(id)
            io.emit('lobby_changed');
            roomNumber += 1;
            callback(rooms[newRoom].roomID);
        } else {
            callback(null)
        }
        
        

        
    })

    socket.on('start_game', (room_ID,callback) => {
        const roomID = findIndexById(parseInt(room_ID,10))
        if (rooms[roomID]) {
            if (rooms[roomID].players.length > 1) {
                    rooms[roomID].started = true;
                    socket.to(parseInt(room_ID, 10)).emit('game_started');
                    callback(true)
            } else {
                callback(false)
            }
        }
    });
}

module.exports = socketHandler;