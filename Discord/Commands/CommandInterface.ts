import {DMChannel, Message, MessageReaction, Snowflake, User} from "discord.js";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";
import AdvancedLogger from "../../utils/AdvancedLogger";

interface CommandInterfaceInterface {
    execute(message: Message, data: string[]): Promise<any>;
    help(): {name: string, value: string};
}

export default abstract class CommandInterface implements CommandInterfaceInterface {

    protected esi: AxiosInstance;
    protected jove: JoveStorage;
    protected logger: AdvancedLogger;

    constructor(esi: AxiosInstance, jove: JoveStorage, logger: AdvancedLogger) {
        this.esi = esi;
        this.jove = jove;
        this.logger = logger;
    }

    abstract execute(message: Message, data: string[]): Promise<any>;

    abstract help(): { name: string, value: string };

    abstract getAccessLevel(): number

    public async provideYesNoPrompt(message: Message, question: string): Promise<boolean> {
        let reactiveMsg = await message.reply(question);
        await reactiveMsg.react('✅');
        await reactiveMsg.react('❎');
        const reactionFilter = (reaction: MessageReaction, user: User) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❎');
        let reaction = await reactiveMsg.awaitReactions({filter: reactionFilter, max: 1, time: 15000});
        if (reaction.first()?.emoji.name === '✅') {
            try {
                await reactiveMsg.reactions.removeAll();
            } catch (e) {
                if (e.code === 50013) {
                    let textInfo = '';
                    if (!(reactiveMsg.channel instanceof DMChannel) && !(reactiveMsg.channel.partial)) {
                        textInfo = `${reactiveMsg.channel.guild.name} > ${reactiveMsg.channel.name}`;
                    }
                    this.logger.warn(`Bot is missing Edit Messages permissions in channel ${textInfo} [${reactiveMsg.channel.id}]`);
                } else if (e.code !== 50003) {
                    throw e;
                }
            }
            await reactiveMsg.edit('~~' + reactiveMsg.content + '~~');
            try {
                await reactiveMsg.reactions.removeAll();
            } catch (e) {
                if (e.code === 50013) {
                    let textInfo = '';
                    if (!(reactiveMsg.channel instanceof DMChannel) && !(reactiveMsg.channel.partial)) {
                        textInfo = `${reactiveMsg.channel.guild.name} > ${reactiveMsg.channel.name}`;
                    }
                    this.logger.warn(`Bot is missing Edit Messages permissions in channel ${textInfo} [${reactiveMsg.channel.id}]`);
                } else if (e.code !== 50003) {
                    throw e;
                }
            }
            return true;
        } else if (reaction.first()?.emoji.name === '❎') {
            try {
                await reactiveMsg.reactions.removeAll();
            } catch (e) {
                if (e.code === 50013) {
                    let textInfo = '';
                    if (!(reactiveMsg.channel instanceof DMChannel) && !(reactiveMsg.channel.partial)) {
                        textInfo = `${reactiveMsg.channel.guild.name} > ${reactiveMsg.channel.name}`;
                    }
                    this.logger.warn(`Bot is missing Edit Messages permissions in channel ${textInfo} [${reactiveMsg.channel.id}]`);
                } else if (e.code !== 50003) {
                    throw e;
                }
            }
            await reactiveMsg.edit('~~' + reactiveMsg.content + '~~');
            try {
                await reactiveMsg.reactions.removeAll();
            } catch (e) {
                if (e.code === 50013) {
                    let textInfo = '';
                    if (!(reactiveMsg.channel instanceof DMChannel) && !(reactiveMsg.channel.partial)) {
                        textInfo = `${reactiveMsg.channel.guild.name} > ${reactiveMsg.channel.name}`;
                    }
                    this.logger.warn(`Bot is missing Edit Messages permissions in channel ${textInfo} [${reactiveMsg.channel.id}]`);
                } else if (e.code !== 50003) {
                    throw e;
                }
            }
            return false;
        } else {
            try {
                await reactiveMsg.reactions.removeAll();
            } catch (e) {
                if (e.code === 50013) {
                    let textInfo = '';
                    if (!(reactiveMsg.channel instanceof DMChannel) && !(reactiveMsg.channel.partial)) {
                        textInfo = `${reactiveMsg.channel.guild.name} > ${reactiveMsg.channel.name}`;
                    }
                    this.logger.warn(`Bot is missing Edit Messages permissions in channel ${textInfo} [${reactiveMsg.channel.id}]`);
                } else if (e.code !== 50003) {
                    throw e;
                }
            }
            await reactiveMsg.edit('~~' + reactiveMsg.content + '~~');
            return false;
        }
    }
}
