/**
 * Load all saved data to global
 */
import { SafeStorage } from '../util/SafeStorage';
import { LOCAL, SAVED, APP } from '../../value/data';
import { BLUE } from 'react-native-material-color';

class DataLoader {
  /**
   * Load all data from storage
   * Return an object with all data
   */
  static async loadAll() {
    // For debugging only
    // SafeStorage.clear();

    let local = await this.loadLocal();
    let saved = await this.loadSaved();
    return Object.assign(local, saved);
  }

  /**
   * Load all local data, no Internet is required
   * @param {*} data 
   */
  static async loadLocal() {
    const { apiLanguage, appVersion, gameVersion, firstLaunch, friendList, userData, 
      userInfo, userServer, lastUpdate, theme, darkMode, date, swapButton } = LOCAL;

    let data = {};
    // Manully setting up SAVED section (they are all different)
    this.loadEntry(data, apiLanguage, 'en');
    this.loadEntry(data, swapButton, false);
    this.loadEntry(data, appVersion, APP.Version);
    this.loadEntry(data, gameVersion, '0.7.12.0');
    this.loadEntry(data, firstLaunch, true);
    this.loadEntry(data, friendList, [{nickname: 'HenryQuan', account_id: '2011774448', server: 3}]);
    this.loadEntry(data, userData, {});
    this.loadEntry(data, userInfo, {nickname: '', account_id: '', server: ''});
    this.loadEntry(data, userServer, 3);
    this.loadEntry(data, lastUpdate, new Date().toDateString());
    this.loadEntry(data, theme, BLUE);
    this.loadEntry(data, darkMode, false);
    this.loadEntry(data, date, new Date().toDateString());
    return data;
  }

  /**
   * Load all saved data, Internet connection is required
   * @param {*} data 
   */
  static async loadSaved() {
    let data = {};
    // SAVED section is about the same
    for (let key in SAVED) {
      const curr = SAVED[key];
      // Get it from storage
      data[curr] = await SafeStorage.get(curr, {});
    }
    return data;
  }

  /**
   * Load and setup entries
   * @param {object} data 
   * @param {string} key 
   * @param {any} value 
   */
  static async loadEntry(data, key, value) {
    data[key] = await SafeStorage.get(key, value);
  }
}

export { DataLoader };
