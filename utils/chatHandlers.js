const { getMessages, storeMessages, getUser, getUsers, updateUser, updateTotalConversations, updateUserTag } = require("./db");
const { getDiscordSettings, alertInSupportChannel } = require("./discordHandlers");
const { s3 } = require('./s3');
const S3_BUCKET = 'photo-messages';


const handleCustomerMessage = async ({address, message, attachment, timestamp, accessToken, to, from}) => {
    // check with db is thread is present
    const userAccount = await getUser(address, accessToken);
    if (userAccount == null) {
        await updateUser(address, accessToken);
    }
    // create thread
    let photoUrl = '';
    if(attachment?.file && attachment?.name) {
        const uploadedImage = await s3.upload({
            Bucket: S3_BUCKET,
            Key: `${attachment.name}-${Date.now()}`,
            Body: attachment.file,
          }).promise();
          photoUrl = uploadedImage.Location;
    }
    const data = {address,accessToken, message, timestamp, photoUrl, to, from}
    storeMessages(data);
     
    return data;
};

const createNewUser = async (address, accessToken) => {
    console.log("creating User", address, accessToken);
    // check with db is thread is present
    var totalConversations = 22; //change
    const userAccount = await getUser(address, accessToken);
    if (userAccount == null) {
        await updateUser(address, accessToken);
        // await updateTotalConversations(organizationId, createdBy);
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
