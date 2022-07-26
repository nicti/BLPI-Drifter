import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";

export default class Closest extends CommandInterface {

    async execute(message: Message, data: string[]): Promise<any> {
        // find system
        let systemSearchName = data.join(' ');
        let ids = (await this.esi.post('/v1/universe/ids/',[systemSearchName])).data
        if (ids['systems']) {
            if (ids['systems'].length !== 1) {
                await message.channel.send('Search resulted in several hits, please specify.');
                return
            }
            let solarSystemId = ids['systems'][0].id
            let regions = await this.jove.getRegions();
            let pairs: any[] = [];
            for (const [region, regionData] of Object.entries(regions) as [string, any]) {
                for (const [system, systemData] of Object.entries(regionData) as [string, any]) {
                    if (!pairs.includes('30000380|' + systemData.id)) {
                        pairs.push('30000380|' + systemData.id);
                    }
                }
            }
            let i, j, chunk = 100, chunks = [];
            for (i = 0, j = pairs.length; i < j; i += chunk) {
                chunks.push(pairs.slice(i, i + chunk));
            }
            let routes = [];
            for (let k = 0; k < chunks.length; k++) {
                let chunk = chunks[k];
                let request = '/v1/route/30000380/' + solarSystemId + '/?connections=' + chunk.join(',');
                let route = (await this.esi.get(request)).data;
                routes.push(route);
            }
            let shortest = routes.reduce(function(p,c) {return p.length>c.length?c:p;},{length:Infinity});
            let system = await this.jove.findById(shortest[1]);
            let date;
            if (system.data.updated === "") {
                date = "";
            } else {
                let dateObj = new Date(system.data.updated);
                date = dateObj.getUTCFullYear().toString()+'-'+(dateObj.getUTCMonth()+1).toString().padStart(2,'0')+'-'+(dateObj.getUTCDate()).toString().padStart(2,'0')+
                    ' '+dateObj.getUTCHours().toString().padStart(2,'0')+':'+dateObj.getUTCMinutes().toString().padStart(2,'0')+' UTC';
            }
            let whList = "-";
            if (system.data.whs.length) {
                whList = system.data.whs.join(',');
            }
            let str = system.name+': '+whList+' ['+date+']';
            await message.reply('Closest Jove system is '+system.name+'!```'+str+'```https://evemaps.dotlan.net/map/'+system.region+'/'+system.name);
        } else {
            await message.channel.send('Could not find system matching `'+systemSearchName+'`.');
        }
    }

    help(): { name: string; value: string } {
        return {name: "`closest <system>`", value: "Finds the closest jove system to a given system."};
    }

    getAccessLevel(): number {
        return 0;
    }

}