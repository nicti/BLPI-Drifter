import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";
import JoveStorage from "../../Storage/JoveStorage";

export default class Find extends CommandInterface
{

    async execute(message: Message, data: string[]): Promise<any> {
        let find = data[0];
        if (!JoveStorage.WHS.includes(find)) {
            await message.reply('Insert correct wh type please: B,C,V,S,R');
            return;
        }
        await this.jove.resetOutdated();
        let results = await this.jove.findByType(find);
        let stableReturns = [];
        let unstableReturns = [];
        let dateObj: Date;
        for (let i = 0; i < results.stable.length; i++) {
            let result = results.stable[i];
            dateObj = new Date(result.updated);
            stableReturns.push(result.system + " - " + result.region + " [" + dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC' + "]");
        }
        for (let i = 0; i < results.unstable.length; i++) {
            let result = results.unstable[i];
            dateObj = new Date(result.updated);
            unstableReturns.push(result.system + " - " + result.region + " [" + dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC' + "]");
        }
        let resultMessage: string = "";
        if (stableReturns.length === 0 && unstableReturns.length === 0) {
            resultMessage = "No " + find + " WHs found!";
        }
        if (stableReturns.length > 0) {
            resultMessage += 'Stable ' + find + ' WHs:```' + stableReturns.join("\n") + '```';
        }
        if (unstableReturns.length > 0) {
            resultMessage += '**Un**stable ' + find + ' WHs:```' + unstableReturns.join("\n") + '```';
        }
        await message.channel.send(resultMessage);
    }

    help(): { name: string; value: string } {
        return {name: "`find <WH identifier>`", value: "Finds all WHs of a certain type"};
    }

}