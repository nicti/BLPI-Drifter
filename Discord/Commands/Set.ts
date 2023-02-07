import CommandInterface from './CommandInterface'
import { CacheType, Interaction, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { AxiosInstance } from 'axios'
import JoveStorage from '../../Storage/JoveStorage'
import FAS from '../../Storage/FAS'
import AdvancedLogger from '../../utils/AdvancedLogger'


export default class Set extends CommandInterface {
    fas: FAS

    constructor (esi: AxiosInstance, jove: JoveStorage, logger: AdvancedLogger, fas: FAS) {
        super(esi, jove, logger)
        this.fas = fas
    }

    async execute (message: Message, data: string[]): Promise<any> {
        if (data.length != 2) {
            await message.channel.send('Your message did not follow the pattern. Usage: `@BLPI Drifter set <system> <pipe split drifter letters>`')
            return
        }
        let system = await this.fas.find(data[0])
        let whs = data[1].toUpperCase()
        let result = await this.jove.setWHs(system, whs.split('|'))
        if (result === true) {
            await message.react('✅')
        } else if (typeof result === 'string') {
            await message.reply(result)
        }
        return
    }

    help (): { name: string; value: string } {
        return {
            name: '`set <system> <pipe split WH identifier>`',
            value: 'Sets drifter info for a certain system. Use letter for WH identifier. Concat - for EOL/crit. E.g.: `set Jita C|C-`'
        }
    }

    getAccessLevel (): number {
        return 0
    }

    registerCommand (): any {
        return new SlashCommandBuilder()
            .setName('set')
            .setDescription('Sets drifter info for a certain system. Use letter for WH identifier. Concat - for EOL/crit.')
            .addStringOption(option =>
                option.setName('system')
                    .setDescription('System name')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addStringOption(option =>
                option.setName('whs')
                    .setDescription('Pipe split WH identifier')
                    .setRequired(true)
            )
    }

    async executeInteraction (interaction: Interaction<CacheType> | any) {
        if (interaction.isAutocomplete()) {
            const focus = interaction.options.getFocused(true)
            if (focus.name === 'system') {
                const filtered = (await this.fas.search(focus.value)).slice(0, 25)
                interaction.respond(
                    filtered.map((choices) => ({ name: choices, value: choices }))
                )
            }
        } else if (interaction.isCommand()) {
            const system = interaction.options.getString('system', true)
            const whs = interaction.options.getString('whs', true)
            let result = await this.jove.setWHs(system, whs.split('|'))
            if (result === true) {
                await interaction.reply({ content: `Successfully set ${system} to ${whs}`, ephemeral: true })
            } else if (typeof result === 'string') {
                await interaction.reply({ content: result, ephemeral: true })
            }
        }
    }

}