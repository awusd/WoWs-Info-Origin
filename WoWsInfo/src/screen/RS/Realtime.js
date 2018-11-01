import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TextInput, Dimensions } from 'react-native';
import GridView from 'react-native-super-grid';
import { Divider } from 'react-native-elements';
import { ShipInfo, PlayerSearch, PersonalRating } from '../../core';
import { API } from '../../constant/value';
import sample from '../../local.json';
import { ShipInfoCell, WoWsLoading } from '../../component/';
import { Language } from '../../core';
import { navStyle } from '../../constant/colour';
import { iconsMap } from '../../constant/icon';
import { Green, Red } from 'react-native-material-color';

export default class Realtime extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  }

  state = {
    port: '',
    list: null,
    input: '',
    json: ''
  }

  render() {
    const { container } = styles;
    const { port, input } = this.state;
    console.log(this.state);
    if (port === '') {
      return (
        <View>
          <TextInput value={input} ref='input' placeholder='Please enter the address you see (eg 192.168.1.*)' 
            onChangeText={t => this.setState({input: t})} onEndEditing={() => {
              this.getAllPlayerInfo().then(() => {
                // Add interval to keep updating
                // setInterval(() => {
                //   this.getAllPlayerInfo()
                // }, 15000);
                // Update state
                this.setState({port: 'done'});
              })
          }}/>
        </View>
      )
    } else {
      return (
        <View style={container}>
          { this.renderBasicInfo() }
          { this.renderPlayers() }
        </View>
      )
    }
  }

  /**
   * Render basic map information
   * @param {*} data 
   */
  renderBasicInfo() {
    const { json } = this.state;
    if (json) {
      const { duration, gameLogic, mapName,
        name, matchGroup, playerName } = json;
      const { basicInfo, logic, horizontal, mapInfo } = styles;
  
      let min = duration / 60;
      let map = mapName.split('_').slice(2).join(' ').toUpperCase();
  
      return (
        <View style={basicInfo}>
          <Text style={logic}>{map}</Text>
          <View style={horizontal}>
            <View style={mapInfo}>
              <Text>{matchGroup}</Text>
              <Text style={{color: Green, fontSize: 24}}>Allies</Text>
            </View>
            <View style={mapInfo}>
              <Text>{gameLogic}</Text>
              <Text>{name}</Text>
            </View>
            <View style={mapInfo}>
              <Text>{`${min} min`}</Text>
              <Text style={{color: Red, fontSize: 24}}>Enemies</Text>
            </View>
          </View>
        </View>
      )
    }
  }

  renderPlayers() {
    const { horizontal } = styles;
    console.log(this.state);
    const { list } = this.state;
    let allies = Array.prototype.filter.call(list, p => p.relation <= 1);
    let enemies = Array.prototype.filter.call(list, p => p.relation > 1);
    console.log(allies);
    if (list) {
      return (
        <View style={horizontal}>
          <FlatList data={allies} renderItem={({item}) => {
            return this.renderPlayerCell(item);
          }}/>
          <FlatList data={enemies} renderItem={({item}) => {
            return this.renderPlayerCell(item);
          }}/>
        </View>
      )
    } else return <WoWsLoading />
  }

  renderPlayerCell(item) {
    const { ap, avg_damage, battles, win_rate, name, ship_id, index } = item;
    const { playerName, shipName, stat } = styles;
    let ship = data.warship[ship_id];
    if (ship) {
      const { icon, type } = ship;
      let shipName = ship.name;

      // get ship width
      const { width } = Dimensions.get('window');
      let ratingColour = PersonalRating.getColour(index);
      let comment = PersonalRating.getComment(index);

      return (
        <View>
          <Text style={shipName}>{`${shipName} (${ap})`}</Text>
          <Image source={{uri: icon}} resizeMode='contain' 
            style={{alignItems: 'center', height: 100, width: width / 2 - 16}}/>
          <Text numberOfLines={1} style={playerName}>{name}</Text>
          <Text style={stat}>{`${battles} - ${win_rate}% - ${avg_damage}`}</Text>
          <View style={{width: width / 2 - 16, borderRadius: 8, height: 16,
            marginBottom: 16, backgroundColor: ratingColour}} />
        </View>
      )
    } else {
      return <Text>UNKNOWN</Text>
    }
  }

  async getAllPlayerInfo() {
    let res = await fetch(`http://${this.state.input}:8605`)
    if (res.status === 200) {
      let rs = await res.json();
      // Prevent duplicate data loading
      if (rs.length != 0) {
        this.setState({json: rs, list: null})
        const { vehicles } = rs;
        // We need to get user id and then get user stat for shipId
        let playerList = [];
        for (let player of vehicles) {
          const { shipId, relation, name } = player;
          if (!name.startsWith(':')) {
            let player = new PlayerSearch(global.server, name);
            let playerData = await player.Search();
            if (playerData) {
              let id = playerData[0].id;
              let ship = new ShipInfo(`${id}&ship_id=${shipId}`, global.server);
              let shipData = await ship.getShipInfo();
              if (shipData[0]) {
                let curr = Object.assign(shipData[0]);
                console.log(curr);
                curr.relation = relation;
                curr.id = id;
                curr.name = name;
                if (rslist.findIndex(p => p === name) > -1) {
                  // We met before
                  curr.friend = true;
                } else {
                  // Add name to rslist to keep track of met players
                  global.rslist.push(name);
                }
                curr.server = global.server;
                playerList.push(curr);
              }
            }
          }
        }

        // Sort by AP
        playerList.sort((x, y) => {
          return y.ap - x.ap;
        })

        this.setState({list: playerList});
      }
    } else {
      alert('Please check your IP address')
    }
  }

  /**
   * Get All gamemode and their info
   */
  getGameMode() {
    var format = require('string-format');
    var api = format(API.GameMode, global.domain) + Language.getApiLangStr();
    console.log(api);
    return fetch(api).then(res => {
      if (res.status === 200) return res.json();
    }).catch(error => console.error(error));
  }

  pushToPlayer = (item) => {
    this.props.navigator.push({
      title: String(item.id),
      screen: 'search.player',
      backButtonTitle: '',              
      navigatorStyle: navStyle(),
      navigatorButtons: item.id == user_info.id ? null : {
        rightButtons: friend.find(x => x.id === item.id) 
          ? [{icon: iconsMap['star'], id: 'star-o'}]
          : [{icon: iconsMap['star-o'], id: 'star'}]
      },
      passProps: item
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  basicInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  mapInfo: {
    alignItems: 'center'
  },
  logic: {
    fontSize: 32,
    textAlign: 'center',
    width: '100%',
    fontWeight: '500'
  },
  playerName: {
    fontWeight: '500',
    fontSize: 17
  },
  shipName: {
    fontWeight: '300',
  },
  stat: {
    fontWeight: '300',
    fontSize: 16
  },
  horizontal: {
    padding: 8,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})