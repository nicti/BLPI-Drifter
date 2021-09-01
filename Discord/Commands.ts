import {Client, Message, MessageEmbed} from "discord.js";
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

export default class Commands {
    client: Client;
    jove: JoveStorage;
    esi: AxiosInstance;
    fas: FAS;
    commands: Map<string, CommandInterface>;
    admins: Array<string>;

    constructor(client: Client, esi: AxiosInstance, jove: JoveStorage, fas: FAS) {
        this.client = client;
        this.esi = esi;
        this.jove = jove;
        this.fas = fas;
        this.commands = new Map();
        this.commands.set('show', (new Show(this.esi, this.jove)));
        this.commands.set('set', (new Set(this.esi, this.jove, this.fas)));
        this.commands.set('find', (new Find(this.esi, this.jove)));
        this.commands.set('loaddatafromgoogle', (new LoadDataFromGoogle(this.esi, this.jove)));
        this.commands.set('closest', (new Closest(this.esi, this.jove)));
        this.commands.set('health', (new Health(this.esi, this.jove, this.client, this.fas)));
        this.commands.set('summary', (new Summary(this.esi, this.jove)));
        this.commands.set('reindex', (new Reindex(this.esi, this.jove, this.fas)));
        this.commands.set('joveadd', (new JoveAdd(this.esi, this.jove)));
        this.commands.set('joveremove', (new JoveRemove(this.esi, this.jove)));
        this.commands.set('pfload', (new PFLoad(this.esi, this.jove)));

        let admins = process.env.ADMINS?.split(',');
        if (typeof admins === "undefined") {
            throw "Unable to find admins in .env file. Please specify admins in your .env file.";
        }
        this.admins = admins;
    }

    public async processMessage(message: Message) {
        let accessLevel = 0;
        if (this.admins.includes(message.author.id)) {
            accessLevel = 1;
        }
        // Perform data stripping
        let trimmedMessage = message.content.replace(/\s+/g, ' ');
        let strippedName = trimmedMessage.replace('<@!' + this.client.user?.id + '> ', '').replace('<@' + this.client.user?.id + '> ', '');
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
                console.log('Unknown command: ' + message.author.username + ': ' + message.content);
                await this.help(message);
            }
        } else {
            console.log('Unknown command: ' + message.author.username + ': ' + message.content);
            await this.help(message);
        }
    }

    private async help(message: Message) {
        let embed = new MessageEmbed()
            .setTitle('Commands');
        this.commands.forEach((command) => {
            embed.addFields(command.help());
        })
        await message.reply(embed);
    }

}