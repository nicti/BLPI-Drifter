import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";
import mysql, {Connection, FieldInfo, MysqlError} from "mysql";
import {AxiosInstance} from "axios";
import JoveStorage from "../../Storage/JoveStorage";

export default class PFAdd extends CommandInterface {
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
            'AND `connection`.`updated` > DATE_SUB(CURDATE(), INTERVAL 1 DAY);', async (error: MysqlError | null, results: Array<any>) => {
            if (error) {
                message.reply('SQL Connection failed: `' + error+'`');
                return;
            }
            let dataGroup: any = {
                V: [], //31000003
                R: [], //31000006
                S: [], //31000001
                B: [], //31000002
                C: []  //31000004
            };
            results.forEach((v: any) => {
                let src: string = '', tgt: string = '';
                if (PFAdd.drifterIds.includes(v.src)) {
                    src = v.src;
                    tgt = v.tgt;
                } else if (PFAdd.drifterIds.includes(v.tgt)) {
                    src = v.tgt;
                    tgt = v.src;
                } else {
                    message.reply('Could not define source and target system!');
                    return;
                }
                switch (src.toString()) {
                    case '31000003':
                        dataGroup.V.push({target:tgt,updated:new Date(v.updated).valueOf()});
                        break;
                    case '31000006':
                        dataGroup.R.push({target:tgt,updated:new Date(v.updated).valueOf()});
                        break;
                    case '31000001':
                        dataGroup.S.push({target:tgt,updated:new Date(v.updated).valueOf()});
                        break;
                    case '31000002':
                        dataGroup.B.push({target:tgt,updated:new Date(v.updated).valueOf()});
                        break;
                    case '31000004':
                        dataGroup.C.push({target:tgt,updated:new Date(v.updated).valueOf()});
                        break;
                }
            })
            for (const [key, value] of Object.entries(dataGroup) as [key: string, value: any]) {
                if (value.length) {
                    let msg = 'Adding '+key+'```';
                    for (let i = 0; i < value.length; i++) {
                        let v = value[i];
                        let dateObj = new Date(v.updated);
                        let date = dateObj.getUTCFullYear().toString()+'-'+(dateObj.getUTCMonth()+1).toString().padStart(2,'0')+'-'+(dateObj.getUTCDate()).toString().padStart(2,'0')+
                            ' '+dateObj.getUTCHours().toString().padStart(2,'0')+':'+dateObj.getUTCMinutes().toString().padStart(2,'0')+' UTC';
                        msg += v.target+' ['+date+']';
                    }
                    msg += '```';
                    await message.channel.send(msg);
                }
            }
        })
    }

    getAccessLevel(): number {
        return 0;
    }

    help(): { name: string; value: string } {
        return {name: "`pfload`", value: "Loads connections from pathfinder."};
    }

}