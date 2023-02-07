import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";

export default class JoveAdd extends CommandInterface {

  registerCommand() {
    return null;
  }

  async execute(message: Message, data: string[]): Promise<any> {
    let systemSearchName = data.join(' ');
    let ids = (await this.esi.post('/v1/universe/ids/',[systemSearchName])).data
    if (ids['systems']) {
      if (ids['systems'].length !== 1) {
        await message.reply('`'+systemSearchName+'` returned multiple results. Please enter the exact system name!');
        return
      }
      let solarSystemId = ids['systems'][0].id
      let esiSystemData = (await this.esi.get('/v4/universe/systems/'+solarSystemId+'/')).data;
      let systemName = esiSystemData.name;
      let systemId = esiSystemData.system_id;
      let esiConstellationData = (await this.esi.get('/v1/universe/constellations/'+esiSystemData.constellation_id+'/')).data;
      let esiRegionData = (await this.esi.get('/v1/universe/regions/'+esiConstellationData.region_id+'/')).data;
      let regionName = esiRegionData.name;
      let existence = await this.jove.findById(systemId);
      if (existence) {
        await message.reply('System `'+systemName+'` is already in the list of jove systems!');
        return;
      }
      let rundown = await this.provideYesNoPrompt(message,'Do you want to add the system `'+systemName+'` in the region `'+regionName+'` to the list of jove systems?');
      if (rundown) {
        await this.jove.addSystem(regionName,systemName,systemId);
        await message.reply('System `'+systemName+'` added to region `'+regionName+'`!');
      }
    } else {
      await message.reply('`'+systemSearchName+'` did not return a valid object. Please double check the entered system name!');
    }
  }

  help(): { name: string; value: string } {
    return {name: "`joveadd <system>`", value: "Adds a system to the list of jove systems"};
  }

  getAccessLevel(): number {
    return 1;
  }

  executeInteraction (interaction: any): Promise<any> {
    return Promise.resolve(undefined)
  }



}