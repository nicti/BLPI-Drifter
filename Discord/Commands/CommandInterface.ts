import {Message} from "discord.js";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";

interface CommandInterfaceInterface {
    execute(message: Message, data: string[]): Promise<any>;
    help(): {name: string, value: string};
}

export default abstract class CommandInterface implements CommandInterfaceInterface {
    esi: AxiosInstance;
    jove: JoveStorage;

    constructor(esi: AxiosInstance, jove: JoveStorage) {
        this.esi = esi;
        this.jove = jove;
    }

    abstract execute(message: Message, data: string[]): Promise<any>;

    abstract help(): { name: string, value: string };

    public async provideYesNoPrompt(message: Message, question: string): Promise<boolean> {
        let reactiveMsg = await message.reply(question);
        await reactiveMsg.react('✅');
        await reactiveMsg.react('❎');
        let reaction = await reactiveMsg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❎'),
            {max: 1, time: 30000});
        if (reaction.first()?.emoji.name === '✅') {
            try {
                await reactiveMsg.reactions.removeAll();
            } catch (e) {
                if (e.code === 50013) {
                    console.log('Bot is missing Edit Messages permissions in channel '+reactiveMsg.channel.id);
                } else if (e.code !== 50003) {
                    throw e;
                }
            }
            await reactiveMsg.edit('~~' + reactiveMsg.content + '~~');
            try {
                await reactiveMsg.reactions.removeAll();
            } catch (e) {
                if (e.code === 50013) {
                    console.log('Bot is missing Edit Messages permissions in channel '+reactiveMsg.channel.id);
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
                    console.log('Bot is missing Edit Messages permissions in channel '+reactiveMsg.channel.id);
                } else if (e.code !== 50003) {
                    throw e;
                }
            }
            await reactiveMsg.edit('~~' + reactiveMsg.content + '~~');
            try {
                await reactiveMsg.reactions.removeAll();
            } catch (e) {
                if (e.code === 50013) {
                    console.log('Bot is missing Edit Messages permissions in channel '+reactiveMsg.channel.id);
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
                    console.log('Bot is missing Edit Messages permissions in channel '+reactiveMsg.channel.id);
                } else if (e.code !== 50003) {
                    throw e;
                }
            }
            await reactiveMsg.edit('~~' + reactiveMsg.content + '~~');
            return false;
        }
    }
}
