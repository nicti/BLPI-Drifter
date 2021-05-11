import { JsonDB } from 'node-json-db';
import {GoogleSpreadsheet} from "google-spreadsheet";
import { config } from 'dotenv';
config();


export default class JoveStorage {
    static POSSIBLE_VALUES = [
        'B','C','V','S','R','-',
        'B-','C-','V-','S-','R-'
    ];
    db: JsonDB;
    constructor() {
        this.db = new JsonDB('jove.json');
    }

    public async importFromGoogle(): Promise<boolean> {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET);
        await doc.useApiKey(process.env.GOOGLE_API);
        await doc.loadInfo();
        const drifterSheet = doc.sheetsByIndex[0];
        const drifterInfo = await drifterSheet.getCellsInRange('A9:AO72');
        for (let i = 0; i < drifterInfo.length; i++) {
            let drifterRegion = drifterInfo[i];
            drifterRegion.splice(-1,1);
            let region = drifterRegion.shift().replaceAll(' ','_');
            let systems = {};
            for (let j = 0; j < drifterRegion.length; j++) {
                const drifterSystem = drifterRegion[j].replaceAll(' ','_');
                systems[drifterSystem] = {
                    updated: '',
                    whs: []
                };
            }
            await this.db.push('region/'+region, systems);
        }
        return true;
    }

    public async getForRegion(region: string): Promise<any> {
        return await this.db.getData('region/'+region);
    }

    public async resetOutdated() {
        let currentTime = (new Date).valueOf();
        let regions = await this.db.getData('region');
        for (const regionsKey in regions) {
            if (regions.hasOwnProperty(regionsKey)) {
                let systems = regions[regionsKey];
                for (const systemsKey in systems) {
                    if (systems.hasOwnProperty(systemsKey)) {
                        let system = systems[systemsKey];
                        let diff = (currentTime - system.updated);
                        if (diff > (1000*60*60*24)) {
                            await this.db.push('region/'+regionsKey+'/'+systemsKey,{
                                updated: '',
                                whs: []
                            });
                        }
                    }
                }
            }
        }
    }

    public async setWHs(system: string, whs: []|[string]): Promise<string | boolean> {
        for (let i = 0; i < whs.length; i++) {
            let wh = whs[i];
            if (!JoveStorage.POSSIBLE_VALUES.includes(wh)) {
                return 'Undefined WH identifier: '+wh;
            }
        }
        if (whs.length === 1 && whs[0] === '-') {
            whs = [];
        }
        let regions = await this.db.getData('region');
        for (const regionsKey in regions) {
            if (regions.hasOwnProperty(regionsKey) && regions[regionsKey].hasOwnProperty(system)) {
                await this.db.push('region/'+regionsKey+'/'+system,{
                    updated: (new Date()).valueOf(),
                    whs: whs
                });
                return true;
            }
        }
        return 'Could not find system in jove list';
    }
}