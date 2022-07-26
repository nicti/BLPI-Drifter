import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";

export default class Show extends CommandInterface {
    async execute(message: Message, data: string[]): Promise<any> {
        data.forEach((e,i) => data[i] = this.capitalizeFirstLetter(e.toLowerCase()))
        let regionSearchName = data.join(' ');
        let ids = (await this.esi.post('/v1/universe/ids/',[regionSearchName])).data
        if (ids['regions']) {
            if (ids['regions'].length !== 1) {
                await message.channel.send('Search resulted in several hits, please specify.');
                return
            }
            let regionId = ids['regions'][0].id
            let region = (await this.esi.get('/v1/universe/regions/'+regionId+'/')).data;
            let regionName = region.name.replace(/ /g,'_');
            await this.jove.resetOutdated(regionName);
            let joveRegionalInfo = await this.jove.getForRegion(regionName);
            let str = '';
            let link = [];
            for (const key in joveRegionalInfo) {
                if (joveRegionalInfo.hasOwnProperty(key)){
                    link.push(key);
                    let systems = '';
                    systems = joveRegionalInfo[key].whs.join(',');
                    if (systems === '') systems = '-';
                    let date;
                    if (joveRegionalInfo[key].updated === '') {
                        date = '';
                    } else {
                        let dateObj = new Date(joveRegionalInfo[key].updated);
                        date = dateObj.getUTCFullYear().toString()+'-'+(dateObj.getUTCMonth()+1).toString().padStart(2,'0')+'-'+(dateObj.getUTCDate()).toString().padStart(2,'0')+
                            ' '+dateObj.getUTCHours().toString().padStart(2,'0')+':'+dateObj.getUTCMinutes().toString().padStart(2,'0')+' UTC';
                    }
                    str += key+': '+systems+' ['+date+']\n';
                }
            }
            await message.channel.send(region.name+':```'+str+'```https://evemaps.dotlan.net/map/'+regionName+'/'+link.join(':'));
        } else {
            await message.channel.send('Could not find region matching `'+regionSearchName+'`.');
        }
    }

    help(): { name: string; value: string } {
        return {name: "`show <region>`", value: "Shows all drifter data for a given region"};
    }

    getAccessLevel(): number {
        return 0;
    }

    capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}