const express = require("express");
const path = require('path');
const cors = require('cors');
require("dotenv").config({path: './.env'});
const chatHandlers = require("./utils/chatHandlers");
const Web3 = require("web3");
const utils = require("./utils/transactionDecoders");
const axios = require("axios");


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
        console.log('data', data);
        if (data == null || data.address == null || data.accessToken == null) {
            return;
        }
        chatHandlers.createNewUser(data.address, data.accessToken);
        io.emit('new-account', {userAddress: data.address, accessToken: data.accessToken});
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
    console.log(req.query);
    chatMessages = await chatHandlers.getMessages(req.query.address, req.query.accessToken);
    console.log(chatMessages);
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
    console.log(req.query);
    let contractAddresses = req?.query?.contractAddresses.split(',');
    console.log(contractAddresses);
    let address = req?.query?.userAddress;
    if (address == null) {
        res.send({'error':'Please enter the address'});
        return;
    }
    let apiKey = process.env.API_KEY;
    let startBlock = "34911344"

    let url="https://api.ftmscan.com/api?module=account&action=txlist&address="+address+"&startblock="+startBlock+"&endblock=99999999&sort=asc&apikey="+apiKey

    const axiosRes = await axios.get(url);
    const userTransactions = axiosRes?.data?.result;

    if (userTransactions == null) {
        res.send({'error':'couldnt fetch transactions for user'});
    }
    
    console.log(contractAddresses);
    filteredTransactions = utils.filter_for_useful_transactions(userTransactions, contractAddresses)
    res.send(JSON.stringify({filteredTransactions}))
})

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});




server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
