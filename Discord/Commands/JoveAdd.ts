import CommandInterface from "./CommandInterface";
import {Message} from "discord.js";
import {sys} from "ping";

export default class JoveAdd extends CommandInterface {

  async execute(message: Message, data: string[]): Promise<any> {
    let system = data[0];
    if (system.length < 3) {
      await message.channel.send('System name must be at least 3 characters long.');
      return;
    }
    let searchResults = (await this.esi.get('/v2/search/?categories=solar_system&datasource=tranquility&language=en&strict=false&search='+system)).data.solar_system;
    if (typeof searchResults === "undefined") {
      await message.reply('`'+system+'` did not return a valid object. Please double check the entered system name!');
      return;
    }
    if (searchResults.length > 1) {
      await message.reply('`'+system+'` returned multiple results. Please enter the exact system name!');
      return;
    }
    let esiSystemData = (await this.esi.get('/v4/universe/systems/'+searchResults[0]+'/')).data;
    let systemName = esiSystemData.name;
    let systemId = esiSystemData.system_id;
    let esiConstellationData = (await this.esi.get('/v1/universe/constellations/'+esiSystemData.constellation_id+'/')).data;
    let esiRegionData = (await this.esi.get('/v1/universe/regions/'+esiConstellationData.region_id+'/')).data;
    let regionName = esiRegionData.name;
    let existence = await this.jove.findById(systemId);
    if (!existence) {
      await message.reply('System `'+systemName+'` is already in the list of jove systems!');
      return;
    }
    let rundown = await this.provideYesNoPrompt(message,'Do you want to add the system `'+systemName+'` in the region `'+regionName+'` to the list of jove systems?');
    if (rundown) {
      await this.jove.addSystem(regionName,systemName,systemId);
      await message.reply('System `'+systemName+'` added to region `'+regionName+'`!');
    }
  }

  help(): { name: string; value: string } {
    return {name: "`joveadd <system>`", value: "Adds a system to the list of jove systems"};
  }

  getAccessLevel(): number {
    return 1;
  }



}