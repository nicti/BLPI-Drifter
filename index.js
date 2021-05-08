const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const dotenv = require('dotenv').config().parsed;
const { GoogleSpreadsheet } = require('google-spreadsheet');

const esi = axios.create({
    baseURL: 'https://esi.evetech.net',
});
const doc = new GoogleSpreadsheet(dotenv.GOOGLE_SHEET);
let rows = [];

client.on('message',async (message) => {
    if (message.content.startsWith('<@!'+client.user.id+'>')) {
        let fullCommand = message.content.replace('<@!'+client.user.id+'> ','');
        let command = fullCommand.split(' ')[0];
        message.channel.startTyping();
        switch (command) {
            case 'show':
                let show = fullCommand.replace('<@!'+client.user.id+'> ','').replace('show ','');
                if (show.length < 3) {
                    await message.channel.send('Region name must be at least 3 characters long.');
                    break;
                }
                let searchResults = (await esi.get('/v2/search/?categories=region&datasource=tranquility&language=en&strict=false&search='+show)).data.region;
                if (typeof searchResults === "undefined") {
                    await message.channel.send('Could not find region matching `'+show+'`.');
                    break;
                }
                if (searchResults.length > 1) {
                    await message.channel.send('Search resulted in several hits, please specify.');
                    break;
                }
                let region = (await esi.get('/v1/universe/regions/'+searchResults[0]+'/')).data;
                await doc.loadInfo();
                const drifterSheet = doc.sheetsByIndex[1];
                rows = await drifterSheet.getRows();
                const regionJoveData = rows.find(v => v._rawData[2] === region.name );
                let regionalJoveSystems = [];
                for (let i = 3; i < (regionJoveData._rawData.length-1); i++) {
                    regionalJoveSystems.push(regionJoveData._rawData[i]);
                }
                await message.channel.send('https://evemaps.dotlan.net/map/'+regionJoveData._rawData[0]+'/'+regionalJoveSystems.join(':'));
                break;
            case 'search':
                await message.channel.send('To be implemented');
                break;
        }
        message.channel.stopTyping();
    }
});
client.login(dotenv.BOT_TOKEN).then(async () => {
    await doc.useApiKey(dotenv.GOOGLE_API);
});