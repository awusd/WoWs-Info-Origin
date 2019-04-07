/**
 * Search.js
 * 
 * This is the search screen to find players and clans
 */

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import * as Anime from 'react-native-animatable';
import { WoWsInfo, SectionTitle, PlayerCell } from '../../component';
import { getCurrDomain, getCurrPrefix, getCurrServer, setLastLocation } from '../../value/data';
import { Guard, SafeFetch } from '../../core';
import { WoWsAPI } from '../../value/api';
import { Friend } from './Friend';
import { lang } from '../../value/lang';
import { FlatGrid } from 'react-native-super-grid';

class Search extends Component {
  constructor(props) {
    super(props);
    setLastLocation('Search');
    this.state = {
      search: '',
      server: '',
      result: {player: [], clan: []},
      online: '???',
      showFriend: true
    };

    const domain = getCurrDomain();
    // com -> na
    this.prefix = getCurrPrefix();

    SafeFetch.get(WoWsAPI.PlayerOnline, domain).then(num => {
      let online = Guard(num, 'data.wows.0.players_online', '???');
      this.setState({online: online});
    });
  }

  render() {
    const { search, online } = this.state;
    const { searchBar, scroll } = styles;
    return (
      <WoWsInfo hideAds title={lang.menu_footer} onPress={() => this.refs['search'].focus()}>
        <Anime.View animation='fadeInDown' useNativeDriver duration={500}>
          <Searchbar ref='search' value={search} style={searchBar} placeholder={`${this.prefix.toUpperCase()} - ${online} ${lang.search_player_online}`}
            onChangeText={this.searchAll} autoCorrect={false} autoCapitalize='none' />
        </Anime.View>
        <ScrollView style={scroll} keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
          { this.renderContent() }
        </ScrollView>
      </WoWsInfo>
    )
  }

  renderContent() {
    const { search, result, showFriend } = this.state;
    if (showFriend && search.length < 2) {
      return <Friend />;
    } else {
      let playerLen  = result.player.length;
      let clanLen  = result.clan.length;
      return (
        <View>
          <SectionTitle title={`${lang.menu_search_clan} - ${clanLen}`}/>
          { clanLen > 0 ?
            <FlatGrid items={result.clan} itemDimension={300} renderItem={({item}) => {
              return <PlayerCell key={item.clan_id} item={item} clan/>
            }} spacing={0} keyboardShouldPersistTaps='always'/> : null }
          <SectionTitle title={`${lang.menu_search_player} - ${playerLen}`}/>
          { playerLen > 0 ?
            <FlatGrid items={result.player} itemDimension={300} renderItem={({item}) => {
              return <PlayerCell key={item.account_id} item={item} player/>
            }} spacing={0} keyboardShouldPersistTaps='always'/> : null }
        </View>
      );
    }
  }

  /**
   * Search player and clan
   */
  searchAll = (text) => {
    // Reset search
    if (text.length < 2) this.setState({result: {player: [], clan: []}});
    this.setState({search: text});

    // Clear timeout everytime for efficient data request
    clearTimeout(this.delayedRequest);
    this.delayedRequest = setTimeout(() => {
      let domain = getCurrDomain();
      // Save all clans and players
      let all = {player: [], clan: []};
      let length = text.length;
      
      if (length > 1 && length < 6) {
        // For clan, only 2 - 5
        SafeFetch.get(WoWsAPI.ClanSearch, domain, text).then(result => {
          let data = Guard(result, 'data', null);
          if (data == null) {
            // Error here
          } else {
            data.forEach(v => v.server = getCurrServer());
            all.clan = data;
            this.setState({result: all});
          }
        });
      }

      if (length > 2) {
        // For player, 3+
        SafeFetch.get(WoWsAPI.PlayerSearch, domain, text).then(result => {
          let data = Guard(result, 'data', null);
          if (data == null) {
            // Error here
          } else {
            data.forEach(v => v.server = getCurrServer());
            all.player = data;
            this.setState({result: all});
          }
        });
      }
    }, 500);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchBar: {
    position: 'absolute',
    zIndex: 2,
    top: 16,
    left: 16, right: 16,
    borderRadius: 100
  },
  scroll: {
    marginTop: 64
  }
});

export { Search };
