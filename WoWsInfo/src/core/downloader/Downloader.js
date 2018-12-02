import { WoWsAPI, WikiAPI } from '../../value/api';
import { SERVER, APP, LOCAL, SAVED } from '../../value/data';
import { SafeFetch, Guard, SafeStorage, langStr } from '../';

class Downloader {
  constructor(server) {
    // Convert server index to string
    this.server = SERVER[server];
    this.language = langStr();

    // To prevent when first launch, everything is new and too many dots
    this.new = !DATA[LOCAL.firstLaunch];
    console.log(this.new);

    console.log(`Downloader\nYou server is '${this.server}'`);
  }

  /**
   * Update all data if there is a new version except for force mode
   * @param {Boolean} force 
   */
  async updateAll(force=false) {
    // Get server version
    console.log('Downloader\nChecking for new version');
    try {
      let gameVersion = await this.getVersion();
      let currVersion = DATA[LOCAL.gameVersion];
      console.log(`Current: ${currVersion}\nAPI: ${gameVersion}`);
      if (gameVersion > currVersion || force) {
        // Update all data
        console.log('Downloader\nUpdating all data from API');
        // Download language
        DATA[SAVED.language] = await this.getLanguage();
        // Download ship type, nation and module names for Wiki
        DATA[SAVED.encyclopedia] = await this.getEncyclopedia();
  
        // Wiki
        DATA[SAVED.warship] = await this.getWarship();
        DATA[SAVED.achievement] = await this.getAchievement();
        DATA[SAVED.collection] = await this.getCollectionAndItem();
        DATA[SAVED.commanderSkill] = await this.getCommanderSkill();
        DATA[SAVED.consumable] = await this.getConsumable();
        DATA[SAVED.map] = await this.getMap();
        DATA[SAVED.pr] = await this.getPR();
  
        console.log(DATA);
      }
      // Update this value only if all data are saved correctly
      SafeStorage.set(LOCAL.gameVersion, gameVersion);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get game server version of WoWs
   */
  async getVersion() {
    let json = await SafeFetch.get(WoWsAPI.GameVersion, this.server);
    // Guard ensures that there is always a value returned
    return Guard(json, 'data.game_version', APP.GameVersion);
  }

  /**
   * Get all supported languages locally
   */
  async getLanguage() {
    let json = await SafeFetch.get(WikiAPI.Language, this.server);
    let data = Guard(json, 'data.languages', {});
    // Save data
    await SafeStorage.set(SAVED.language, data);
    return data; 
  }
  
  /**
   * Get ship types, nations and module names
   */

  async getEncyclopedia() {
    let json = await SafeFetch.get(WikiAPI.Encyclopedia, this.server, this.language);
    let data = Guard(json, 'data', {});
    await SafeStorage.set(SAVED.encyclopedia, data);
    return data;
  }

  ///
  //  UPDATE API to my unique data format
  //
  //  icon -> This is the icon the list will use
  //  description -> This is used under the icon
  //  name -> ship name, consumable name...
  //  new -> if this entry is new
  //
  ///

  async getWarship() {
    let pageTotal = 1;
    let page = 0;
    let all = {};

    while (page < pageTotal) {
      // page + 1 to get actually page not index
      let json = await SafeFetch.get(WikiAPI.Warship, this.server, `&page_no=${page+1}&${this.language}`);
      pageTotal = Guard(json, 'meta.page_total', 1);
      let data = Guard(json, 'data', {});

      for (let id in data) {
        let curr = data[id];
        if (curr.name.startsWith('[')) {
          delete data[id];
        } else {
          curr.icon = curr.images.small;
          delete curr.images;
          // Orange name or not
          curr.premium = curr.is_premium || curr.is_special;
          delete curr.is_premium;
          delete curr.is_special;
          // If it is undefined then it is new
          if (this.new === true) {
            curr.new = DATA[SAVED.warship][id] ? false : true;
          }
        }
      }

      // Add to all
      Object.assign(all, data);
      page++;
    }

    await SafeStorage.set(SAVED.warship, all);
    return all;
  }

  async getAchievement() {
    let json = await SafeFetch.get(WikiAPI.Achievement, this.server, `${this.language}`);
    let data = Guard(json, 'data.battle', {});
    if (this.new === true) {
      for (let id in data) {
        let curr = data[id];
        console.log(DATA[SAVED.achievement][id]);
        curr.new = DATA[SAVED.achievement][id] ? false : true;
      }
    }
    await SafeStorage.set(SAVED.achievement, data);
    return data;
  }

  async getCollectionAndItem() {
    let all = {};

    let collection = await SafeFetch.get(WikiAPI.Collection, this.server, `${this.language}`);
    let item = await SafeFetch.get(WikiAPI.CollectionItem, this.server, `${this.language}`);

    collection = Guard(collection, 'data', {});
    item = Guard(item, 'data', {});
    
    for (let id in item) {
      let curr = item[id];
      curr.image = curr.images.small;
      delete curr.images;
    }

    if (this.new === true) {
      for (let id in collection) {
        let curr = collection[id];
        curr.new = DATA[SAVED.collection]['collection'][id] ? false : true;
      }
    }

    all['collection'] = collection;
    all['item'] = item;

    await SafeStorage.set(SAVED.collection, all);
    return all;
  }

  async getCommanderSkill() {
    let json = await SafeFetch.get(WikiAPI.CommanderSkill, this.server, `${this.language}`);

    let skill = Guard(json, 'data', []);
    let data = Object.keys(skill).map(k => skill[k]);
    data.sort((a, b) => a.tier - b.tier);

    await SafeStorage.set(SAVED.commanderSkill, data);
    return data;
  }

  async getConsumable() {
    let pageTotal = 1;
    let page = 0;
    let all = {};

    while (page < pageTotal) {
      // page + 1 to get actually page not index
      let json = await SafeFetch.get(WikiAPI.Consumable, this.server, `&page_no=${page+1}&${this.language}`);
      pageTotal = Guard(json, 'meta.page_total', 1);
      let data = Guard(json, 'data', {});

      if (this.new === true) {
        for (let id in data) {
          let curr = data[id];
          curr.new = DATA[SAVED.consumable][id] ? false : true;
        }
      }

      // Add to all
      Object.assign(all, data);
      page++;
    }

    await SafeStorage.set(SAVED.consumable, all);
    return all;
  }

  async getMap() {
    let json = await SafeFetch.get(WikiAPI.GameMap, this.server, `${this.language}`);

    let map = Guard(json, 'data', []);
    let data = Object.keys(map).map(k => map[k]);

    await SafeStorage.set(SAVED.map, data);
    return data;
  }

  async getPR() {
    console.log(`Not SafeFetch\n${WikiAPI.PersonalRating}`);
    let res = await fetch(WikiAPI.PersonalRating);

    let json = {};
    if (res.status === 200) {
      json = Guard(await res.json(), 'data', {});
      // Cleanup empty key
      for (let key in json) {
        let curr = json[key];
        if (curr.length === 0) {
          delete json[key];
        }
      }
    }
      
    await SafeStorage.set(SAVED.pr, json);
    return json;
  }
}

export { Downloader };
