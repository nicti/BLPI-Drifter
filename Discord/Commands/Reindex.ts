import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";
import FAS from "../../Storage/FAS";
import AdvancedLogger from "../../utils/AdvancedLogger";
import { SlashCommandBuilder } from '@discordjs/builders'

export default class Reindex extends CommandInterface {
  fas: FAS;

  constructor(esi: AxiosInstance, jove: JoveStorage, logger: AdvancedLogger, fas: FAS) {
    super(esi,jove,logger);
    this.fas = fas;
  }

  registerCommand() {
    return new SlashCommandBuilder()
        .setName('reindex')
        .setDescription('Rebuilds index for fast lookup of system names')
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

  async executeInteraction (interaction: any): Promise<any> {
    if (interaction.isCommand()) {
      if (await this.fas.reindex()) {
        await interaction.reply({content: 'Reindexing was successful', ephemeral: true});
      }
    }
  }
}