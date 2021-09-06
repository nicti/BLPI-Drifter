import {Client, Intents, Message, Snowflake} from "discord.js";
import axios from "axios";
import JoveStorage from "../Storage/JoveStorage";
import { config } from 'dotenv-flow';
import Commands from "../Discord/Commands";
import Pings from "../Bot/Pings";
import FAS from "../Storage/FAS";
import AdvancedLogger from "../utils/AdvancedLogger";

config();

const logger = new AdvancedLogger();
const esi = axios.create({
    baseURL: 'https://esi.evetech.net',
});
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
    ],
    partials: [
        'CHANNEL',
        'MESSAGE',
        'REACTION'
    ]
});
const joveStorage = new JoveStorage(esi, logger);
const fas = new FAS(joveStorage);
const pings = new Pings(logger);
(async () => {
    await joveStorage.resetOutdated();
    await fas.reindex();
})();
const commandHandler = new Commands(client, esi, joveStorage, fas, logger, pings);

client.once('ready', () => {
    setInterval(async () => {
        let data = await pings.statusAll(client);
        let esiHealth = Math.round(((data.esiHealth.green/data.esiHealth.total)*100))+'%';
        let dateObj = new Date();
        let dateString = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
            ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + dateObj.getUTCSeconds().toString().padStart(2,'0') + ' UTC';
        let fasCount = fas.getLength();
        //TODO: Fix status not set
        let name = `ESI Ping: ${data.esiPing} | ESI Health: ${esiHealth} | Discord Ping: ${data.discordPing}ms | Discord Health: ${data.discordHealth} | Index: ${fasCount} entries | Updated: ${dateString}`;
        client.user?.setActivity({
            type: 'WATCHING',
            name: name
        });
        client.user?.setPresence({
            activities: [
                {
                    type: 'WATCHING',
                    name: name
                }
            ]
        })
        let a = 'b';
    },1000*60);
});


client.on('messageCreate', async (message: Message) => {
    const botClientId: Snowflake | undefined = client.user?.id;
    if (message.author.id !== botClientId && message.channel.type !== "DM" && process.env.LOGGING === "true") {
        logger.logChat(`[${message.channel.guild.name}:${message.channel.guild.id}][${message.channel.name}:${message.channel.id}][${message.author.username}:${message.author.id}:${message.member?.nickname}]: ${message.content}`);
    }
    if (typeof botClientId === "undefined") {
        logger.error('Bot Client ID is not defined! The bot likely did not connect to discord correctly!');
        return;
    }
    if (message.author.id === botClientId) {
        return;
    }
    if (process.env.NODE_ENV === "production" && message.channel.type === 'DM') {
        await message.channel.send('Please only contact me via registered channels!');
        return;
    }
    if (typeof process.env.ALLOWED_CHANNELS === "undefined") {
        logger.error('ALLOWED_CHANNELS has to be defined in .env!');
        return;
    }
    if (process.env.NODE_ENV === "production" && !process.env.ALLOWED_CHANNELS.split(',').includes(message.channel.id)) {
        return;
    } else if (process.env.NODE_ENV === "develop" && message.channel.type !== 'DM') {
        return;
    }
    //Get group id by server to also accept group mention
    let role = message.guild?.roles.cache.find((r) => r.name === client.user?.username);
    if (message.content.startsWith('<@!' + botClientId + '>') ||
        message.content.startsWith('<@' + botClientId + '>') ||
        (typeof role !== 'undefined' && message.content.startsWith('<@&'+role.id+'>'))) {
        return commandHandler.processMessage(message);
    }
});
client.login(process.env.BOT_TOKEN).catch(logger.error);