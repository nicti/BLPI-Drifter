import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders'
import { AxiosInstance } from 'axios'
import JoveStorage from '../../Storage/JoveStorage'
import AdvancedLogger from '../../utils/AdvancedLogger'
import FAS from '../../Storage/FAS'

export default class Show extends CommandInterface {

    fas: FAS;
    constructor (esi: AxiosInstance, jove: JoveStorage, logger: AdvancedLogger, fas: FAS) {
        super(esi, jove, logger)
        this.fas = fas
    }
    registerCommand() {
        return new SlashCommandBuilder()
            .setName('show')
            .setDescription('Shows all drifter data for a given region')
            .addStringOption(option =>
                option.setName('region')
                    .setDescription('Region name')
                    .setRequired(true)
                    .setAutocomplete(true))
            .addBooleanOption(option =>
                option.setName('show_to_all')
                    .setDescription('Show to all')
                    .setRequired(false)
            )

    }
    async execute(message: Message, data: string[]): Promise<any> {
        data.forEach((e,i) => data[i] = this.capitalizeFirstLetter(e.toLowerCase()))
        let regionSearchName = data.join(' ');
        let ids = (await this.esi.post('/v1/universe/ids/',[regionSearchName])).data
        if (ids['regions']) {
            if (ids['regions'].length !== 1) {
                await message.channel.send('Search resulted in several hits, please specify.');
                return
            }
            let regionId = ids['regions'][0].id
            let region = (await this.esi.get('/v1/universe/regions/'+regionId+'/')).data;
            let regionName = region.name.replace(/ /g,'_');
            await this.jove.resetOutdated(regionName);
            let joveRegionalInfo = await this.jove.getForRegion(regionName);
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
        } else {
            await message.channel.send('Could not find region matching `'+regionSearchName+'`.');
        }
    }

    help(): { name: string; value: string } {
        return {name: "`show <region>`", value: "Shows all drifter data for a given region"};
    }

    getAccessLevel(): number {
        return 0;
    }

    capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async executeInteraction (interaction: any): Promise<any> {
        if (interaction.isAutocomplete()) {
            const focus = interaction.options.getFocused(true)
            if (focus.name === 'region') {
                const filtered = this.fas.getRegions().filter(e => e.toLowerCase().startsWith(focus.value.toLowerCase())).slice(0, 25)
                interaction.respond(
                    filtered.map((choices) => ({ name: choices, value: choices }))
                )
            }
        } else if (interaction.isCommand()) {
            const region = interaction.options.getString('region', true)
            const show_to_all = interaction.options.getBoolean('show_to_all', false)??false
            let ids = (await this.esi.post('/v1/universe/ids/',[region])).data
            if (ids['regions']) {
                if (ids['regions'].length !== 1) {
                    await interaction.reply('Search resulted in several hits, please specify.');
                    return
                }
                let regionId = ids['regions'][0].id
                let region = (await this.esi.get('/v1/universe/regions/'+regionId+'/')).data;
                let regionName = region.name.replace(/ /g,'_');
                await this.jove.resetOutdated(regionName);
                let joveRegionalInfo = await this.jove.getForRegion(regionName);
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
                interaction.reply({ephemeral: !show_to_all, content: region.name+':```'+str+'```https://evemaps.dotlan.net/map/'+regionName+'/'+link.join(':')});
            } else {
                await interaction.reply('Could not find region matching `'+region+'`.');
            }
        }
    }
}