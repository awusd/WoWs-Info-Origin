import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { WoWsInfo, WarshipCell, Touchable, RatingButton, FooterPlus } from '../../component';
import { getOverallRating, roundTo, getComment, getColourList, getColour, SafeAction } from '../../core';
import { FlatGrid } from 'react-native-super-grid';
import { SAVED } from '../../value/data';
import { Text, IconButton } from 'react-native-paper';
import lang from '../../value/lang';

class PlayerShip extends Component {
  constructor(props) {
    super(props);

    let ships = props.data;
    let rating = props.rating;
    if (rating == null) {
      // Prevent unnessary
      rating = getOverallRating(ships);
    }
    console.log(ships);

    this.state = {
      data: ships.sort((a, b) => b.ap - a.ap),
      rating: rating
    };
  }

  render() {
    const { centerText, horizontal, icon, centerView } = styles;
    const { data, rating } = this.state;
    return (
      <WoWsInfo title={`${lang.wiki_warship_footer} - ${data.length}`}>
        <FlatGrid itemDimension={150} items={data} renderItem={({item}) => {
          let ship = DATA[SAVED.warship][item.ship_id];
          const { battles, wins, damage_dealt } = item.pvp;

          let nothing = false;
          if (battles === 0) nothing = true;
          return (
            <Touchable onPress={() => SafeAction('PlayerShipDetail', {data: item})}>
              <WarshipCell item={ship} scale={1.8}/>
              <View style={horizontal}>
                <View style={centerView}>
                  <Image style={icon} source={require('../../img/Battle.png')}/>
                  <Text style={centerText}>{nothing ? '0' : battles}</Text>
                </View>
                <View style={centerView}>
                  <Image style={icon} source={require('../../img/WinRate.png')}/>
                  <Text style={centerText}>{nothing ? '0.00%' : `${roundTo(wins / battles * 100, 2)}%`}</Text>
                </View>
                <View style={centerView}>
                  <Image style={icon} source={require('../../img/Damage.png')}/>
                  <Text style={centerText}>{nothing ? '0' : roundTo(damage_dealt / battles)}</Text>
                </View>
              </View>
              <View style={{backgroundColor: getColour(item.rating), height: 12, borderRadius: 99}}/>
            </Touchable>
          )
        }}/>
        <FooterPlus style={{padding: 8}}>
          <RatingButton rating={rating}/>
        </FooterPlus>
      </WoWsInfo>
    )
  };
}

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  centerText: {
    alignSelf: 'center'
  },
  centerView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: 24,
    width: 24
  }
});

export { PlayerShip };
