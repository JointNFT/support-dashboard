const express = require('express');
const router = express.Router();
const chatHandlers = require("../utils/chatHandlers");

router.get("/getChannels", (req, res) => {
    res.json({
        channels: STATIC_CHANNELS,
    });
});

router.get("/getUsers", async (req, res) => {
    console.log(req.query.accessToken);
    const users = await chatHandlers.getUsers(req.query.accessToken);
    res.statusCode = 200;
    res.send(JSON.stringify({ users: users }));

});

router.get("/getMessages", async (req, res) => {
    console.log('here',req.query.accessToken)
    chatMessages = await chatHandlers.getMessages(req.query.address, req.query.accessToken);
    res.send(JSON.stringify({ messages: chatMessages }));
});

module.exports = router;