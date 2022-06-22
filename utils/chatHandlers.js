const { getMessages, storeMessages, getUser, getUsers, updateUser, updateUserTag } = require("./db");
const { getDiscordSettings, alertInSupportChannel } = require("./discordHandlers");

const handleCustomerMessage = async (address, message, accessToken, to, from) => {
    // check with db is thread is present
    const userAccount = await getUser(address, accessToken);
    if (userAccount == null) {
        await updateUser(address, accessToken);
    }

    // create thread
    const storeMessageRes = await storeMessages(address, accessToken, message, to, from);
};
const createNewUser = async (address, accessToken) => {
    console.log("creating User", address, accessToken);
    // check with db is thread is present
    const userAccount = await getUser(address, accessToken);
    if (userAccount == null) {
        await updateUser(address, accessToken);
    }
};

const pushToDiscord = async (message, client) => {
    const discordSettings = await getDiscordSettings(message.accessToken);
    console.log(discordSettings);
    if (discordSettings.type == "basic") {
        alertInSupportChannel(message, discordSettings, client);
    }
    // check if discord integrations is present 
        // if discord integrations is present and channel is present 
            // get channel
        // else if channel is not present for user 
            // create new channel 
            // store channel
        // push message
    // if integrations is missing
        // ignore 

    
}

module.exports = { handleCustomerMessage, createNewUser, getMessages, getUsers, pushToDiscord };
