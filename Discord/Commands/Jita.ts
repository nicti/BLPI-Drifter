import CommandInterface from './CommandInterface'
import { Message } from 'discord.js'

export default class Jita extends CommandInterface {
    help (): { name: string; value: string } {
        return {
            name: '`jita <region>`',
            value: 'Finds a route between a region and Jita (The Forge, Lonetrek, The Citadel)'
        }
    }

    getAccessLevel (): number {
        return 0
    }

    async execute (message: Message, data: string[]): Promise<any> {
        data.forEach((e, i) => data[i] = this.capitalizeFirstLetter(e.toLowerCase()))
        const region = data.join('_')
        await this.jove.resetOutdated(region)
        let joves: any
        try {
            joves = await this.jove.getForRegion(region)
        } catch (e) {
            await message.reply(`Failed to load data for region \`${region}\``)
            return
        }
        let loc1: any = []
        let loc2: any = []
        for (const key in joves) {
            joves[key].whs.forEach((e: any) => {
                loc2.push({
                    updated: joves[key].updated,
                    name: key,
                    wh: e.replace('-', ''),
                    crit: e.includes('-')
                })
            })
        }
        for (const key of [ 'The_Forge', 'Lonetrek', 'The_Citadel' ]) {
            const joves = await this.jove.getForRegion(key)
            for (const key in joves) {
                joves[key].whs.forEach((e: any) => {
                    loc1.push({
                        updated: joves[key].updated,
                        name: key,
                        wh: e.replace('-', ''),
                        crit: e.includes('-')
                    })
                })
            }
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
        let pad = Math.max(pad1, pad2, 4, region.length)
        let response = `\`\`\`${'Jita'.padEnd(pad, ' ')} <=====> ${region.padEnd(pad, ' ')}| Oldest\n${''.padEnd(((pad * 2) + 9), '=')}+${''.padEnd(20, '=')}\n`
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

    private capitalizeFirstLetter (str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}