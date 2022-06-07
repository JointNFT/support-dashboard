const express = require("express");
const path = require('path');
const cors = require('cors');
require("dotenv").config({path: './.env'});
const chatHandlers = require("./utils/chatHandlers");


var app = express()

// Middleware
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(cors())

const port = process.env.PORT || 3000;

var server = require('http').createServer(app)

var io = require('socket.io')(server, {
    cors: {
        origin: "highfy-chat-client.herokuapp.com/"
      }
});
var io = io.listen(server);

var STATIC_CHANNELS = [{
    name: 'Global chat',
    participants: 0,
    id: 1,
    sockets: []
}, {
    name: 'Funny',
    participants: 0,
    id: 2,
    sockets: []
}];


io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    console.log('new client connected');
    socket.emit('connection', null);
    socket.on('channel-join', id => {
        console.log('channel join', id);
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return id;
    });

    socket.on('create-account', data => {
        console.log('data', data);
        if (data == null || data.address == null || data.accessToken == null) {
            return;
        }
        chatHandlers.createNewUser(data.address, data.accessToken);
    });
    
    socket.on('send-message', data => {
        console.log(data);
        if (data == null || data.accessToken == null || data.message == null || data.to == null) {
            io.emit('message', 'errored out');
        }
        chatHandlers.handleCustomerMessage(data.address, data.message, data.accessToken, data.to, data.from);
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c);
            }
        });
    });

});

/**
 * @description This methos retirves the static channels
 */
app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});

app.get('/getUsers', async (req, res) => {
    const users = await chatHandlers.getUsers(req.query.accessToken);
    res.send(JSON.stringify({'users': users}));
})

app.get('/getMessages', async (req, res) => {
    console.log(req.query);
    chatMessages = await chatHandlers.getMessages(req.query.address, req.query.accessToken);
    console.log(chatMessages);
    res.send(JSON.stringify({'messaegs': chatMessages}))
})

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});


server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
