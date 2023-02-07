import CommandInterface from './CommandInterface'
import { Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import FAS from '../../Storage/FAS'

export default class Route extends CommandInterface {

    fas: FAS

    constructor (esi: any, jove: any, logger: any, fas: FAS) {
        super(esi, jove, logger)
        this.fas = fas
    }

    registerCommand () {
        return new SlashCommandBuilder()
            .setName('route')
            .setDescription('Finds a route between two regions')
            .addStringOption(option =>
                option.setName('region1')
                    .setDescription('First region name')
                    .setRequired(true)
                    .setAutocomplete(true))
            .addStringOption(option =>
                option.setName('region2')
                    .setDescription('Second region name')
                    .setRequired(true)
                    .setAutocomplete(true))

    }

    async execute (message: Message, data: string[]): Promise<any> {
        const regions = data.join(' ').split('|')
        if (regions.length !== 2) {
            await message.reply('Insufficient region information')
            return
        }
        let loc1: any = []
        let loc2: any = []
        let doneFirst = false
        for (const e of regions) {
            let parts = e.split(' ')
            parts.forEach((e, i) => parts[i] = this.capitalizeFirstLetter(e.toLowerCase()))
            const region = parts.join('_')
            await this.jove.resetOutdated(region)
            try {
                const joves = await this.jove.getForRegion(region)
                for (const key in joves) {
                    joves[key].whs.forEach((e: any) => {
                        if (!doneFirst) {
                            loc1.push({
                                updated: joves[key].updated,
                                name: key,
                                wh: e.replace('-', ''),
                                crit: e.includes('-')
                            })
                        } else {
                            loc2.push({
                                updated: joves[key].updated,
                                name: key,
                                wh: e.replace('-', ''),
                                crit: e.includes('-')
                            })
                        }
                    })
                }
            } catch (e) {
                await message.reply(`Failed to load data for region \`${region}\``)
                return
            }
            doneFirst = true
        }
        let pairs: any[] = []
        loc1.forEach((e: { updated: number, name: string, wh: string, crit: boolean }) => {
            let matches = loc2.filter((f: { updated: number, name: string, wh: string, crit: boolean }) => e.wh === f.wh)
            matches.forEach((f: { updated: number, name: string, wh: string, crit: boolean }) => {
                pairs.push({
                    one_updated: e.updated,
                    one_name: e.name,
                    one_crit: e.crit,
                    two_updated: f.updated,
                    two_name: f.name,
                    two_crit: f.crit,
                    wh: e.wh
                })
            })
        })
        let pad1 = Math.max(...loc1.map((e: any) => e.name.length)) + 1
        let pad2 = Math.max(...loc2.map((e: any) => e.name.length)) + 1
        let pad = Math.max(pad1, pad2, regions[0].length, regions[1].length)
        let response = `\`\`\`${regions[0].padEnd(pad, ' ')} <=====> ${regions[1].padEnd(pad, ' ')}| Oldest\n${''.padEnd(((pad * 2) + 9), '=')}+${''.padEnd(20, '=')}\n`
        let parts: string[] = []
        if (pairs.length === 0) {
            await message.reply('No WH pairs found!')
            return
        }
        pairs.forEach((e: { one_updated: number, one_name: string, one_crit: boolean, two_updated: number, two_name: string, two_crit: boolean, wh: string }) => {
            let dateObj
            if (e.one_updated > e.two_updated) {
                dateObj = new Date(e.two_updated)
            } else {
                dateObj = new Date(e.one_updated)
            }
            let date = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC'
            const one_crit = e.one_crit ? '-' : ' '
            const two_crit = e.two_crit ? '-' : ' '
            parts.push(`${e.one_name.padEnd(pad, ' ')} <=${one_crit}${e.wh}${two_crit}=> ${e.two_name.padEnd(pad, ' ')}|${date}`)
        })
        response += parts.join('\n')
        response += '```'
        await message.reply(response)
    }

    getAccessLevel (): number {
        return 0
    }

    help (): { name: string; value: string } {
        return { name: '`route <region>|<region>`', value: 'Shows matching WH pairs between 2 regions' }
    }

    capitalizeFirstLetter (str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    async executeInteraction (interaction: any): Promise<any> {
        if (interaction.isAutocomplete()) {
            const focus = interaction.options.getFocused(true)
            if (focus.name === 'region1') {
                const filtered = this.fas.getRegions().filter(e => e.toLowerCase().startsWith(focus.value.toLowerCase())).slice(0, 25)
                interaction.respond(
                    filtered.map((choices) => ({ name: choices, value: choices }))
                )
            } else if (focus.name === 'region2') {
                const filtered = this.fas.getRegions().filter(e => e.toLowerCase().startsWith(focus.value.toLowerCase())).slice(0, 25)
                interaction.respond(
                    filtered.map((choices) => ({ name: choices, value: choices }))
                )
            }
        } else if (interaction.isCommand()) {
            const region1 = interaction.options.getString('region1')
            const region2 = interaction.options.getString('region2')
            const regions = [ region1, region2 ]
            if (regions.length !== 2) {
                await interaction.reply({ content: 'Insufficient region information', ephemeral: true })
                return
            }
            let loc1: any = []
            let loc2: any = []
            let doneFirst = false
            for (const e of regions) {
                let parts = e.split(' ')
                parts.forEach((e: any, i: any) => parts[i] = this.capitalizeFirstLetter(e.toLowerCase()))
                const region = parts.join('_')
                await this.jove.resetOutdated(region)
                try {
                    const joves = await this.jove.getForRegion(region)
                    for (const key in joves) {
                        joves[key].whs.forEach((e: any) => {
                            if (!doneFirst) {
                                loc1.push({
                                    updated: joves[key].updated,
                                    name: key,
                                    wh: e.replace('-', ''),
                                    crit: e.includes('-')
                                })
                            } else {
                                loc2.push({
                                    updated: joves[key].updated,
                                    name: key,
                                    wh: e.replace('-', ''),
                                    crit: e.includes('-')
                                })
                            }
                        })
                    }
                } catch (e) {
                    await interaction.reply({
                        content: `Failed to load data for region \`${region}\``,
                        ephemeral: true
                    })
                    return
                }
                doneFirst = true
            }
            let pairs: any[] = []
            loc1.forEach((e: { updated: number, name: string, wh: string, crit: boolean }) => {
                let matches = loc2.filter((f: { updated: number, name: string, wh: string, crit: boolean }) => e.wh === f.wh)
                matches.forEach((f: { updated: number, name: string, wh: string, crit: boolean }) => {
                    pairs.push({
                        one_updated: e.updated,
                        one_name: e.name,
                        one_crit: e.crit,
                        two_updated: f.updated,
                        two_name: f.name,
                        two_crit: f.crit,
                        wh: e.wh
                    })
                })
            })
            let pad1 = Math.max(...loc1.map((e: any) => e.name.length)) + 1
            let pad2 = Math.max(...loc2.map((e: any) => e.name.length)) + 1
            let pad = Math.max(pad1, pad2, regions[0].length, regions[1].length)
            let response = `\`\`\`${regions[0].padEnd(pad, ' ')} <=====> ${regions[1].padEnd(pad, ' ')}| Oldest\n${''.padEnd(((pad * 2) + 9), '=')}+${''.padEnd(20, '=')}\n`
            let parts: string[] = []
            if (pairs.length === 0) {
                await interaction.reply({ content: 'No WH pairs found!', ephemeral: true })
                return
            }
            pairs.forEach((e: { one_updated: number, one_name: string, one_crit: boolean, two_updated: number, two_name: string, two_crit: boolean, wh: string }) => {
                let dateObj
                if (e.one_updated > e.two_updated) {
                    dateObj = new Date(e.two_updated)
                } else {
                    dateObj = new Date(e.one_updated)
                }
                let date = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                    ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC'
                const one_crit = e.one_crit ? '-' : ' '
                const two_crit = e.two_crit ? '-' : ' '
                parts.push(`${e.one_name.padEnd(pad, ' ')} <=${one_crit}${e.wh}${two_crit}=> ${e.two_name.padEnd(pad, ' ')}|${date}`)
            })
            response += parts.join('\n')
            response += '```'
            await interaction.reply({ content: response, ephemeral: true })
        }
    }

}