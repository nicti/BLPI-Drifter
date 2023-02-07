import CommandInterface from './CommandInterface'
import { Message, MessageEmbed } from 'discord.js'
import { execSync } from 'child_process'
import parseChangelog from 'changelog-parser'
import { SlashCommandBuilder } from '@discordjs/builders'

export default class Changelog extends CommandInterface {
    registerCommand () {
        return new SlashCommandBuilder()
            .setName('changelog')
            .setDescription('Displays current tag and the changelog')
    }

    async execute (message: Message, data: string[]): Promise<any> {
        let limit: number = 3
        let log: { versions: any[], title: string } | any = await parseChangelog('./CHANGELOG.md')
        let versions = log.versions
        let versionStr = new TextDecoder().decode(execSync('git describe --tag --always')).replace('\n', '')
        let embed = new MessageEmbed()
        embed.setTitle('Changelog')
        embed.setDescription(`Current version: **${versionStr}**`)
        for (const version of versions.splice(0, limit)) {
            let str = ''
            for (const [ key, value ] of Object.entries(version.parsed)) {
                if (key === '_') continue
                str += '**' + key + '**\n-'
                // @ts-ignore
                str += value.join('\n-')
                str += '\n'
            }
            embed.addField(version.version, '>>> ' + str + '')
        }
        embed.setURL('https://github.com/nicti/blpi-drifter/blob/main/README.md')
        await message.reply({ embeds: [ embed ] })
    }

    getAccessLevel (): number {
        return 0
    }

    help (): { name: string; value: string } {
        return { name: '`changelog`', value: 'Displays current tag and the changelog' }
    }

    async executeInteraction (interaction: any): Promise<any> {
        if (interaction.isCommand()) {
            let limit: number = 3
            let log: { versions: any[], title: string } | any = await parseChangelog('./CHANGELOG.md')
            let versions = log.versions
            let versionStr = new TextDecoder().decode(execSync('git describe --tag --always')).replace('\n', '')
            let embed = new MessageEmbed()
            embed.setTitle('Changelog')
            embed.setDescription(`Current version: **${versionStr}**`)
            const fields = []
            for (const version of versions.splice(0, limit)) {
                let str = ''
                for (const [ key, value ] of Object.entries(version.parsed)) {
                    if (key === '_') continue
                    str += '**' + key + '**\n-'
                    // @ts-ignore
                    str += value.join('\n-')
                    str += '\n'
                }
                fields.push({ name: version.version, value: '>>> ' + str + '' })
            }
            embed.addFields(fields)
            embed.setURL('https://github.com/nicti/blpi-drifter/blob/main/README.md')
            await interaction.reply({ embeds: [ embed ], ephemeral: true })
        }
    }


}