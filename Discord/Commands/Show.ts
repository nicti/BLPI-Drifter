import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";

export default class Show extends CommandInterface {
    async execute(message: Message, data: string[]): Promise<any> {
        let regionSearchName = data[0];
        if (regionSearchName.length < 3) {
            await message.channel.send('Region name must be at least 3 characters long.');
            return;
        }
        let searchResults = (await this.esi.get('/v2/search/?categories=region&datasource=tranquility&language=en&strict=false&search='+regionSearchName)).data.region;
        if (typeof searchResults === "undefined") {
            await message.channel.send('Could not find region matching `'+regionSearchName+'`.');
            return;
        }
        if (searchResults.length > 1) {
            await message.channel.send('Search resulted in several hits, please specify.');
            return;
        }
        let region = (await this.esi.get('/v1/universe/regions/'+searchResults[0]+'/')).data;
        let regionName = region.name.replace(/ /g,'_');
        await this.jove.resetOutdated();
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
    }

    help(): { name: string; value: string } {
        return {name: "`show <region>`", value: "Shows all drifter data for a given region"};
    }

}