/**
 * Warship.js
 * 
 * 
 */

import React, { Component } from 'react';
import { TextInput, FlatList, StyleSheet } from 'react-native';
import { WoWsInfo, WarshipCell } from '../../component';
import GridView from 'react-native-super-grid';
import { SAVED, LOCAL } from '../../value/data';
import { Portal, Dialog, Button, Divider, List, Checkbox, Colors } from 'react-native-paper';
import lang from '../../value/lang';

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
    console.log(sorted);

    this.state = {
      data: sorted,
      // Filter system
      filter: false,
      tier: lang.wiki_warship_filter_tier,
      nation: lang.wiki_warship_filter_nation,
      type: lang.wiki_warship_filter_type,
      name: '',
      premium: false,
      // 0 for none expanded
      accordion: 0
    };
  }

  render() {
    const { container, input, apply } = styles;
    const { data, filter, tier, nation, type, name, premium, accordion } = this.state;

    const tierList = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'XI', 'X'];

    let nations = DATA[SAVED.encyclopedia].ship_nations;
    let nationList = [];
    Object.keys(nations).forEach(k => nationList.push(nations[k]));

    let types = DATA[SAVED.encyclopedia].ship_types;
    let typeList = [];
    Object.keys(types).forEach(k => typeList.push(types[k]));

    const textColour = DATA[LOCAL.darkMode] ? 'white' : Colors.grey900;

    return (
      <WoWsInfo title={lang.wiki_warship_footer} onPress={() => this.setState({filter: true})}>
        {/* <GridView itemDimension={96} items={data} renderItem={(item) => {
          return <WarshipCell item={item}/>
        }}/> */}

        <Portal>
          <Dialog theme={{roundness: 16}} visible={filter} onDismiss={this.dismissFilter}>
            <Dialog.ScrollArea>
              <TextInput style={input} value={name} onChangeText={text => this.setState({name: text})}
                autoCorrect={false} autoCapitalize='none' placeholder={lang.wiki_warship_filter_placeholder}/>
              <List.Item title={lang.wiki_warship_filter_premiumm} 
                right={() => <Checkbox status={premium ? 'checked' : 'unchecked'}/>}/>             
              <List.Accordion title={tier} expanded={accordion === 1}
                onPress={() => this.hideAccordion(1)}>
                <FlatList data={tierList} renderItem={({item}) => {
                  return <Button color={textColour} style={{flex: 1}} onPress={() => null}>{item}</Button>
                }} numColumns={2} keyExtractor={item => item}/>
              </List.Accordion>
              <List.Accordion title={nation} expanded={accordion === 2}
                onPress={() => this.hideAccordion(2)}>
                <FlatList data={nationList} renderItem={({item}) => {
                    return <Button color={textColour} style={{flex: 1}} onPress={() => null}>{item}</Button>
                  }} numColumns={2} keyExtractor={item => item}/>
              </List.Accordion>
              <List.Accordion title={type} expanded={accordion === 3}
                onPress={() => this.hideAccordion(3)}>
                <FlatList data={typeList} renderItem={({item}) => {
                    return <Button color={textColour} style={{flex: 1}} onPress={() => null}>{item}</Button>
                  }} numColumns={2} keyExtractor={item => item}/>
              </List.Accordion>
              <Button style={apply} onPress={this.dismissFilter}>{lang.wiki_warship_filter_btn}</Button>
            </Dialog.ScrollArea>
          </Dialog>
        </Portal>
      </WoWsInfo>
    )
  };

  dismissFilter = () => this.setState({filter: false});

  hideAccordion(num) {
    const { accordion } = this.state;
    if (accordion === num) this.setState({accordion: 0});
    else this.setState({accordion: num});
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  input: {
    padding: 16, marginTop: 16
  },
  apply: {
    padding: 8
  }
});

export { Warship };
