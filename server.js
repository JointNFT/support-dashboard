const express = require("express");
const path = require('path');
const cors = require('cors');
require("dotenv").config({path: './.env'});
const chatHandlers = require("./utils/chatHandlers");
const Web3 = require("web3");
const utils = require("./utils/transactionDecoders");
const axios = require("axios");
const { start } = require("repl");


var app = express()

const w3 = new Web3(new Web3.providers.HttpProvider('https://rpcapi.fantom.network'))

// Middleware
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(cors())

const port = process.env.PORT || 3000;

var server = require('http').createServer(app)

var io = require('socket.io')(server, {
    cors: {
        origin: "*"
      }
});
var io = io.listen(server);


io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    console.log('new client connected');
    socket.emit('connection', null);
    
    socket.on('create-account', data => {
        console.log('create account', data);
        if (data == null || data.userAddress == null || data.accessToken == null) {
            return;
        }
        chatHandlers.createNewUser(data.userAddress, data.accessToken);
        io.emit('new-account', {userAddress: data.userAddress, accessToken: data.accessToken});
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
        io.emit('userDisconnected');
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
    console.log('getting users', req.query);
    const users = await chatHandlers.getUsers(req.query.accessToken);
    res.send(JSON.stringify({'users': users}));
})

app.get('/getMessages', async (req, res) => {
    
    chatMessages = await chatHandlers.getMessages(req.query.address, req.query.accessToken);
    
    res.send(JSON.stringify({'messages': chatMessages}))
})
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "./client/build")));

/*
app.get("/", (req, res) => {
    res.send("Hello World!");
});*/

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get('/transactions', async function (req, res) {
    
    let contractAddresses = req?.query?.contractAddresses.split(',');
   
    let address = req?.query?.userAddress;
    let chain = req?.query?.chain
    if (address == null) {
        res.send({'error':'Please enter the address'});
        return;
    }
    let startBlock = "0"

    const userTransactions = await utils.getTransactions(address, startBlock, chain);
    
    if (userTransactions == null) {
        res.send({'error':'couldnt fetch transactions for user'});
    }
    
    let filteredTransactions = utils.filter_for_useful_transactions(userTransactions, contractAddresses)
    
    let populatedTransactions = await utils.populateTransactions(filteredTransactions, chain);
    res.send(JSON.stringify({filteredTransactions: populatedTransactions}))
})

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});




server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
