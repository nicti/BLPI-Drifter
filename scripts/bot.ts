import {Client, MessageEmbed, Snowflake} from "discord.js";
import axios from "axios";
import JoveStorage from "../Storage/JoveStorage";
import {config} from "dotenv";
config();
const client = new Client();

const esi = axios.create({
    baseURL: 'https://esi.evetech.net',
});
const joveStorage = new JoveStorage();
joveStorage.resetOutdated().then();


client.on('message',async (message) => {
    const botClientId: Snowflake|undefined = client.user?.id;
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
    if (message.content.startsWith('<@!'+botClientId+'>')) {
        let fullCommand = message.content.replace('<@!'+botClientId+'> ','');
        let command = fullCommand.split(' ')[0];
        switch (command) {
            case 'show':
                let show = fullCommand.replace('<@!'+botClientId+'> ','').replace('show ','');
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
                let regionName = region.name.replace(/ /g,'_');
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
                            date = dateObj.getUTCFullYear().toString()+'-'+(dateObj.getUTCMonth()+1).toString().padStart(2,'0')+'-'+(dateObj.getUTCDate()).toString().padStart(2,'0')+
                                ' '+dateObj.getUTCHours().toString().padStart(2,'0')+':'+dateObj.getUTCMinutes().toString().padStart(2,'0')+' UTC';
                        }
                        str += key+': '+systems+' ['+date+']\n';
                    }
                }
                await message.channel.send(region.name+':```'+str+'```https://evemaps.dotlan.net/map/'+regionName+'/'+link.join(':'));
                break;
            case 'set':
                let set = fullCommand.replace('<@!'+botClientId+'> ','').replace('set ','');
                if (set.match(/ /g)?.length != 1) {
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
            case 'find':
                let find = fullCommand.replace('<@!'+botClientId+'> ','').replace('find ','').toUpperCase();
                if (!JoveStorage.WHS.includes(find)) {
                    await message.reply('Insert correct wh type please: B,C,V,S,R');
                    return;
                }
                let results = await joveStorage.findByType(find);
                let stableReturns = [];
                let unstableReturns = [];
                let dateObj: Date;
                for (let i = 0; i < results.stable.length; i++) {
                    let result = results.stable[i];
                    dateObj = new Date(result.updated);
                    stableReturns.push(result.system+" - "+result.region+" ["+dateObj.getUTCFullYear().toString()+'-'+(dateObj.getUTCMonth()+1).toString().padStart(2,'0')+'-'+(dateObj.getUTCDate()).toString().padStart(2,'0')+
                        ' '+dateObj.getUTCHours().toString().padStart(2,'0')+':'+dateObj.getUTCMinutes().toString().padStart(2,'0')+' UTC'+"]");
                }
                for (let i = 0; i < results.unstable.length; i++) {
                    let result = results.unstable[i];
                    dateObj = new Date(result.updated);
                    unstableReturns.push(result.system+" - "+result.region+" ["+dateObj.getUTCFullYear().toString()+'-'+(dateObj.getUTCMonth()+1).toString().padStart(2,'0')+'-'+(dateObj.getUTCDate()).toString().padStart(2,'0')+
                        ' '+dateObj.getUTCHours().toString().padStart(2,'0')+':'+dateObj.getUTCMinutes().toString().padStart(2,'0')+' UTC'+"]");
                }
                let resultMessage: string = "";
                if (stableReturns.length === 0 && unstableReturns.length === 0) {
                    resultMessage = "No "+find+" WHs found!";
                }
                if (stableReturns.length > 0) {
                    resultMessage += 'Stable '+find+' WHs:```'+stableReturns.join("\n")+'```';
                }
                if (unstableReturns.length > 0) {
                    resultMessage += 'Unstable '+find+' WHs:```'+unstableReturns.join("\n")+'```';
                }
                await message.channel.send(resultMessage);
                break;
            case 'loadDataFromGoogle':
                let reactiveMsg = await message.reply('Are you sure you want to reload all the data? This will delete saved data!');
                await reactiveMsg.react('✅');
                await reactiveMsg.react('❎');
                reactiveMsg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❎'),
                    { max: 1, time: 30000 }).then(async collected => {
                    if (collected.first()?.emoji.name == '✅') {
                        await reactiveMsg.reactions.removeAll();
                        await joveStorage.importFromGoogle();
                        await reactiveMsg.edit('~~'+(reactiveMsg.content)+'~~\n**Done!**');
                    }else if (collected.first()?.emoji.name == '❎') {
                        await reactiveMsg.edit('~~'+(reactiveMsg.content)+'~~\n**Aborted!**');
                        await reactiveMsg.reactions.removeAll();
                    }
                }).catch(async (error) => {
                    await reactiveMsg.edit('~~'+(reactiveMsg.content)+'~~\n**Error:**```'+error.toString()+'```');
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
client.login(process.env.BOT_TOKEN).then().catch(console.error);