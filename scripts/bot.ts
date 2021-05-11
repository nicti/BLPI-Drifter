import { Client, MessageEmbed } from "discord.js";
import axios from "axios";
import JoveStorage from "../Storage/JoveStorage";
import {config} from "dotenv";
config();

const client = new Client();

const esi = axios.create({
    baseURL: 'https://esi.evetech.net',
});
const joveStorage = new JoveStorage();
joveStorage.resetOutdated();

client.on('message',async (message) => {
    if (message.author.id === client.user.id) {
        return;
    }
    if (message.channel.type === 'dm') {
        await message.channel.send('Please only contact me via registered channels!');
        return;
    }
    if (!process.env.ALLOWED_CHANNELS.split(',').includes(message.channel.id)) {
        return;
    }
    if (message.content.startsWith('<@!'+client.user.id+'>')) {
        let fullCommand = message.content.replace('<@!'+client.user.id+'> ','');
        let command = fullCommand.split(' ')[0];
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
                let regionName = region.name.replaceAll(' ','_');
                await joveStorage.resetOutdated();
                let joveRegionalInfo = await joveStorage.getForRegion(regionName);
                let str = '';
                let link = [];
                for (const key in joveRegionalInfo) {
                    if (joveRegionalInfo.hasOwnProperty(key)){
                        link.push(key);
                        let systems = '';
                        systems = joveRegionalInfo[key].whs.join(',');
                        if (systems === '') systems = '-';
                        let date;
                        if (joveRegionalInfo[key].updated === '') {
                            date = '';
                        } else {
                            let dateObj = new Date(joveRegionalInfo[key].updated);
                            date = dateObj.getUTCFullYear().toString()+'-'+(dateObj.getUTCMonth()+1)+'-'+(dateObj.getUTCDate())+
                                ' '+dateObj.getUTCHours().toString()+':'+dateObj.getUTCMinutes().toString()+' UTC';
                        }
                        str += key+': '+systems+' ['+date+']\n';
                    }
                }
                await message.channel.send(region.name+':```'+str+'```https://evemaps.dotlan.net/map/'+regionName+'/'+link.join(':'));
                break;
            case 'set':
                let set = fullCommand.replace('<@!'+client.user.id+'> ','').replace('set ','');
                if (set.match(/ /g).length != 1) {
                    await message.channel.send('Your message did not follow the pattern. Usage: `@BLPI Drifter set <system> <pipe split drifter letters>`')
                    break;
                }
                let system, whs;
                [system,whs] = set.split(' ');
                let result = await joveStorage.setWHs(system,whs.split('|'));
                if (result === true) {
                    await message.react('✅');
                } else if (typeof result === 'string') {
                    await message.reply(result);
                }
                break;
            case 'search':
                await message.channel.send('To be implemented');
                break;
            case 'loadDataFromGoogle':
                let reactiveMsg = await message.reply('Are you sure you want to reload all the data? This will delete saved data!');
                await reactiveMsg.react('✅');
                await reactiveMsg.react('❎');
                reactiveMsg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❎'),
                    { max: 1, time: 30000 }).then(async collected => {
                    if (collected.first().emoji.name == '✅') {
                        await reactiveMsg.reactions.removeAll();
                        await joveStorage.importFromGoogle();
                        await reactiveMsg.edit('~~Are you sure you want to reload all the data? This will delete saved data!~~ **Done!**');
                    }else if (collected.first().emoji.name == '❎') {
                        await reactiveMsg.edit('~~Are you sure you want to reload all the data? This will delete saved data!~~ **Aborted!**');
                        await reactiveMsg.reactions.removeAll();
                    }
                }).catch(() => {
                    reactiveMsg.delete();
                });
                break;
            case 'help':
            default:
                let embed = new MessageEmbed()
                    .setTitle('Commands')
                    .addFields(
                        {name: 'show <region>', value: 'Shows drifter info for a certain region.'},
                        {name: 'set <system> <pipe split drifter identifier>', value: 'Sets drifter info for a certain system. Use letter for WH identifier. Concat - for EOL/crit. E.g.: `C|C-`'},
                        {name: 'loadDataFromGoogle', value: 'Reloads jove system list from public spreadsheet.'}
                    );
                await message.channel.send(embed);
                break;
        }
    }
});
client.login(process.env.BOT_TOKEN).then();