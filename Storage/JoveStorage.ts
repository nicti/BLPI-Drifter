import {JsonDB} from 'node-json-db';
import {GoogleSpreadsheet} from "google-spreadsheet";
import {AxiosInstance} from "axios";
import {Message} from "discord.js";
import AdvancedLogger from "../utils/AdvancedLogger";


export default class JoveStorage {
    static POSSIBLE_VALUES = [
        'B', 'C', 'V', 'S', 'R', '-',
        'B-', 'C-', 'V-', 'S-', 'R-'
    ];
    static WHS = [
        'B', 'C', 'V', 'S', 'R'
    ];
    db: JsonDB;
    esi: AxiosInstance;
    logger: AdvancedLogger;

    constructor(esi: AxiosInstance, logger: AdvancedLogger) {
        this.db = new JsonDB('jove.json');
        this.esi = esi;
        this.logger = logger;
    }

    public async importFromGoogle(message: Message): Promise<boolean | string> {
        this.db.delete('region');
        let skippedSystems = [];
        let msg = await message.channel.send('Starting import... 000%');
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
            drifterRegion.splice(-1, 1);
            let region = drifterRegion.shift();
            region = region.replace(/ /g, '_');
            let systems: { [index: string]: any } = {};
            for (let j = 0; j < drifterRegion.length; j++) {
                if (drifterRegion[j].length < 3) {
                    skippedSystems.push(drifterRegion[j]);
                    continue;
                }
                let esiSystem = null;
                do {
                    try {
                        esiSystem = (await this.esi.get('/v2/search/?categories=solar_system&datasource=tranquility&language=en&strict=true&search='+drifterRegion[j])).data.solar_system;
                    } catch (e) {
                        esiSystem = null;
                    }
                } while (esiSystem === null);
                if (typeof esiSystem === "undefined") {
                    skippedSystems.push(drifterRegion[j]);
                    continue;
                } else {
                    esiSystem = esiSystem[0];
                }
                const drifterSystem = drifterRegion[j].replace(/ /g, '_');
                if (!systems.hasOwnProperty(drifterSystem)) {
                    systems[drifterSystem] = {
                        updated: '',
                        whs: [],
                        id: esiSystem
                    };
                }
            }
            await this.db.push('region/' + region, systems);
            await msg.edit('Starting import... '+(((i+1)/drifterInfo.length)*100).toString().padStart(3,'0')+'%');
        }
        await msg.edit('~~'+msg.content+'~~ **DONE**\nSkipped: '+skippedSystems.join(', '));
        return true;
    }

    public async getForRegion(region: string): Promise<any> {
        return await this.db.getData('region/' + region);
    }

    public async getRegions(): Promise<any> {
        return await this.db.getData('region');
    }

    public async resetOutdated(region: string | null = null) {
        if (region === null) {
            let regions = await this.db.getData('region');
            for (const regionsKey in regions) {
                if (regions.hasOwnProperty(regionsKey)) {
                    let systems = regions[regionsKey];
                    await this.resetOutdatedRegion(regionsKey, systems);
                }
            }
        } else if ((await this.db.exists('region/' + region))) {
            let systems = await this.db.getData('region/' + region);
            await this.resetOutdatedRegion(region, systems);
        } else {
            this.logger.error('Region ' + region + ' not found in database!');
        }
    }

    private async resetOutdatedRegion(region: string, systems: any[]) {
        let currentTime = (new Date).valueOf();
        for (const systemsKey in systems) {
            if (systems.hasOwnProperty(systemsKey)) {
                let system = systems[systemsKey];
                let diff = (currentTime - system.updated);
                if (diff > (1000 * 60 * 60 * 16)) {
                    await this.db.push('region/' + region + '/' + systemsKey, {
                        updated: '',
                        whs: [],
                        id: system.id
                    });
                } else {
                    if (system.whs.filter((wh: string) => wh.match(/[BCVSR]-/)) && diff > (1000 * 60 * 60 * 4)) {
                        for (let i = 0; i < system.whs.length; i++) {
                            if (system.whs[i].match(/[BCVSR]-/)) {
                                system.whs.splice(i, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    public async setWHs(system: string, whs: [] | string[], date: string | null = null): Promise<string | boolean> {
        for (let i = 0; i < whs.length; i++) {
            let wh = whs[i];
            if (!JoveStorage.POSSIBLE_VALUES.includes(wh)) {
                return 'Undefined WH identifier: ' + wh;
            }
        }
        if (whs.length === 1 && whs[0] === '-') {
            whs = [];
        }
        let regions = await this.db.getData('region');
        for (const regionsKey in regions) {
            if (regions.hasOwnProperty(regionsKey) && regions[regionsKey].hasOwnProperty(system)) {
                let sys = await this.db.getData('region/' + regionsKey + '/' + system);
                let updated;
                if (date === null) {
                    updated = (new Date()).valueOf();
                } else {
                    updated = (new Date(date)).valueOf();
                }
                await this.db.push('region/' + regionsKey + '/' + system, {
                    updated: updated,
                    whs: whs,
                    id: sys.id
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
                        if (entry.whs.includes(type + '-')) {
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

    public async findById(id: number): Promise<any|boolean> {
        let returnData: any = {
            region: "",
            name: "",
            data: {}
        };
        let regions = await this.db.getData('region');
        for (const regionKey in regions) {
            if (regions.hasOwnProperty(regionKey)) {
                let region = regions[regionKey];
                for (const systemKey in region) {
                    if (region.hasOwnProperty(systemKey)) {
                        let entry: any = region[systemKey];
                        if (entry.id === id) {
                            returnData.region = regionKey;
                            returnData.name = systemKey;
                            returnData.data = entry;
                        }
                    }
                }
            }
        }
        if (returnData.name === "") {
            return false;
        }
        return returnData;
    }

    public async addSystem(region: string, system: string, id: number) {
        region = region.replace(/ /g,'_');
        await this.db.push('region/' + region + '/' + system, {
            updated: '',
            whs: [],
            id: id
        });
    }

    public async removeSystem(region: string, system: string) {
        region = region.replace(/ /g,'_');
        await this.db.delete('region/' + region + '/' + system);
    }
}