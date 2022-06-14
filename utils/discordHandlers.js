const { getDiscordIntegration } = require("./db");


const hasDiscordIntegration = async (accessToken) => {
    console.log(await getDiscordIntegration(accessToken));
    return 'test';
} 

module.exports = {hasDiscordIntegration};