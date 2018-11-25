/**
 * Consumable.js
 * 
 * Display flag and camouflage or upgrade.
 * There are two modes for this page
 */

import React, { Component } from 'react';
import { View, SafeAreaView, Image, StyleSheet } from 'react-native';
import GridView from 'react-native-super-grid';
import { Surface, Text } from 'react-native-paper';
import { BackButton, LoadingModal, WikiIcon } from '../../component';
import { SAVED, LOCAL } from '../../value/data';

class Consumable extends Component {
  constructor(props) {
    super(props);
    const { upgrade } = props;

    // Load data depending on 'upgrade' prop
    let data = [];
    let consumable = DATA[SAVED.consumable];
    for (let key in consumable) {
      let curr = consumable[key];

      if (upgrade && curr.type === 'Modernization') {
        data.push(curr);
      } else if (!upgrade && curr.type !== 'Modernization') {
        data.push(curr);
      }
    }

    // Create sections for new and old consumables

    data.sort((a, b) => {
      if (!upgrade) {
        // Flags first then camouflages
        if (a.type === 'Flags') return -1;
        else return 1;
      }

      // Sort by price
      if (a.price_gold === 0) {
        return a.price_credit - b.price_credit;
      } else {
        return a.price_gold - b.price_gold;
      }
    })

    this.state = {
      data: data
    }
  }

  render() {
    const { container } = styles;

    return (
      <Surface style={container}>
        <SafeAreaView>
          { this.renderGrid() }
          <BackButton />
        </SafeAreaView>
      </Surface>
    )
  };

  renderGrid() {
    const { data } = this.state;
    if (!data) return <LoadingModal />;

    return (
      <GridView itemDimension={64} items={data} renderItem={item => {
        return <WikiIcon item={item}/>
      }}/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export { Consumable };
