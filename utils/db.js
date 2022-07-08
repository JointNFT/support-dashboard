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

const updateUserTag = async (address, token, newTag) => {
    let dbParams = {
        TableName: "ChatUsers",
        ExpressionAttributeNames: {
            "#tag": "tag",
        },
        Key: {
            userAddress: address,
            accessToken: token,
        },
        UpdateExpression: 'set #tag = :newTag',
        ExpressionAttributeValues: {
            ':newTag': newTag
        },
    };

    let response = await db.update(dbParams).promise();
    console.log("response", await response);
    return await response;
};

const addNewOrganization = async (organizationName, address, image, organizationId, createdBy) => {
    let dbParams = {
        TableName: "Organization",
        Item: {
            organizationId: organizationId,
            address: address,
            image: image,
            name: organizationName,
            accessToken: makeAccessToken(24),
            createdBy: createdBy
        },
    };

    let response = await db.put(dbParams).promise();
    return await response;
};

const getStaffDetails = async (userAddress) => {
    var address = userAddress;
    const params = {
        TableName: "OrganizationStaff",
        KeyConditionExpression: "address = :address",
        ExpressionAttributeValues: {
            ":address": address,
        }
    }
    const res = await db.query(params).promise();
    const details = (await res)?.Items;
    return details;
}

const getOrganizationDetails = async (organizationId) => {
    const params = {
        TableName: "Organization",
        KeyConditionExpression: "organizationId = :organizationId",
        ExpressionAttributeValues: {
            ":organizationId": organizationId,
        }
    }
    const res = await db.query(params).promise();
    const OrganizationDetails = (await res)?.Items;
    return OrganizationDetails;
}

const makeAccessToken = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


const addNewOrganizationStaff = async (organizationId, address) => {

    let dbParams = {
        TableName: "OrganizationStaff",
        Item: {
            organizationId: organizationId,
            address: address,
        },
    };

    let response = await db.put(dbParams).promise();
    return await response;
};
module.exports = {
    getMessages, storeMessages, getUser, getUsers, updateUser, getDiscordSettings, updateUserTag, 
    addNewOrganization, addNewOrganizationStaff, getStaffDetails, getOrganizationDetails
};
