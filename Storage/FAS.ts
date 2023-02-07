import JoveStorage from "./JoveStorage";
import {sys} from "ping";

export default class FAS {
  db: Array<string>
  regions: Array<string>
  jove: JoveStorage

  constructor(jove: JoveStorage) {
    this.db = []
    this.regions = []
    this.jove = jove
  }

  public async reindex(): Promise<boolean> {
    this.db = [];
    let regions = await this.jove.getRegions();
    for (const [region, regionData] of Object.entries(regions) as [string, any]) {
      this.regions.push(region.replaceAll('_', ' '))
      for (const [system, systemData] of Object.entries(regionData) as [string, any]) {
        this.db.push(system);
      }
    }
    return true;
  }

  public async find(system: string): Promise<string> {
    let originalSystem: string = system;
    if (this.db.includes(system)) {
      return system;
    }
    system = FAS.capitalizeFirstLetter(system.toLowerCase());
    if (this.db.includes(system)) {
      return system;
    }
    system = system.toUpperCase();
    if (this.db.includes(system)) {
      return system;
    }
    return originalSystem;
  }

  public async search (system: string): Promise<string[]> {
    return this.db.filter((e: string) => e.toLowerCase().startsWith(system.toLowerCase()))
  }

  public getLength() {
    return this.db.length;
  }

  public getRegions() {
    return this.regions;
  }

  private static capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}