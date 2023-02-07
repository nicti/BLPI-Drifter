import { CacheType, Client, CommandInteraction, Interaction, Message, MessageEmbed } from 'discord.js'
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v10';
import JoveStorage from "../Storage/JoveStorage";
import Show from "./Commands/Show";
import CommandInterface from "./Commands/CommandInterface";
import {AxiosInstance} from "axios";
import Set from "./Commands/Set";
import Find from "./Commands/Find";
import LoadDataFromGoogle from "./Commands/LoadDataFromGoogle";
import Closest from "./Commands/Closest";
import Health from "./Commands/Health";
import Summary from "./Commands/Summary";
import FAS from "../Storage/FAS";
import Reindex from "./Commands/Reindex";
import JoveAdd from "./Commands/JoveAdd";
import JoveRemove from "./Commands/JoveRemove";
import PFLoad from "./Commands/PFLoad";
import AdvancedLogger from "../utils/AdvancedLogger";
import Pings from "../Bot/Pings";
import Changelog from "./Commands/Changelog";
import Route from './Commands/Route'
import Jita from './Commands/Jita'

export default class Commands {
    client: Client;
    jove: JoveStorage;
    esi: AxiosInstance;
    fas: FAS;
    commands: Map<string, CommandInterface>;
    admins: Array<string>;
    logger: AdvancedLogger;
    pings: Pings;

    constructor(client: Client, esi: AxiosInstance, jove: JoveStorage, fas: FAS, logger: AdvancedLogger, pings: Pings) {
        this.client = client;
        this.esi = esi;
        this.jove = jove;
        this.fas = fas;
        this.logger = logger;
        this.pings = pings;
        this.commands = new Map();
        this.commands.set('show', (new Show(this.esi, this.jove, this.logger, this.fas)));
        this.commands.set('set', (new Set(this.esi, this.jove, this.logger, this.fas)));
        this.commands.set('find', (new Find(this.esi, this.jove, this.logger)));
        this.commands.set('loaddatafromgoogle', (new LoadDataFromGoogle(this.esi, this.jove, this.logger)));
        this.commands.set('closest', (new Closest(this.esi, this.jove, this.logger)));
        this.commands.set('health', (new Health(this.esi, this.jove, this.logger, this.client, this.fas, this.pings)));
        this.commands.set('summary', (new Summary(this.esi, this.jove, this.logger)));
        this.commands.set('reindex', (new Reindex(this.esi, this.jove, this.logger, this.fas)));
        this.commands.set('joveadd', (new JoveAdd(this.esi, this.jove, this.logger)));
        this.commands.set('joveremove', (new JoveRemove(this.esi, this.jove, this.logger)));
        this.commands.set('pfload', (new PFLoad(this.esi, this.jove, this.logger)));
        this.commands.set('changelog', (new Changelog(this.esi, this.jove, this.logger)));
        this.commands.set('route', (new Route(this.esi, this.jove, this.logger, this.fas)));
        this.commands.set('jita', (new Jita(this.esi, this.jove, this.logger, this.fas)));

        let admins = process.env.ADMINS?.split(',');
        if (typeof admins === "undefined") {
            throw "Unable to find admins in .env file. Please specify admins in your .env file.";
        }
        this.admins = admins;

        // Register slash commands
        const rest = new REST({ version: '10'}).setToken(process.env.BOT_TOKEN as string);
        const commands: any[] = [];
        this.commands.forEach((command) => {
            let cmd = command.registerCommand()
            if (cmd) {
                commands.push(cmd)
            }
        })
        if (commands.length > 0) {
            rest.put(
                Routes.applicationGuildCommands(process.env.APPLICATION_ID as string, process.env.COMMAND_GUILD_ID as string) as any,
                { body: commands }
            ).then(() => {
                this.logger.info('Successfully registered application commands.');
            })
        }
    }

    public async processMessage(message: Message) {
        let accessLevel = 0;
        if (this.admins.includes(message.author.id)) {
            accessLevel = 1;
        }
        // Perform data stripping
        let trimmedMessage = message.content.replace(/\s+/g, ' ');
        let strippedName = trimmedMessage.replace('<@!' + this.client.user?.id + '> ', '').replace('<@' + this.client.user?.id + '> ', '');
        let role = message.guild?.roles.cache.find((r) => r.name === message.client.user?.username);
        if (typeof role !== "undefined") {
            strippedName = strippedName.replace('<@&'+role.id+'> ','');
        }
        let splitData = strippedName.split(' ');
        let command = splitData.shift()?.toString().toLowerCase();
        if (typeof command !== "undefined") {
            let executeObject = this.commands.get(command);
            if (typeof executeObject !== "undefined") {
                if (accessLevel >= executeObject.getAccessLevel()) {
                    await executeObject.execute(message, splitData);
                } else {
                    await message.reply('You do not have access to this command!');
                }
            } else {
                this.logger.warn('Unknown command: ' + message.author.username + ': ' + message.content);
                await this.help(message);
            }
        } else {
            this.logger.warn('Unknown command: ' + message.author.username + ': ' + message.content);
            await this.help(message);
        }
    }

    processInteraction (interaction: Interaction<CacheType>|any) {
        const cmd = this.commands.get(interaction.commandName)
        if (cmd) {
            cmd.executeInteraction(interaction)
        } else {
            this.logger.warn('Unknown command: ' + interaction.commandName);
        }
    }

    private async help(message: Message) {
        let embed = new MessageEmbed()
            .setTitle('Commands');
        this.commands.forEach((command) => {
            embed.addFields(command.help());
        })
        await message.reply({ embeds: [embed] });
    }

}