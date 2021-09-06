import CommandInterface from "./CommandInterface";
import {Client, Message, MessageAttachment, MessageEmbed} from "discord.js";
import Pings from "../../Bot/Pings";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";
import FAS from "../../Storage/FAS";
import AdvancedLogger from "../../utils/AdvancedLogger";

export default class Health extends CommandInterface {

    client: Client;
    fas: FAS;
    pings: Pings;

    constructor(esi: AxiosInstance, jove: JoveStorage, logger: AdvancedLogger, client: Client, fas: FAS, pings: Pings) {
        super(esi,jove,logger);
        this.client = client;
        this.fas = fas;
        this.pings = pings;
    }


    async execute(message: Message, data: string[]): Promise<any> {
        const attachment = new MessageAttachment('assets/blpi.png','blpi.png');
        let info = await this.pings.statusAll(this.client);
        let esiHealth = Math.round(((info.esiHealth.green/info.esiHealth.total)*100))+'%';
        let embeded = new MessageEmbed();
        embeded.setTitle('Health Report');
        embeded.addField('ESI Ping',info.esiPing,true);
        embeded.addField('ESI Health',esiHealth,true);
        embeded.addField('Discord Ping',info.discordPing+' ms',true);
        embeded.addField('Discord Health',info.discordHealth,true);
        embeded.addField('Index', this.fas.getLength()+' entries', true);
        embeded.addField('Mode', process.env.NODE_ENV as string, true);
        if (info.esiPing === "ok" && info.discordHealth === "GREEN") {
            embeded.setColor('GREEN');
        }else if (info.esiPing !== "ok" && info.discordHealth !== "GREEN") {
            embeded.setColor("RED");
        } else if (info.esiPing !== "ok" || info.discordHealth !== "GREEN") {
            embeded.setColor("YELLOW");
        }
        embeded.setThumbnail('attachment://blpi.png');
        let dateObj = new Date();
        let dateString = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
            ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + dateObj.getUTCSeconds().toString().padStart(2,'0') + ' UTC';
        embeded.setFooter(dateString);
        await message.channel.send({embeds: [embeded],files: [attachment]});
    }

    help(): { name: string; value: string } {
        return {name: "`health`", value: "Reports health of connected APIs"};
    }

    getAccessLevel(): number {
        return 0;
    }


}