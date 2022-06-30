const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const chatHandlers = require("./utils/chatHandlers");
const { Client, Intents } = require("discord.js");
const Web3 = require("web3");
const utils = require("./utils/transactionDecoders");
const db = require("./utils/db");
const s3 = require("./utils/s3");
const axios = require("axios");
const { start } = require("repl");
const discord_token = process.env.DISCORD_TOKEN;
const multer  = require('multer');
const upload = multer({ dest: 'images' })
const SERVER = 'http://localhost:3000/';

var app = express();
app.use(express.json());

const w3 = new Web3(new Web3.providers.HttpProvider("https://rpcapi.fantom.network"));

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(discord_token);
client.on("ready", () => {
    console.log("client is ready");
});

// Middleware
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(cors());

const port = process.env.PORT || 3000;

var server = require("http").createServer(app);

var io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
}).listen(server);

var sockets = {};

io.on("connection", (socket) => {
    // socket object may be used to send specific messages to the new connected client
    
    socket.emit("connection", null);

    socket.on("test", (arg) => {
        socket.emit("response", "online");
    });

    socket.on("create-account", (data) => {
        // console.log("create account", data);
        if (data == null || data.userAddress == null || data.accessToken == null) {
            return;
        }
        console.log('does it even reach here ?');
        if (data.userAddress != 'support'){
            chatHandlers.createNewUser(data.userAddress, data.accessToken);
        }
        io.emit("new-account", {
            userAddress: data.userAddress,
            accessToken: data.accessToken,
        });
        sockets[data.userAddress] = socket.id;
        io.to('support').emit("new-account", data);
    });

    socket.on("send-message", (data) => {
        if (data == null || data.accessToken == null || data.message == null || data.to == null) {
            io.emit("message", "errored out");
        }
        chatHandlers.handleCustomerMessage(data.address, data.message, data.accessToken, data.to, data.from);
        chatHandlers.pushToDiscord(data, client);
        io.to(socket.id).emit("message", data);
        io.to(sockets[data.to]).emit("message", data);
        // io.to(data.userAddress).emit("message", data);
        // io.emit("message", data);
    });

    socket.on("disconnect", () => {
        io.emit("userDisconnected");
    });

    socket.on("connect", (d) => {
        console.log("connected", d);
    });
});

/**
 * @description This methos retirves the static channels
 */
app.get("/getChannels", (req, res) => {
    res.json({
        channels: STATIC_CHANNELS,
    });
});

app.get("/getUsers", async (req, res) => {
    console.log(req.query.accessToken);
    const users = await chatHandlers.getUsers(req.query.accessToken);
    res.send(JSON.stringify({ users: users }));
});

app.get("/getMessages", async (req, res) => {
    chatMessages = await chatHandlers.getMessages(req.query.address, req.query.accessToken);
    res.send(JSON.stringify({ messages: chatMessages }));
});
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "./client/build")));

/*
app.get("/", (req, res) => {
    res.send("Hello World!");
});*/

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/updateUserTag",async function(req, res){
    var payload = req.body
    var accessToken = payload.accessToken
    var userAddress = payload.userAddress
    var tag = payload.tag
    if (accessToken != '' && userAddress != '')
        await db.updateUserTag(userAddress, accessToken, tag)
    res.send({'status': 'success'});
});

app.post('/createOrganization', upload.single('imageURL'), async function (req, res) {
    var name = req.body.organizationName
    var address = JSON.stringify(req.body.address.count)
    var imageURL = SERVER + req.file.path
    var organizationId = +new Date()
    
    var logoKey = await s3.uploadImage(imageURL, address);
    await db.addNewOrganization(name, address, logoKey, organizationId)  
    for(let i=0; i<req.body.address.count.length; i++ ){
        await db.addNewOrganizationStaff(organizationId, req.body.address.count[i])
    }
    res.send('<script>alert("Organization added"); window.location.href = "/"; </script>');
});
app.get('/getOrganizationDetails', async (req, res) =>{
    var details = await db.getStaffDetails('address');
    var organizationId = details[0].organizationId

    var organizationDetails = await db.getOrganizationDetails(organizationId);
    console.log(organizationDetails);
    res.send('done');
} )

app.get("/transactions", async function (req, res) {
    let contractAddresses = req?.query?.contractAddresses.split(",");

    let address = req?.query?.userAddress;
    let chain = req?.query?.chain;
    if (address == null) {
        res.send({ error: "Please enter the address" });
        return;
    }
    let startBlock = "0";

    const userTransactions = await utils.getTransactions(address, startBlock, chain);

    if (userTransactions == null) {
        res.send({ error: "couldnt fetch transactions for user" });
    }

    let filteredTransactions = utils.filter_for_useful_transactions(userTransactions, contractAddresses);

    let populatedTransactions = await utils.populateTransactions(filteredTransactions, chain);
    res.send(JSON.stringify({ filteredTransactions: populatedTransactions }));
});

app.get("/test", (req, res) => {
    chatHandlers.pushToDiscord(
        {
            accessToken: "some-token",
            message: "need help",
            to: "support",
            from: "0xe95",
            userAddress: "0xe95",
        },
        client
    );
    res.send("hehe");
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
