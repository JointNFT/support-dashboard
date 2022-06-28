const AWS = require("aws-sdk");

// Update AWS config
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY, // Do NOT HARD-CODE your secret credentials here
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Do NOT HARD-CODE your secret credentials here
    region: "ap-south-1",
});

// Create DynamoDB service object
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "latest" });

const updateUser = async (userAddress, accessToken, lastMessage = {}) => {
    let dbParams = {
        TableName: "ChatUsers",
        Item: {
            userAddress: userAddress,
            accessToken: accessToken,
            lastMessage: lastMessage,
        },
    };

    let response = await db.put(dbParams).promise();
    console.log("response", await response);
    return await response;
};


const getUser = async (userAddress, accessToken) => {
    const params = {
        TableName: "ChatUsers",
        KeyConditionExpression: "userAddress = :pkey and accessToken = :skey",
        ExpressionAttributeValues: {
            ":pkey": userAddress,
            ":skey": accessToken,
        },
    };
    const res = await db.query(params).promise();
    const resPayload = await res;
    const user = resPayload.Items != [] ? resPayload.Items[0] : null;
    return user;
};

const getUsers = async (accessToken) => {
    const params = {
        TableName: "ChatUsers",
        IndexName: "accessToken-userAddress-index",
        KeyConditionExpression: "accessToken = :skey",
        ExpressionAttributeValues: {
            ":skey": accessToken,
        },
    };
    const res = await db.query(params).promise();
    const resPayload = await res;
    const user = resPayload.Items != [] ? resPayload.Items : null;
    return user;
};

const getDiscordSettings = async (accessToken) => {
    const params = {
        TableName: "DiscordIntegration",
        KeyConditionExpression: "accessToken = :pkey",
        ExpressionAttributeValues: {
            ":pkey": accessToken,
        },
    };
    const res = await db.query(params).promise();
    const resPayload = await res;
    const discordServerId = resPayload.Items != [] ? resPayload.Items[0] : null;
    return discordServerId;
};

const storeMessages = async (userAddress, accessToken, message, to, from) => {
    const params = {
        TableName: "SupportMessages",
        Item: {
            userAddress: userAddress,
            timestamp: +new Date(),
            accessToken: accessToken,
            from: from,
            to: to,
            message: message,
        },
    };
    let response = await db.put(params).promise();
    response = await updateUser(userAddress, accessToken, params.Item);
    return await response;
};

const getMessages = async (userAddress, accesToken) => {
    const params = {
        TableName: "SupportMessages",
        KeyConditionExpression: "userAddress = :pkey",
        FilterExpression: "accessToken= :aToken",
        ExpressionAttributeValues: {
            ":pkey": userAddress,
            ":aToken": accesToken,
        },
    };
    const res = await db.query(params).promise();
    const messages = (await res)?.Items;
    return messages;
};

const updateUserTag = async (userAddress, accessToken, newTag) => {
    let dbParams = {
        TableName: "ChatUsers",
        Item: {
            userAddress: userAddress,
            accessToken: accessToken,
            tag: newTag, 
        },
    };

    let response = await db.put(dbParams).promise();
    console.log("response", await response);
    return await response;
};

const addNewOrganization = async (organizationName, address, image) => {
    let dbParams = {
        TableName: "Organizations",
        Item: {
            identifier: address,
            organizationId: JSON.stringify(+new Date()) ,
            createdBy: address,
            image: image,
            name: organizationName,
        },
    };

    let response = await db.put(dbParams).promise();
    return await response;
};
module.exports = { getMessages, storeMessages, getUser, getUsers, updateUser, getDiscordSettings, db, updateUserTag, addNewOrganization };
