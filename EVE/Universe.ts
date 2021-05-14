import {JsonDB} from "node-json-db";
import axios from "axios";

const esi = axios.create({
    baseURL: 'https://esi.evetech.net',
});

export default class Universe {
    static CACHE_TYPES: string[] = [
        'regions',
        'constellations',
        'systems'
    ];
    db: JsonDB;
    constructor() {
        this.db = new JsonDB('universe.json');
    }

    public async secureCache() {
        for (let i = 0; i < Universe.CACHE_TYPES.length ; i++) {
            // @ts-ignore
            let cacheType: 'regions'|'constellations'|'systems' = Universe.CACHE_TYPES[i];
            if (!await this.cacheExists(cacheType)) {
                await this.buildCache(cacheType);
            }
        }
    }

    private async buildCache(type: 'regions'|'constellations'|'systems') {
        switch (type) {
            case "regions":
                await this.buildRegionCache();
                break;
            case "constellations":
                await this.buildConstellationCache();
                break;
            case "systems":
                await this.buildSystemCache();
                break;
        }
    }

    private async buildRegionCache() {
        esi.get('/v1/universe/regions/').then(async (response) => {
            for (let i = 0; i < response.data.length; i++) {
                let regionId = response.data[i];
                let region = await esi.get('/v1/universe/regions/'+regionId+'/');
                await this.db.push('universe/regions/'+regionId,{
                    id: regionId,
                    name: region.data.name,
                    constellations: region.data.constellations
                });
                console.log('[region cache]: '+(i+1)+'/'+response.data.length);
            }
        });
    }

    private async buildConstellationCache() {
        esi.get('/v1/universe/constellations/').then(async (response) => {
            for (let i = 0; i < response.data.length; i++) {
                let constellationsId = response.data[i];
                let constellations = await esi.get('/v1/universe/constellations/'+constellationsId+'/');
                await this.db.push('universe/constellations/'+constellationsId,{
                    id: constellationsId,
                    name: constellations.data.name,
                    systems: constellations.data.systems,
                    region_id: constellations.data.region_id
                });
                console.log('[constellation cache]: '+(i+1)+'/'+response.data.length);
            }
        });
    }

    private async buildSystemCache() {
        esi.get('/v1/universe/systems/').then(async (response) => {
            for (let i = 0; i < response.data.length; i++) {
                let systemId = response.data[i];
                let system = await esi.get('/v4/universe/systems/'+systemId+'/');
                let adjustedSystems: string[] = [];
                for (let j = 0; j < system.data.stargates.length; j++) {
                    let stargateId = system.data.stargates[j];
                    let stargate = await esi.get('/v1/universe/stargates/'+stargateId+'/');
                    adjustedSystems.push(stargate.data.destination.system_id);
                }
                 await this.db.push('universe/systems/'+systemId,{
                     id: systemId,
                     name: system.data.name,
                     constellation_id: system.data.constellation_id,
                     adjusted: adjustedSystems
                 });
                 console.log('[System cache]: '+(i+1)+'/'+response.data.length);
            }
        });
    }

    private async cacheExists(type: 'regions'|'constellations'|'systems') {
        let idCount = await esi.get('/latest/universe/'+type+'/');
        if (!this.db.exists('universe/'+type)) {
            return false;
        }
        let typeData = await this.db.getData('universe/'+type);
        return (idCount.data.length === Object.keys(typeData).length);
    }

}