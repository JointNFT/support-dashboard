const db = require("./db");
const { QueryDbError } = require('../middleware/error.middleware');


const getDiscordSettings = async (accessToken) => {
    try {
        return await db.getDiscordSettings(accessToken); 
    } catch(error) {
        throw new QueryDbError(error);
    }
} 

const alertInSupportChannel = async (message, discordSettings, client) => {
    const channel = client.channels.cache.get(discordSettings.channelId);
    const obj = JSON.stringify(message.message);
    channel.send(obj); 
}

module.exports = {getDiscordSettings, alertInSupportChannel};