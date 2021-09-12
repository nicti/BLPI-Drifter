import CommandInterface from "./CommandInterface";
import {Message, MessageEmbed} from "discord.js";
import {execSync} from "child_process";
import parseChangelog from "changelog-parser";

export default class Changelog extends CommandInterface
{
    async execute(message: Message, data: string[]): Promise<any> {
        let limit: number = 3;
        let log: {versions: any[], title: string}|any = await parseChangelog('./CHANGELOG.md');
        let versions = log.versions;
        if (data[0] && !data[0].includes('.')) {
            limit = parseInt(data[0]);
        } else if (data[0] && data[0].includes('.')) {
            versions = versions.filter((o: any) => o.version === data[0]);
            limit = 1;
            if (versions.length === 0) {
                await message.reply('Version string `'+data[0]+'` was not found!');
                return;
            }
        }
        let versionStr = new TextDecoder().decode(execSync("git describe --tag --always")).replace('\n','');
        let embed = new MessageEmbed();
        embed.setTitle('Changelog');
        embed.setDescription(`Current version: **${versionStr}**`);
        for (const version of versions.splice(0,limit)) {
            let str = '';
            for (const [key, value] of Object.entries(version.parsed)) {
                if (key === '_') continue;
                str += '**'+key+'**\n-';
                // @ts-ignore
                str += value.join('\n-');
                str += '\n';
            }
            embed.addField(version.version,'>>> '+str+'');
        }
        embed.setURL('https://github.com/nicti/blpi-drifter/blob/main/README.md');
        await message.reply({embeds: [embed]});
    }

    getAccessLevel(): number {
        return 0;
    }

    help(): { name: string; value: string } {
        return {name: "`changelog`", value: "Displays current tag and the changelog"};
    }



}