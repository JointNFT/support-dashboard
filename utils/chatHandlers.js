const { db } = require("./db");

const createUser = async (userAddress, accessToken) => {
    let dbParams = {
        TableName: "ChatUsers",
        Item: {
            userAddress: userAddress,
            accessToken: accessToken,
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

const handleCustomerMessage = async (address, message, accessToken, to, from) => {
    // check with db is thread is present
    const userAccount = await getUser(address, accessToken);
    if (userAccount == null) {
        await createUser(address, accessToken);
    }

    // create thread
    const storeMessageRes = await storeMessages(address, accessToken, message, to, from);
};

const createNewUser = async (address, accessToken) => {
    console.log("creating User", address, accessToken);
    // check with db is thread is present
    const userAccount = await getUser(address, accessToken);
    if (userAccount == null) {
        await createUser(address, accessToken);
    }
};

module.exports = { handleCustomerMessage, createNewUser, getMessages, getUsers };
