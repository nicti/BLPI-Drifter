import {Client, Message, MessageEmbed} from "discord.js";
import JoveStorage from "../Storage/JoveStorage";
import Show from "./Commands/Show";
import CommandInterface from "./Commands/CommandInterface";
import {AxiosInstance} from "axios";
import Set from "./Commands/Set";
import Find from "./Commands/Find";
import LoadDataFromGoogle from "./Commands/LoadDataFromGoogle";
import Health from "./Commands/Health";

export default class Commands {
    client: Client;
    jove: JoveStorage;
    esi: AxiosInstance;
    commands: Map<string, CommandInterface>;

    constructor(client: Client, esi: AxiosInstance, jove: JoveStorage) {
        this.client = client;
        this.esi = esi;
        this.jove = jove;
        this.commands = new Map();
        this.commands.set('show', (new Show(this.esi, this.jove)));
        this.commands.set('set', (new Set(this.esi, this.jove)));
        this.commands.set('find', (new Find(this.esi, this.jove)));
        this.commands.set('loaddatafromgoogle', (new LoadDataFromGoogle(this.esi, this.jove)));
        this.commands.set('health', (new Health(this.esi, this.jove, this.client)));
    }

    public async processMessage(message: Message) {
        // Perform data stripping
        let strippedName = message.content.replace('<@!' + this.client.user?.id + '> ', '');
        let splitData = strippedName.split(' ');
        let command = splitData.shift()?.toString().toLowerCase();
        if (typeof command !== "undefined") {
            let executeObject = this.commands.get(command);
            if (typeof executeObject !== "undefined") {
                await executeObject.execute(message, splitData);
            } else {
                console.log('Unknown command: ' + message.author.username + ': '+message.content);
                await this.help(message);
            }
        } else {
            console.log('Unknown command: ' + message.author.username + ': '+message.content);
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