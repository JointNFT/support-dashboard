const express = require('express');
const { validateParams, TYPE } = require('../middleware/validation.middleware');
const router = express.Router();
const db = require("../utils/db");
 

router.post(
    "/updateUserTag",
    validateParams({
        body: {
            accessToken: TYPE.STRING,
            userAddress: TYPE.STRING,
            organizationId: TYPE.NUMBER,
            createdBy: TYPE.STRING,
            tag: TYPE.STRING
        }
    }),
async function (req, res, next) {
    try {
        const payload = req.body;
        const accessToken = payload.accessToken;
        const userAddress = payload.userAddress;
        const organizationId = payload.organizationId;
        const createdBy = payload.createdBy;
        const tag = payload.tag;
        //if (accessToken != "" && userAddress != "") 
        await db.updateUserTag(userAddress, accessToken, tag);
        //if (organizationId != "" && createdBy != "") 
        await db.updatePrioritizedConversations(organizationId, createdBy);
        res.send({ status: "success" });
    } catch(error) {
        next(error);
    }
});

router.post(
    "/closeConversation",
    validateParams({
        body: {
            accessToken: TYPE.STRING,
            userAddress: TYPE.STRING,
            organizationId: TYPE.NUMBER,
            createdBy: TYPE.STRING,
        }
    }),
    async function (req, res, next) {
    try {
        const payload = req.body;
        const accessToken = payload.accessToken;
        const userAddress = payload.userAddress;
        const organizationId = payload.organizationId;
        const createdBy = payload.createdBy;
        //if (accessToken != "" && userAddress != "") 
        await db.closeConversation(userAddress, accessToken);
        //if (organizationId != "" && createdBy != "")
         await db.updateClosedConversations(organizationId, createdBy);
        res.send({ status: "success" });
    } catch(error) {
        next(error);
    }
});

router.post(
    "/assignConversation",
    validateParams({
    body: {
        accessToken: TYPE.STRING,
        userAddress: TYPE.STRING,
        assignTo: TYPE.STRING,
        }
    }),
 async function (req, res) {
    try {
        var payload = req.body;
        var accessToken = payload.accessToken;
        var userAddress = payload.userAddress;
        var assignTo = payload.assignTo;
        //if (accessToken != "" && userAddress != "") 
        await db.assignConversation(userAddress, accessToken, assignTo);
        res.send({ status: "success" });
    } catch(error) {
        next(error);
    }
});

module.exports = router;