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

const SERVER = "https://dashboard.highfi.me";

var app = express();
app.use(express.json());

app.use(express.static("public"));

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

var sockets = { support: {}, customers: {} };

io.on("connection", (socket) => {
    // socket object may be used to send specific messages to the new connected client

    socket.emit("connection", (data) => {
        // experimental , we want to move to setting up the account during the connection ideally.
        if ("type" in data && data.type == "support") {
            if (!(data.accessToken in sockets.support)) {
                sockets.support[data.accessToken] = {};
            }
            sockets.support[data.accessToken][data.userAddress] = socket.id;
        } else {
            if (!(data.accessToken in sockets.customers)) {
                sockets.customers[data.accessToken] = {};
            }
            sockets.customers[data.accessToken][data.userAddress] = socket.id;
        }
    });

    socket.on("test", (arg) => {
        socket.emit("response", "online");
    });

    socket.on("create-account", (data) => {
        if (data == null || data.userAddress == null || data.accessToken == null) {
            return;
        }
        if (data.type != "support") {
            chatHandlers.createNewUser(data.userAddress, data.accessToken);
        }
        if ("type" in data && data.type == "support") {
            if (!(data.accessToken in sockets.support)) {
                sockets.support[data.accessToken] = {};
            }
            sockets.support[data.accessToken][data.userAddress] = socket.id;
        } else {
            if (!(data.accessToken in sockets.customers)) {
                sockets.customers[data.accessToken] = {};
            }
            sockets.customers[data.accessToken][data.userAddress] = socket.id;
        }
        for (supportStaff in sockets.support[data.accessToken]) {
            io.to(sockets.support[data.accessToken][supportStaff]).emit("new-account", data);
        }
        io.to(socket.id).emit("new-account", data);
        
    });

    socket.on("send-message", (data) => {
        if (data == null || data.accessToken == null || data.message == null || data.to == null) {
            io.emit("message", "errored out");
        }
        chatHandlers.handleCustomerMessage(data.address, data.message, data.accessToken, data.to, data.from);
        // chatHandlers.pushToDiscord(data, client);
        let customer = (data.to == "support") ? data.from: data.to;
        
        if (sockets.customers[data.accessToken]) io.to(sockets.customers[data.accessToken][customer]).emit("message", data);
        
        for (supportStaff in sockets.support[data.accessToken]) {
            io.to(sockets.support[data.accessToken][supportStaff]).emit("message", data);
        }
        
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

app.post("/updateUserTag", async function (req, res) {
    var payload = req.body;
    var accessToken = payload.accessToken;
    var userAddress = payload.userAddress;
    var tag = payload.tag;
    if (accessToken != "" && userAddress != "") await db.updateUserTag(userAddress, accessToken, tag);
    res.send({ status: "success" });
});

app.post("/createOrganization", s3.uploadLogo.single("imageURL"), async function (req, res) {
    var name = req.body.organizationName;
    var createdBy = req.body.createdBy;
    var organizationId = +new Date();

    await db.addNewOrganizationStaff(organizationId, createdBy);

    var addressList = [];
    addressList[0] = createdBy;

    if (req.body.address != null) {
        var address = req.body.address.count;

        if (typeof address === "string") {
            var addressString = address.toLowerCase();
            addressList[1] = addressString;
            await db.addNewOrganizationStaff(organizationId, addressString);
        } else if (typeof address === "object") {
            for (let i = 0; i < address.length; i++) {
                let addressString = address[i].toLowerCase();
                addressList[i + 1] = address[i]
                await db.addNewOrganizationStaff(organizationId, addressString);
            }
        }
    }
    await db.addNewOrganization(name, JSON.stringify(addressList), req.file.location, organizationId, createdBy);

    res.send('<script>alert("Organization added"); window.location.href = "/"; </script>');
});
app.get("/getOrganizationDetails", async (req, res) => {
    var address = req.query.address;
    var details = await db.getStaffDetails(address);
    var organizationDetails = [];
    if (details.length == 0) {
        //res.send({"organizationDetails":[{"image":"https://the-organization-logo.s3.ap-south-1.amazonaws.com/imageURL-1657204373546","organizationId":1657204374938,"address":"\"0xe95c4707ecf588dfd8ab3b253e00f45339ac3054,0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054\"","createdBy":"0xe95c4707ecf588dfd8ab3b253e00f45339ac3054","name":"Test","accessToken":"some-token"}]});
        res.send({ organizationDetails: organizationDetails });
    } else {
        for (var i = 0; i < details.length; i++) {
            var organizationId = details[i].organizationId;
            organizationDetails[i] = await db.getOrganizationDetails(organizationId);
        }
       // organizationDetails.push({"image":"https://the-organization-logo.s3.ap-south-1.amazonaws.com/imageURL-1657204373546","organizationId":1657204374938,"address":"\"0xe95c4707ecf588dfd8ab3b253e00f45339ac3054,0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054\"","createdBy":"0xe95c4707ecf588dfd8ab3b253e00f45339ac3054","name":"Test","accessToken":"some-token"})
        res.send({ organizationDetails: organizationDetails });
    }
});

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
