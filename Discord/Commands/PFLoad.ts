import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";
import mysql, {Connection, MysqlError} from "mysql";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";

export default class PFLoad extends CommandInterface {
    connection: Connection;
    static drifterIds = [31000003,31000006,31000001,31000002,31000004]
    
    constructor(esi: AxiosInstance, jove: JoveStorage) {
        super(esi, jove);
        this.connection = mysql.createConnection({
            host        : process.env.MYSQL_HOST,
            user        : process.env.MYSQL_USER,
            password    : process.env.MYSQL_PASS,
            database    : process.env.MYSQL_DATA
        });
    }
    
    async execute(message: Message, data: string[]): Promise<any> {
        this.connection.query('SELECT `sourceTbl`.`systemId` AS `src`,`targetTbl`.`systemId` as `tgt`,`connection`.`updated` as `updated` FROM `connection`\n' +
            'JOIN `system` AS sourceTbl ON `connection`.`source`=`sourceTbl`.`id`\n' +
            'JOIN `system` AS targetTbl ON `connection`.`target`=`targetTbl`.`id`\n' +
            'WHERE (`sourceTbl`.`systemId` IN (31000003,31000006,31000001,31000002,31000004)\n' +
            'OR `targetTbl`.`systemId` IN (31000003,31000006,31000001,31000002,31000004))\n' +
            'AND `connection`.`updated` > DATE_SUB(CURDATE(), INTERVAL 16 HOUR);', async (error: MysqlError | null, results: Array<any>) => {
            if (error) {
                await message.reply('SQL Connection failed: `' + error+'`');
                return;
            }
            let changes: any = []
            for (const v of results) {
                let src: string = '', tgt: string = '';
                if (PFLoad.drifterIds.includes(v.src)) {
                    src = v.src;
                    tgt = v.tgt;
                } else if (PFLoad.drifterIds.includes(v.tgt)) {
                    src = v.tgt;
                    tgt = v.src;
                } else {
                    await message.reply('Could not define source and target system!');
                    continue;
                }

                let wh = '';
                switch (src.toString()) {
                    case '31000003':
                        wh = 'V';
                        break;
                    case '31000006':
                        wh = 'R';
                        break;
                    case '31000001':
                        wh = 'S';
                        break;
                    case '31000002':
                        wh = 'B';
                        break;
                    case '31000004':
                        wh = 'C';
                        break;
                }

                let oldData = await this.jove.findById(parseInt(tgt));
                let existingChange = changes.find((entry: any) => entry.id === src);
                if (typeof existingChange !== 'undefined' && existingChange.length > 0) {
                    existingChange.newData.push(wh)
                } else {
                    changes.push({
                        region: oldData.region,
                        id: oldData.data.id,
                        system: oldData.name,
                        oldData: oldData.data.whs,
                        newData: [wh]
                    })
                }
            }

            let changesGroupedByRegion: any = {}
            for (const change of changes) {
                if (changesGroupedByRegion.hasOwnProperty(change.region)) {
                    changesGroupedByRegion[change.region].push(change);
                } else {
                    changesGroupedByRegion[change.region] = [];
                    changesGroupedByRegion[change.region].push(change);
                }
            }
            let msg = 'The following changes will get pulled from the pathfinder database:\n';
            for (const [key, value] of Object.entries(changesGroupedByRegion) as [key: string, value: any]) {
                if (value.length) {
                    msg += key+'```';
                    for (let i = 0; i < value.length; i++) {
                        let v = value[i];
                        msg += v.system+' ['+v.oldData.join(',')+'] => ['+v.newData.join(',')+']';
                    }
                    msg += '```';
                }
            }
            await message.reply(msg);
            if (await this.provideYesNoPrompt(message,'Do you want to pull these changes?')) {
                let pfloadMsg = await message.reply('Pathfinder loading starting...');
                for (const change of changes) {
                    await this.jove.setWHs(change.system, change.newData);
                }
                await pfloadMsg.edit('Pathfinder loading complete!');
            } else {
                await message.reply('Pathfinder loading canceled!');
            }
        })
    }

    getAccessLevel(): number {
        return 1;
    }

    help(): { name: string; value: string } {
        return {name: "`pfload`", value: "Loads connections from pathfinder."};
    }

}