import {JsonDB} from "node-json-db";
import axios from "axios";

const esi = axios.create({
    baseURL: 'https://esi.evetech.net',
});

export default class Universe {
    db: JsonDB;
    constructor() {
        this.db = new JsonDB('universe.json');
    }

    public async buildRegionCache() {
        esi.get('/v1/universe/regions/').then((response) => {
            for (let i = 0; i < response.data.length; i++) {
                let regionId = response.data[i];
                esi.get('/v1/universe/regions/'+regionId+'/').then(async (region) => {
                    await this.db.push('universe/region/'+regionId,{
                        id: regionId,
                        name: region.data.name,
                        constellations: region.data.constellations
                    })
                })
            }
        });
    }

    public async buildConstellationCache() {
        esi.get('/v1/universe/constellations/').then((response) => {
            for (let i = 0; i < response.data.length; i++) {
                let constellationsId = response.data[i];
                esi.get('/v1/universe/constellations/'+constellationsId+'/').then(async (constellations) => {
                    await this.db.push('universe/constellation/'+constellationsId,{
                        id: constellationsId,
                        name: constellations.data.name,
                        systems: constellations.data.systems,
                        region_id: constellations.data.region_id
                    })
                })
            }
        });
    }

    public async buildSystemCache() {
        esi.get('/v1/universe/systems/').then((response) => {
            for (let i = 0; i < response.data.length; i++) {
                let systemId = response.data[i];
                esi.get('/v4/universe/systems/'+systemId+'/').then(async (system) => {
                    await this.db.push('universe/system/'+systemId,{
                        id: systemId,
                        name: system.data.name,
                        constellation_id: system.data.constellation_id
                    })
                })
            }
        });
    }

}