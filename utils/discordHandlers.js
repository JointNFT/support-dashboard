const db = require("./db");


const getDiscordSettings = async (accessToken) => {
    return await db.getDiscordSettings(accessToken);
} 

const alertInSupportChannel = async (message, discordSettings, client) => {
    const channel = client.channels.cache.get(discordSettings.channelId);
    const obj = JSON.stringify(message.message);
    channel.send(obj); 
}

module.exports = {getDiscordSettings, alertInSupportChannel};