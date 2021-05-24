import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";

export default class LoadDataFromGoogle extends CommandInterface {

    async execute(message: Message, data: string[]): Promise<any> {
        let allowed = await this.provideYesNoPrompt(message,'Are you sure you want to reload all the data? This will delete saved data!');
        if (allowed) {
            await this.jove.importFromGoogle(message);
        }
    }

    help(): { name: string; value: string } {
        return {name: "`loadDataFromGoogle`", value: "Reloads drifter data from Google Spreadsheet. This does delete all previously gathered data."};
    }

}