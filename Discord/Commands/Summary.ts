import CommandInterface from './CommandInterface'
import { ChannelManager, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export default class Summary extends CommandInterface {

    registerCommand () {
        return new SlashCommandBuilder()
            .setName('summary')
            .setDescription('Shows a summary of the current state of the Drifter WHs in the current channel')
    }

    async execute (message: Message, data: string[]): Promise<any> {
        await this.jove.resetOutdated()
        let regionalData: any = {}
        let regions = await this.jove.getRegions()
        for (const regionKey in regions) {
            if (regions.hasOwnProperty(regionKey)) {
                let scanned = 0
                let hasWh = 0
                let whs: any[] = []
                let region = regions[regionKey]
                for (const systemName in region) {
                    if (region.hasOwnProperty(systemName)) {
                        let system: { updated: string, whs: string[], id: number } = region[systemName]
                        if (system.updated !== '') {
                            scanned++
                        }
                        if (system.whs.length) {
                            hasWh++
                            whs = [ ...whs, ...system.whs ]
                        }
                    }
                }
                regionalData[regionKey] = {
                    scanned: scanned,
                    hasWh: hasWh,
                    total: Object.keys(region).length,
                    whs: whs
                }
            }
        }
        //42
        let headline = ('Region').toString().padEnd(20, ' ') + '|Total|Scanned|Has WH|WHs\n'
        let str = []
        for (const regionalDataKey in regionalData) {
            if (regionalData.hasOwnProperty(regionalDataKey)) {
                let regionData = regionalData[regionalDataKey]
                str.push((regionalDataKey).toString().padEnd(20, ' ') + '|' + (regionData.total).toString().padStart(5, ' ') + '|' + (regionData.scanned).toString().padStart(7, ' ') + '|' + (regionData.hasWh).toString().padStart(6, ' ') + '|' + (regionData.whs.join(',')).toString() + '\n')
            }
        }
        let i, j, chunk = 30, chunks = []
        for (i = 0, j = str.length; i < j; i += chunk) {
            chunks.push(str.slice(i, i + chunk))
        }
        await message.channel.send('**Summary**')
        for (let i = 0; i < chunks.length; i++) {
            let regStr = chunks[i]
            await message.channel.send('```' + headline + ('+'.padStart(20 + 1, '-') + '+'.padStart(5 + 1, '-') + '+'.padStart(7 + 1, '-') + '+'.padStart(6 + 1, '-') + ''.padStart(10, '-') + '\n') + regStr.join('') + '```')
        }
    }

    help (): { name: string; value: string } {
        return { name: '`summary`', value: 'Provides a summary of known data.' }
    }

    getAccessLevel (): number {
        return 0
    }

    async executeInteraction (interaction: any): Promise<any> {
        if (interaction.isCommand()) {
            await this.jove.resetOutdated()
            let regionalData: any = {}
            let regions = await this.jove.getRegions()
            for (const regionKey in regions) {
                if (regions.hasOwnProperty(regionKey)) {
                    let scanned = 0
                    let hasWh = 0
                    let whs: any[] = []
                    let region = regions[regionKey]
                    for (const systemName in region) {
                        if (region.hasOwnProperty(systemName)) {
                            let system: { updated: string, whs: string[], id: number } = region[systemName]
                            if (system.updated !== '') {
                                scanned++
                            }
                            if (system.whs.length) {
                                hasWh++
                                whs = [ ...whs, ...system.whs ]
                            }
                        }
                    }
                    regionalData[regionKey] = {
                        scanned: scanned,
                        hasWh: hasWh,
                        total: Object.keys(region).length,
                        whs: whs
                    }
                }
            }
            //42
            let headline = ('Region').toString().padEnd(20, ' ') + '|Total|Scanned|Has WH|WHs\n'
            let str = []
            for (const regionalDataKey in regionalData) {
                if (regionalData.hasOwnProperty(regionalDataKey)) {
                    let regionData = regionalData[regionalDataKey]
                    str.push((regionalDataKey).toString().padEnd(20, ' ') + '|' + (regionData.total).toString().padStart(5, ' ') + '|' + (regionData.scanned).toString().padStart(7, ' ') + '|' + (regionData.hasWh).toString().padStart(6, ' ') + '|' + (regionData.whs.join(',')).toString() + '\n')
                }
            }
            let i, j, chunk = 30, chunks: any[] = []
            for (i = 0, j = str.length; i < j; i += chunk) {
                chunks.push(str.slice(i, i + chunk))
            }
            const channelMgr: ChannelManager = interaction.client.channels
            await interaction.reply({content: 'Sending summary to channel...', ephemeral: true})
            channelMgr.fetch(interaction.channelId).then(async (channel: any) => {
                try {
                    await channel.send('**Summary**')
                    for (let i = 0; i < chunks.length; i++) {
                        let regStr = chunks[i]
                        await channel.send('```' + headline + ('+'.padStart(20 + 1, '-') + '+'.padStart(5 + 1, '-') + '+'.padStart(7 + 1, '-') + '+'.padStart(6 + 1, '-') + ''.padStart(10, '-') + '\n') + regStr.join('') + '```')
                    }
                } catch (e: any) {
                    if (e.message === 'Missing Access') {
                        await interaction.reply({content: 'I need the `SEND_MESSAGES` permission in this channel to do that!', ephemeral: true})
                    }
                }
            })
        }
    }

}