/**
 * WarshipModule.js
 * 
 * 
 */

import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { WoWsInfo, PriceLabel, Space } from '../../component';
import { SafeFetch, langStr, getCurrServer } from '../../core';
import { WoWsAPI } from '../../value/api';
import { Actions } from 'react-native-router-flux';
import { SAVED } from '../../value/data';
import { SectionGrid } from 'react-native-super-grid';
import { ThemeBackColour } from '../../value/colour';
import { List, Text, Caption } from 'react-native-paper';
import lang from '../../value/lang';

class WarshipModule extends Component {
  constructor(props) {
    super(props);

    const { ship_id, modules_tree } = props.data;
    this.server = getCurrServer();

    this.state = {
      ship_id: ship_id,
      module: {
        Artillery: '',
        DiveBomber: '',
        Engine: '',
        Fighter: '',
        FlightControl: '',
        Hull: '',
        Suo: '',
        TorpedoBomber: '',
        Torpedoes: ''
      },
      tree: modules_tree,
      // Data needed for section grid
      section: this.makeSection(props.data)
    };
  }

  render() {
    const { section } = this.state;
    return (
      <WoWsInfo title={lang.warship_apply_module} onPress={() => this.getNewModule()}>
        <FlatList data={section} renderItem={({item}) => {
          return (
            <View key={item.title}>
              <List.Section title={item.title}>
                { item.data.map(d => {
                  return this.renderModule(d);
                }) }
              </List.Section>
            </View>
          );
        }} keyExtractor={(_, i) => String(i)} inverted ListFooterComponent={<Space />}/>
      </WoWsInfo>
    )
  };

  renderModule(ID) {
    const { tree, module } = this.state;
    const { name, price_xp, price_credit } = tree[ID];
    const { xp } = styles;

    let selected = false;
    for (let name in module) {
      if (module[name] === ID) {
        selected = true;
        break;
      }
    }

    return (
      <List.Item style={selected ? ThemeBackColour() : null} title={name} description={price_credit} onPress={() => this.updateModule(tree, ID)}
        right={() => price_xp > 0 ? <Caption style={xp}>{`${price_xp} xp`}</Caption> : null}/>
    );
  }

  updateModule(tree, ID) {
    let module = Object.assign(this.state.module);
    module[tree[ID].type] = ID;
    this.setState({module});
  }

  makeSection(data) {
    const { modules, modules_tree } = data;

    let moduleName = DATA[SAVED.encyclopedia].ship_modules;

    let section = [];
    for (let key in modules) {
      let curr = modules[key];
      if (curr.length > 1) {
        // Ignore empty or one module, you cannot update them anyway
        let sorted = curr.sort((a, b) => {
          let aM = modules_tree[a];
          let bM = modules_tree[b];
          if (aM.price_xp !== bM.price_xp) {
            // Sort by XP (more xp, more advanced)
            return aM.price_xp - bM.price_xp;
          } else if (aM.next_modules != null && bM.next_modules != null) {
            // They all have next module, we need to check check the id
            if (aM.next_modules[0] == b) return -1;
            else return 1;
          } else {
            // Whoever is not null comes first
            return aM.next_modules != null ? -1 : 1;
          }
        });

        let obj = {title: moduleName[this.normaliseKey(key)], data: sorted};
        section.push(obj);
      }
    }
    return section;
  }

  /**
   * hello_world becomes HelloWorld
   * @param {*} key 
   */
  normaliseKey(key) {
    let names = key.split('_');
    upperFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    names.map((n, i) => names[i] = upperFirst(n));

    console.log(names);
    let name = names.join('');
    // Seriously??
    if (name === 'FireControl') name = 'Suo';
    return name;
  }

  getNewModule() {
    const { ship_id, module } = this.state;
    const {
      Artillery,
      DiveBomber,
      Engine,
      Fighter,
      FlightControl,
      Hull,
      Suo,
      TorpedoBomber,
      Torpedoes
    } = module;

    console.log(module);

    SafeFetch.get(WoWsAPI.ShipModule, this.server, ship_id, Artillery, DiveBomber, Engine, Fighter, 
      Suo, FlightControl, Hull, TorpedoBomber, Torpedoes, langStr()).then(json => {
      Actions.popTo('WarshipDetail');
      if (json && json.data[ship_id]) {
        // Just pass profile back (override default_profile)
        setTimeout(() => {
          Actions.refresh({module: json.data[ship_id]});
        });
      } else {
        // Error
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  xp: {
    paddingRight: 4,
    alignSelf: 'center'
  }
});

export { WarshipModule };
