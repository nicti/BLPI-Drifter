import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";
import FAS from "../../Storage/FAS";

export default class Set extends CommandInterface {
    fas: FAS;

    constructor(esi: AxiosInstance, jove: JoveStorage, fas: FAS) {
        super(esi, jove);
        this.fas = fas;
    }

    async execute(message: Message, data: string[]): Promise<any> {
        if (data.length != 2) {
            await message.channel.send('Your message did not follow the pattern. Usage: `@BLPI Drifter set <system> <pipe split drifter letters>`')
            return;
        }
        let system = await this.fas.find(data[0]);
        let whs = data[1].toUpperCase();
        let result = await this.jove.setWHs(system, whs.split('|'));
        if (result === true) {
            await message.react('✅');
        } else if (typeof result === 'string') {
            await message.reply(result);
        }
        return;
    }

    help(): { name: string; value: string } {
        return {name: "`set <system> <pipe split WH identifier>`", value: "Sets drifter info for a certain system. Use letter for WH identifier. Concat - for EOL/crit. E.g.: `set Jita C|C-`"};
    }

    getAccessLevel(): number {
        return 0;
    }

}