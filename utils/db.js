const AWS = require("aws-sdk");
const { QueryDbError } = require("../middleware/error.middleware");

// Update AWS config
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY, // Do NOT HARD-CODE your secret credentials here
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Do NOT HARD-CODE your secret credentials here
    region: "ap-south-1",
});

// Create DynamoDB service object
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "latest" });

const updateUser = async (userAddress, accessToken, lastMessage = {}) => {
    try {
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
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const getUser = async (userAddress, accessToken) => {
    try {
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
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const getUsers = async (accessToken) => {
    try {
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
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const getDiscordSettings = async (accessToken) => {
    try {
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
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const storeMessages = async ({address, accessToken, message, timestamp,  photoUrl, to, from}) => {
    try {
        const params = {
            TableName: "SupportMessages",
            Item: {
                userAddress: address,
                timestamp,
                accessToken,
                photoUrl,
                from,
                to,
                message,
            },
        };
        let response = await db.put(params).promise();
        response = await updateUser(address, accessToken, params.Item);
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const getMessages = async (userAddress, accesToken) => {
    try {
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
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const updateUserTag = async (address, token, newTag) => {
    try {
        let dbParams = {
            TableName: "ChatUsers",
            ExpressionAttributeNames: {
                "#tag": "tag",
            },
            Key: {
                userAddress: address,
                accessToken: token,
            },
            UpdateExpression: "set #tag = :newTag",
            ExpressionAttributeValues: {
                ":newTag": newTag,
            },
        };

        let response = await db.update(dbParams).promise();
        console.log("response", await response);
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const closeConversation = async (address, token) => {
    try {
        let dbParams = {
            TableName: "ChatUsers",
            ExpressionAttributeNames: {
                "#status": "status",
            },
            Key: {
                userAddress: address,
                accessToken: token,
            },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeValues: {
                ":status": "closed",
            },
        };

        let response = await db.update(dbParams).promise();
        console.log("response", await response);
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const assignConversation = async (userAddress, token, assignedTo) => {
    try {
        let dbParams = {
            TableName: "ChatUsers",
            ExpressionAttributeNames: {
                "#assignedTo": "assignedTo",
            },
            Key: {
                userAddress: userAddress,
                accessToken: token,
            },
            UpdateExpression: "set #assignedTo = :assignedTo",
            ExpressionAttributeValues: {
                ":assignedTo": assignedTo,
            },
        };

        let response = await db.update(dbParams).promise();
        console.log("response", await response);
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const addNewOrganization = async (organizationName, address, image, organizationId, createdBy, staff) => {
    try {
        var initialValues = { staff: 0, closed: 0, prioritized: 0, customers: 0, totalConversations: 0 };
        let dbParams = {
            TableName: "Organization",
            Item: {
                organizationId: organizationId,
                createdBy: createdBy,
                addresses: address,
                image: image,
                name: organizationName,
                accessToken: makeAccessToken(24),
                staff: staff,
                closed: 0,
                prioritized: 0,
                totalConversations: 0,
                initialValues: initialValues,
            },
        };

        let response = await db.put(dbParams).promise();
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const updateClosedConversations = async (organizationId, createdBy) => {
    try {
        let dbParams = {
            TableName: "Organization",
            ExpressionAttributeNames: {
                "#closed": "closed",
            },
            Key: {
                organizationId: organizationId,
                createdBy: createdBy,
            },
            UpdateExpression: "ADD #closed :closed",
            ExpressionAttributeValues: {
                ":closed": 1,
            },
        };

        let response = await db.update(dbParams).promise();
        console.log("response", await response);
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const updatePrioritizedConversations = async (organizationId, createdBy) => {
    try {
        let dbParams = {
            TableName: "Organization",
            ExpressionAttributeNames: {
                "#prioritized": "prioritized",
            },
            Key: {
                organizationId: organizationId,
                createdBy: createdBy,
            },
            UpdateExpression: "ADD #prioritized :prioritized",
            ExpressionAttributeValues: {
                ":prioritized": 1,
            },
        };

        let response = await db.update(dbParams).promise();
        console.log("response", await response);
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const getSmartContracts = async (protocolId) => {
    try {
        const params = {
            TableName: "SmartContractDetails",
            KeyConditionExpression: "protocolId = :pkey",
            ExpressionAttributeValues: {
                ":pkey": protocolId,
            },
        };
        const res = await db.query(params).promise();
        const smartContracts = (await res)?.Items;
        return smartContracts;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const updateTotalConversations = async (organizationId, createdBy) => {
    try {
        let dbParams = {
            TableName: "Organization",
            ExpressionAttributeNames: {
                "#totalConverations": "totalConversations",
            },
            Key: {
                organizationId: organizationId,
                createdBy: createdBy,
            },
            UpdateExpression: "ADD #totalConversations :totalConversations",
            ExpressionAttributeValues: {
                ":totalConversations": 1,
            },
        };

        let response = await db.update(dbParams).promise();
        console.log("response", await response);
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const getStaffDetails = async (userAddress) => {
    try {
        var address = userAddress;
        const params = {
            TableName: "OrganizationStaff",
            KeyConditionExpression: "address = :address",
            IndexName: "address-organizationId-index",
            ExpressionAttributeValues: {
                ":address": address,
            },
        };
        const res = await db.query(params).promise();
        const details = (await res)?.Items;
        return details;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const getOrganizationDetails = async (organizationId) => {
    try {
        const params = {
            TableName: "Organization",
            KeyConditionExpression: "organizationId = :organizationId",
            ExpressionAttributeValues: {
                ":organizationId": organizationId,
            },
        };
        const res = await db.query(params).promise();
        const OrganizationDetails = (await res)?.Items;
        return OrganizationDetails[0];
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const makeAccessToken = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const addNewOrganizationStaff = async (organizationId, address) => {
    try {
        let dbParams = {
            TableName: "OrganizationStaff",
            Item: {
                organizationId: organizationId,
                address: address,
            },
        };

        let response = await db.put(dbParams).promise();
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const updateOrganization = async (organizationName, addresses, image, organizationId, createdBy, staff) => {
    try {
        let dbParams = {
            TableName: "Organization",
            Key: {
                organizationId: parseInt(organizationId),
                createdBy,
            },
            UpdateExpression: `set #nameOrg = :orgName, addresses = :orgAddresses, staff = :orgStaff${image ? ", image = :orgImage" : ""}`,
            ExpressionAttributeNames: { "#nameOrg": "name" },
            ExpressionAttributeValues: {
                ":orgName": organizationName,
                ":orgAddresses": addresses,
                ":orgStaff": staff,
            },
            ReturnValues: "ALL_NEW",
        };
        if (image) {
            dbParams = {
                ...dbParams,
                ExpressionAttributeValues: {
                    ":orgName": organizationName,
                    ":orgAddresses": addresses,
                    ":orgImage": image,
                    ":orgStaff": staff,
                },
            };
        }
        let response = await db.update(dbParams).promise();
        return await response;
    } catch (error) {
        throw new QueryDbError(error);
    }
};
const getStaffs = async (organizationId) => {
    try {
        const params = {
            TableName: "OrganizationStaff",
            KeyConditionExpression: "organizationId = :organizationId",
            ExpressionAttributeValues: {
                ":organizationId": organizationId,
            },
        };
        const res = await db.query(params).promise();
        const staffs = (await res)?.Items;
        console.log(staffs);
        return staffs;
    } catch (error) {
        throw new QueryDbError(error);
    }
};
const deleteOrganizationStaffs = async (list) => {
    try {
        const params = {
            RequestItems: {
                OrganizationStaff: [],
            },
        };
        list.forEach((a) => {
            params.RequestItems.OrganizationStaff.push({
                DeleteRequest: {
                    Key: {
                        organizationId: a.organizationId,
                        address: a.address,
                    },
                },
            });
        });
        await db.batchWrite(params).promise();
    } catch (error) {
        throw new QueryDbError(error);
    }
};

const updateOrganizationStaffs = async (list) => {
    try {
        const params = {
            RequestItems: {
                OrganizationStaff: [],
            },
        };
        list.forEach((a) => {
            params.RequestItems["OrganizationStaff"].push({
                PutRequest: {
                    Item: { ...a },
                },
            });
        });
        await db.batchWrite(params).promise();
    } catch (error) {
        throw new QueryDbError(error);
    }
};
module.exports = {
    getMessages,
    storeMessages,
    getUser,
    getUsers,
    updateUser,
    getDiscordSettings,
    updateUserTag,
    addNewOrganization,
    addNewOrganizationStaff,
    getStaffDetails,
    getOrganizationDetails,
    assignConversation,
    closeConversation,
    updateClosedConversations,
    updatePrioritizedConversations,
    updateTotalConversations,
    getStaffs,
    updateOrganizationStaffs,
    deleteOrganizationStaffs,
    updateOrganization,
    getSmartContracts,
};
