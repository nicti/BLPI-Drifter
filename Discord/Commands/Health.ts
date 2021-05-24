import CommandInterface from "./CommandInterface";
import {Client, Message, MessageAttachment, MessageEmbed} from "discord.js";
import Pings from "../../Bot/Pings";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";

export default class Health extends CommandInterface {

    client: Client;

    constructor(esi: AxiosInstance, jove: JoveStorage, client: Client) {
        super(esi,jove);
        this.client = client;
    }


    async execute(message: Message, data: string[]): Promise<any> {
        const attachment = new MessageAttachment('assets/blpi.png','blpi.png');
        let info = await Pings.statusAll(this.client);
        let esiHealth = Math.round(((info.esiHealth.green/info.esiHealth.total)*100))+'%';
        let embeded = new MessageEmbed();
        embeded.setTitle('Health Report');
        embeded.addField('ESI Ping',info.esiPing,true);
        embeded.addField('ESI Health',esiHealth,true);
        embeded.addField('Discord Ping',info.discordPing+' ms',true);
        embeded.addField('Discord Health',info.discordHealth,true);
        if (info.esiPing === "ok" && info.discordHealth === "GREEN") {
            embeded.setColor('GREEN');
        }else if (info.esiPing !== "ok" && info.discordHealth !== "GREEN") {
            embeded.setColor("RED");
        } else if (info.esiPing !== "ok" || info.discordHealth !== "GREEN") {
            embeded.setColor("YELLOW");
        }
        embeded.attachFiles([attachment]);
        embeded.setThumbnail('attachment://blpi.png');
        let dateObj = new Date();
        let dateString = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
            ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + dateObj.getUTCSeconds().toString().padStart(2,'0') + ' UTC';
        embeded.setFooter(dateString);
        await message.channel.send(embeded);
    }

    help(): { name: string; value: string } {
        return {name: "`health`", value: "Reports health of connected APIs"};
    }


}