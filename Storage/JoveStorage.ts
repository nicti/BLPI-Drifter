import {JsonDB} from 'node-json-db';
import {GoogleSpreadsheet} from "google-spreadsheet";
import {config} from 'dotenv';

config();


export default class JoveStorage {
    static POSSIBLE_VALUES = [
        'B','C','V','S','R','-',
        'B-','C-','V-','S-','R-'
    ];
    static WHS = [
        'B','C','V','S','R'
    ];
    db: JsonDB;
    constructor() {
        this.db = new JsonDB('jove.json');
    }

    public async importFromGoogle(): Promise<boolean|string> {
        const {GOOGLE_API, GOOGLE_SHEET} = process.env;
        if (typeof GOOGLE_API === "undefined" || typeof GOOGLE_SHEET === "undefined") {
            return "Please make sure GOOGLE_API and GOOGLE_SHEET are defined in .env!";
        }
        const doc = new GoogleSpreadsheet(GOOGLE_SHEET);
        await doc.useApiKey(GOOGLE_API);
        await doc.loadInfo();
        const drifterSheet = doc.sheetsByIndex[0];
        // @ts-ignore Needs to be this call due to missing header in 3rd party sheet.
        const drifterInfo = await drifterSheet.getCellsInRange('A9:AO72');
        for (let i = 0; i < drifterInfo.length; i++) {
            let drifterRegion = drifterInfo[i];
            drifterRegion.splice(-1,1);
            let region = drifterRegion.shift();
            region = region.replace(/ /g,'_');
            let  systems: {[index: string]: any} = {};
            for (let j = 0; j < drifterRegion.length; j++) {
                const drifterSystem = drifterRegion[j].replace(/ /g,'_');
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
                        if (diff > (1000*60*60*16)) {
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

    public async setWHs(system: string, whs: []|string[]): Promise<string | boolean> {
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

    public async findByType(type: string): Promise<any> {
        let returns: any = {
            stable: [],
            unstable: []
        };
        let regions = await this.db.getData('region');
        for (const regionKey in regions) {
            if (regions.hasOwnProperty(regionKey)) {
                let region = regions[regionKey];
                for (const systemKey in region) {
                    if (region.hasOwnProperty(systemKey)) {
                        let entry: any = region[systemKey];
                        if (entry.whs.includes(type)) {
                            returns.stable.push({
                                region: regionKey,
                                system: systemKey,
                                updated: entry.updated
                            });
                        }
                        if (entry.whs.includes(type+'-')) {
                            returns.unstable.push({
                                region: regionKey,
                                system: systemKey,
                                updated: entry.updated
                            });
                        }
                    }
                }
            }
        }
        return returns;
    }
}