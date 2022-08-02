const express = require('express');
const router = express.Router();
const db = require("../utils/db");
 

router.post("/updateUserTag",  async function (req, res) {
    var payload = req.body;
    var accessToken = payload.accessToken;
    var userAddress = payload.userAddress;
    var tag = payload.tag;
    if (accessToken != "" && userAddress != "") await db.updateUserTag(userAddress, accessToken, tag);
    if (organizationId != "" && createdBy != "") await db.updatePrioritizedConversations(organizationId, createdBy);
    res.send({ status: "success" });
});

router.post("/closeConversation",async function (req, res) {
    var payload = req.body;
    var accessToken = payload.accessToken;
    var userAddress = payload.userAddress;
    if (accessToken != "" && userAddress != "") await db.closeConversation(userAddress, accessToken);
    if (organizationId != "" && createdBy != "") await db.updateClosedConversations(organizationId, createdBy);
    res.send({ status: "success" });
});

router.post("/assignConversation", async function (req, res) {
    var payload = req.body;
    var accessToken = payload.accessToken;
    var userAddress = payload.userAddress;
    var assignTo = payload.assignTo;
    if (accessToken != "" && userAddress != "") await db.assignConversation(userAddress, accessToken, assignTo);
    res.send({ status: "success" });
});

module.exports = router;