import axios from 'axios';
import {Client} from "discord.js";
import AdvancedLogger from "../utils/AdvancedLogger";

const esi = axios.create({
    baseURL: 'https://esi.evetech.net',
});

export default class Pings {
    logger: AdvancedLogger;

    constructor(logger: AdvancedLogger) {
        this.logger = logger;
    }


    public async statusAll(client: Client): Promise<{esiPing: string, esiHealth: any, discordPing: number, discordHealth: any}> {
        return {
            esiPing: await Pings.pingEsi(),
            esiHealth: await Pings.healthEsi(),
            discordPing: client.ws.ping,
            discordHealth: await Pings.healthDiscord()
        };
    }

    private static async pingEsi(): Promise<any> {
        try {
            let esiPing = await esi.get('/ping');
            return esiPing.data;
        } catch (e) {
            return 'Unknown';
        }
    }

    private static async healthEsi(): Promise<any> {
        let data;
        let status: number = 0;
        try {
            data = (await esi.get('/status.json?version=latest'));
            status = data.status;
            if (typeof data.data === "undefined") {
                data = [];
            } else {
                data = data.data;
            }
        } catch (e: any) {
            status = e.response.status;
        }
        let length;
        if (status === 200) {
            length = data.length;
        } else {
            length = 1;
        }
        let statusNumbers = {
            green: 0,
            yellow: 0,
            red: 0,
            unknown: 0,
            total: length
        };
        if (status === 200) {
            for (let i = 0; i < data.length; i++) {
                let endpoint = data[i];
                switch (endpoint.status) {
                    case 'green':
                        statusNumbers.green += 1;
                        break;
                    case 'yellow':
                        statusNumbers.yellow += 1;
                        break;
                    case 'red':
                        statusNumbers.red += 1;
                        break;
                    default:
                        statusNumbers.unknown += 1;
                }
            }
        }
        return statusNumbers;
    }

    private static async healthDiscord(): Promise<any> {
        let status = (await axios.get('https://srhpyqt94yxb.statuspage.io/api/v2/status.json')).data.status;
        switch (status.indicator) {
            case 'none':
                return 'GREEN';
            case 'minor':
                return 'YELLOW';
            case 'major':
            case 'critical':
                return 'RED';
            default:
                return 'UNKNOWN';
        }
    }






}