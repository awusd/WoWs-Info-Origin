/**
 * Warship.js
 * 
 * 
 */

import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { WoWsInfo, WarshipCell } from '../../component';
import GridView from 'react-native-super-grid';
import { SAVED, LOCAL } from '../../value/data';
import { Portal, TextInput, Button, Divider, List, Modal, Checkbox, Colors, Surface } from 'react-native-paper';
import lang from '../../value/lang';
import { SafeAction, getKeyByValue, getTierList } from '../../core';
import { ThemeColour } from '../../value/colour';

class Warship extends Component {
  constructor(props) {
    super(props);

    console.log('WIKI - Warship');
    let warship = DATA[SAVED.warship];
    let sorted = Object.entries(warship).sort((a, b) => {
      // Sort by tier, then by type
      if (a[1].tier === b[1].tier) return a[1].type.localeCompare(b[1].type);
      else return b[1].tier - a[1].tier;
    });

    // Remove extra information (ship id)
    sorted.forEach((s, i) => sorted[i] = Object.assign(s[1]));
    this.original = sorted;
    console.log(sorted);

    this.state = {
      data: sorted
    };
  }

  render() {
    const { data } = this.state;

    return (
      <WoWsInfo title={`${lang.wiki_warship_footer} - ${data.length}`} 
        onPress={() => SafeAction('WarshipFilter', {applyFunc: this.filterShip})}>
        <GridView itemDimension={100} items={data} renderItem={(item) => {
          return <WarshipCell scale={1.4} item={item} onPress={() => SafeAction('WarshipDetail', {item: item})}/>
        }}/>
      </WoWsInfo>
    )
  };

  filterShip(data) {
    const { premium, name, nation, type, tier } = data;
    
    if (premium === false && name == '' && nation === [] && type === [] && tier === []) {
      this.setState({data: this.original});
    }
    
    normalise = (nation, type, tier) => {
      let data = {nation: {}, type: {}, tier: {}};
  
      nation.forEach(i => {
        data.nation[getKeyByValue(DATA[SAVED.encyclopedia].ship_nations, i)] = true;
      });
  
      type.forEach(i => {
        data.type[getKeyByValue(DATA[SAVED.encyclopedia].ship_types, i)] = true;
      });
  
      tier.forEach(i => {
        data.tier[getTierList().indexOf(i) + 1] = true;
      });
  
      return data;
    }

    // nation, type and tier need to be normalised
    let fname = name.toLowerCase();
    let fdata = normalise(nation, type, tier);
    let ftier = fdata.tier;
    let fnation = fdata.nation;
    let ftype = fdata.type;

    console.log(fdata);

    let warship = DATA[SAVED.warship];
    let filtered = [];
    for (let ID in warship) {
      let curr = warship[ID];

      let filterTier = false;
      let filterName = false;
      let filterNation = false;
      let filterType = false;
      let filterPremium = false;

      // It includes this name or name is empty
      if (curr.name.toLowerCase().includes(fname) || fname.trim() === "") {
        filterName = true;
      }

      // ANote that if premium is not selected, all ships are valid
      if (curr.premium === premium || premium === false) {
        filterPremium = true;
      }

      // SAme tier or ftier is 0 (no value)
      if (ftier[curr.tier] || ftier === 0) {
        filterTier = true;
      }

      // Match or no value
      if (fnation[curr.nation] || !fnation) {
        filterNation = true;
      }

      // Match or no value
      if (ftype[curr.type] || !ftype) {
        filterType = true;
      }

      // Add this ship if all condition matches
      if (filterName && filterNation && filterPremium && filterTier && filterType) {
        filtered.push(curr);
      }
    }

    let sorted = filtered.sort((a, b) => {
      // Sort by tier, then by type
      if (a.tier === b.tier) return a.type.localeCompare(b.type);
      else return b.tier - a.tier;
    });

    console.log(sorted);
    this.setState({data: sorted});
  }

  searchWarship() {
    const { tier, nation, type, name, premium } = this.state;

    console.log(tier, nation, type, name, premium);

    let fname = name.toLowerCase();
    let ftier = getTierList().indexOf(tier) + 1;
    let fnation = getKeyByValue(DATA[SAVED.encyclopedia].ship_nations, nation);
    let ftype = getKeyByValue(DATA[SAVED.encyclopedia].ship_types, type);

    console.log(DATA[SAVED.encyclopedia], ftier, fnation, ftype, fname, premium);
    
    let warship = DATA[SAVED.warship];
    let filtered = [];
    for (let ID in warship) {
      let curr = warship[ID];

      let filterTier = false;
      let filterName = false;
      let filterNation = false;
      let filterType = false;
      let filterPremium = false;

      // It includes this name or name is empty
      if (curr.name.toLowerCase().includes(fname) || fname.trim() === "") {
        filterName = true;
      }

      // ANote that if premium is not selected, all ships are valid
      if (curr.premium === premium || premium === false) {
        filterPremium = true;
      }

      // SAme tier or ftier is 0 (no value)
      if (curr.tier === ftier || ftier === 0) {
        filterTier = true;
      }

      // Match or no value
      if (curr.nation === fnation || !fnation) {
        filterNation = true;
      }

      // Match or no value
      if (curr.type === ftype || !ftype) {
        filterType = true;
      }

      // Add this ship if all condition matches
      if (filterName && filterNation && filterPremium && filterTier && filterType) {
        filtered.push(curr);
      }
    }

    let sorted = filtered.sort((a, b) => {
      // Sort by tier, then by type
      if (a.tier === b.tier) return a.type.localeCompare(b.type);
      else return b.tier - a.tier;
    });

    this.setState({data: sorted, filter: false});
    this.resetFilter();
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  input: {
    padding: 4
  },
  apply: {
    padding: 8
  }
});

export { Warship };
