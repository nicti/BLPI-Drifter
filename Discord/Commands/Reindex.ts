import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";
import FAS from "../../Storage/FAS";

export default class Reindex extends CommandInterface {
  fas: FAS;

  constructor(esi: AxiosInstance, jove: JoveStorage, fas: FAS) {
    super(esi,jove);
    this.fas = fas;
  }

  async execute(message: Message, data: string[]): Promise<any> {
    if (await this.fas.reindex()) {
      await message.reply('Reindexing was successful');
    }
  }

  help(): { name: string; value: string } {
    return {name: "`reindex`", value: "Rebuilds index for fast lookup of system names"};
  }

  getAccessLevel(): number {
    return 0;
  }
}