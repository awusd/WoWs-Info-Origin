/**
 * Collection.js
 * 
 * 
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { WoWsInfo, WikiIcon } from '../../component';
import { SAVED } from '../../value/data';
import { SafeAction } from '../../core';
import { Title, Paragraph } from 'react-native-paper';
import { TintColour } from '../../value/colour';

class Collection extends Component {
  constructor(props) {
    super(props);

    console.log('WIKI - Collection');

    let collection = [];
    let isCollection = false;
    if (props.item) {
      // Inside a single collection
      collection = props.item;
      isCollection = true;
    } else {
      // Display all available collections
      let saved = DATA[SAVED.collection].collection;
      Object.keys(saved).forEach(k => {
        collection.push(saved[k]);
      })
    }

    console.log(collection);
    this.state = {
      data: collection,
      collection: isCollection,
      header: isCollection ? collection.shift() : null
    }
  }

  render() {
    const { label } = styles;
    const { data, collection, header } = this.state;

    let ID = '';
    // This is to prevent setting ID inside the collection page
    if (data.length > 0 && data[0].card_id) ID = data[0].collection_id;

    return (
      <WoWsInfo title={ID}>
        <FlatGrid inverted={!collection} itemDimension={80} items={data} renderItem={({item}) => {
          return <WikiIcon item={item} onPress={() => this.itemOrCollection(item)}/>
        }} ListHeaderComponent={() => {
          if (collection) {
            return (
              <View style={{padding: 8}}>
                <WikiIcon item={header} scale={1.6}/>
                <Title style={[label, {color: TintColour()[500]}]}>{header.name}</Title>
                <Paragraph style={label}>{header.description}</Paragraph>
              </View>
            )
          } else return null;
        }}/>
      </WoWsInfo>
    )
  };

  /**
   * Filter collection items with id 
   * @param {*} item 
   */
  itemOrCollection(item) {
    if (item.card_id) {
      // This is an item
      SafeAction('BasicDetail', {item: item});
    } else {
      // This is an collection
      let id = item.collection_id;
      let items = DATA[SAVED.collection].item;
  
      let collectionItems = [];
      collectionItems.push(DATA[SAVED.collection].collection[id]);
      for (let one in items) {
        let curr = items[one];
        if (curr.collection_id === id) {
          collectionItems.push(curr);
        }
      }
      SafeAction('Collection', {item: collectionItems}, 1);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    textAlign: 'center',
    alignSelf: 'center'
  }
});

export { Collection };
