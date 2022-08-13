const express = require('express');
const router = express.Router();
const chatHandlers = require("../utils/chatHandlers");
const { validateParams, TYPE } = require('../middleware/validation.middleware');

router.get("/getChannels", (req, res) => {
    res.json({
        channels: STATIC_CHANNELS,
    });
});

router.get(
    "/getUsers",
    validateParams({
        query: {accessToken: TYPE.STRING}
    }),
     async (req, res,next) => {
    try {
        console.log(req.query.accessToken);
        const users = await chatHandlers.getUsers(req.query.accessToken);
        res.statusCode = 200;
        res.send(JSON.stringify({ users: users }));
    } catch(error) {
        next(error)
    }
});

router.get(
    "/getMessages",
    validateParams({
    query: {accessToken: TYPE.STRING}
    }),
    async (req, res) => {
    try {
        console.log('here',req.query.accessToken)
        chatMessages = await chatHandlers.getMessages(req.query.address, req.query.accessToken);
        res.send(JSON.stringify({ messages: chatMessages }));
    } catch(error) {
        next(error)
    }
   
});

module.exports = router;