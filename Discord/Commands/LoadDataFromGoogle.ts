import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";

export default class LoadDataFromGoogle extends CommandInterface {

    async execute(message: Message, data: string[]): Promise<any> {
        // As CCP disabled the search endpoint for public usage, this function can no longer run reliably
        /*let allowed = await this.provideYesNoPrompt(message,'Are you sure you want to reload all the data? This will delete saved data!');
        if (allowed) {
            await this.jove.importFromGoogle(message);
        }*/
        await message.reply('As CCP disabled the search endpoint for public usage, this function can no longer run reliably. Please refer to the github repo to get a jove system database.')
    }

    help(): { name: string; value: string } {
        return {name: "`loadDataFromGoogle`", value: "Reloads drifter data from Google Spreadsheet. This does delete all previously gathered data."};
    }

    getAccessLevel(): number {
        return 1;
    }

}