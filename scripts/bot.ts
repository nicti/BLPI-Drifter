import {Client, Message, MessageEmbed, Snowflake} from "discord.js";
import axios from "axios";
import JoveStorage from "../Storage/JoveStorage";
import {config} from "dotenv";
import Commands from "../Discord/Commands";
import Pings from "../Bot/Pings";

config();
const client = new Client();
const joveStorage = new JoveStorage();
joveStorage.resetOutdated().then();
const esi = axios.create({
    baseURL: 'https://esi.evetech.net',
});
const commandHandler = new Commands(client, esi, joveStorage);

(async () => {
})();
setInterval(async () => {
    let data = await Pings.statusAll(client);
    let esiHealth = Math.round(((data.esiHealth.green/data.esiHealth.total)*100))+'%';
    let dateObj = new Date();
    let dateString = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
        ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + dateObj.getUTCSeconds().toString().padStart(2,'0') + ' UTC';
    client.user?.setActivity({
        type: 'WATCHING',
        name: `ESI Ping: ${data.esiPing} | ESI Health: ${esiHealth} | Discord Ping: ${data.discordPing}ms | Discord Health: ${data.discordHealth.description} | Updated: ${dateString}`
    });
},1000*60);


client.on('message', async (message: Message) => {
    const botClientId: Snowflake | undefined = client.user?.id;
    if (typeof botClientId === "undefined") {
        console.error('Bot Client ID is not defined! The bot likely did not connect to discord correctly!');
        return;
    }
    if (message.author.id === botClientId) {
        return;
    }
    if (process.env.NODE_ENV === "production" && message.channel.type === 'dm') {
        await message.channel.send('Please only contact me via registered channels!');
        return;
    }
    if (typeof process.env.ALLOWED_CHANNELS === "undefined") {
        console.error('ALLOWED_CHANNELS has to be defined in .env!');
        return;
    }
    if (process.env.NODE_ENV === "production" && !process.env.ALLOWED_CHANNELS.split(',').includes(message.channel.id)) {
        return;
    } else if (process.env.NODE_ENV === "develop" && message.channel.type !== 'dm') {
        return;
    }
    if (message.content.startsWith('<@!' + botClientId + '>')) {
        return commandHandler.processMessage(message);
    }
});
client.login(process.env.BOT_TOKEN).then(async () => {
    let data = await Pings.statusAll(client);
    let esiHealth = Math.round(((data.esiHealth.green/data.esiHealth.total)*100))+'%';
    let dateObj = new Date();
    let dateString = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
        ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + dateObj.getUTCSeconds().toString().padStart(2,'0') + ' UTC';
    client.user?.setActivity({
        type: 'WATCHING',
        name: `ESI Ping: ${data.esiPing} | ESI Health: ${esiHealth} | Discord Ping: ${data.discordPing}ms | Discord Health: ${data.discordHealth} | Updated: ${dateString}`
    });
}).catch(console.error);