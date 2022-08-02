const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const chatHandlers = require("./utils/chatHandlers");
const { Client, Intents } = require("discord.js");
const Web3 = require("web3");
const utils = require("./utils/transactionDecoders");
const discord_token = process.env.DISCORD_TOKEN;
const wagmiRouter = require('./routes/wagmi-authen-route.js');
const organizationRouter = require('./routes/organization-route.js');
const chatRouter = require('./routes/chat-route.js');
const conversationRouter =  require('./routes/conversation-route.js');
const { authentication } = require('./middleware/authMiddleware.js');
const innitSocket = require('./socket')
const session = require('express-session');

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
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "./client/build")));

const port = process.env.PORT || 3000;
// Config socket
var server = require("http").createServer(app);
var io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
}).listen(server);

innitSocket(io);

// APIs
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// Chat APIs
/**
 * @description This method retrieves the static channels
 */
app.use("/chat", chatRouter);

// Conversation APIs
app.use("/conversations", authentication, conversationRouter);

// Organization APIs
app.use('/organizations', authentication, organizationRouter);

// Transaction APIs
app.get("/transactions", authentication, async function (req, res) {
    let contractAddresses = req?.query?.contractAddresses?.split(",");
    let address = req?.query?.userAddress;
    let chain = req?.query?.chain;
    console.log(address, contractAddresses, chain)
    if (!address) {
        res.send({ error: "Please enter the customer address" });
        return;
    }
    if (!contractAddresses) {
        res.send({ error: "Please enter the contract address" });
        return;
    }
    if (!chain) {
        res.send({ error: "Please choose one protocol" });
        return;
    }
    let startBlock = "0";

    const userTransactions = await utils.getTransactions(address, startBlock, chain);

    if (userTransactions == null) {
        res.send({ error: "Could not fetch transactions for user" });
    }

    let filteredTransactions = utils.filter_for_useful_transactions(userTransactions, contractAddresses);

    let populatedTransactions = await utils.populateTransactions(filteredTransactions, chain);
    res.send(JSON.stringify({ filteredTransactions: populatedTransactions }));
});

// Wagmi authentication APIs
app.use('/wagmi', wagmiRouter);

// Testing APIs
app.get("/test", authentication, (req, res) => {
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
