import React, { PureComponent } from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import { Surface, Button, IconButton, Title } from 'react-native-paper';
import { LoadingIndicator, WoWsInfo, LoadingModal, FooterPlus, TabButton } from '../../component';
import { SafeFetch, Guard } from '../../core';
import { WoWsAPI } from '../../value/api';
import { getDomain, langStr } from '../../value/data';
import { TintColour } from '../../value/colour';
import lang from '../../value/lang';

class Statistics extends PureComponent {
  constructor(props) {
    super(props);
    const { account_id, nickname, server } = props.info;

    this.state = {
      name: nickname,
      id: account_id,
      server: server,
      // Valid data or hidden account
      valid: true,
      hidden: false,
      // To check if certain data have been loaded correctly
      achievement: false,
      rank: false,
      ship: false,
      basic: false,
      graph: false
    };

    // Save domain
    this.domain = getDomain(server);
    console.log(this.domain);
    // Save theme colour
    this.theme = TintColour()[500];

    if (this.domain != null) {
      this.getBasic();
      this.getAchievement();
      this.getShip();
      this.getRank();
    } else {
      // Invalid domain
      this.setState({valid: false});
    }
  }

  /**
   * Get basic player info
   */
  getBasic() {
    const { server, id } = this.state;
    SafeFetch.get(WoWsAPI.PlayerInfo, getDomain(server), id).then(data => {
      // Check if account is hidden
      console.log(data);
      let hidden = Guard(data, 'meta.hidden', null);
      let hiddenAccount = false;
      if (hidden != null) {
        // If hidden is not null, it is hidden
        hiddenAccount = true;
        this.setState({hidden: true});
      }

      // Get player data here
      let player = Guard(data, `data.${id}`, null);
      if (player == null) {
        // Invalid data
        this.setState({valid: false});
      } else {
        let battle = Guard(player, 'statistics.pvp.battles', 0);
        // Treat zero battle account as hidden not for hidden accounts
        if (!hiddenAccount && battle == 0) this.setState({hidden: true});
        else this.setState({basic: player});
      }
    });
  }

  /**
   * Get player achievement
   */
  getAchievement() {
    const { id } = this.state;
    SafeFetch.get(WoWsAPI.PlayerAchievement, this.domain, id).then(data => {
      let achievement = Guard(data, `data.${id}.battle`, null);
      if (achievement != null) {
        this.setState({achievement: achievement});
      }
    });
  }

  /**
   * Get player past rank info
   */
  getRank() {
    const { id } = this.state;
    SafeFetch.get(WoWsAPI.RankInfo, this.domain, id).then(data => {
      let rank = Guard(data, `data.${id}.seasons`, null);
      if (rank != null) {
        this.setState({rank: rank});
      }
    });
  }

  /**
   * Get all player ship info
   */
  getShip() {
    const { id } = this.state;
    SafeFetch.get(WoWsAPI.ShipInfo, this.domain, id).then(data => {
      let ship = Guard(data, `data.${id}`, null);
      if (ship != null) {
        this.setState({ship: ship});
      }
    });
  }

  render() {
    const { error, container, footer, playerName } = styles;
    const { home, friend } = this.props;
    const { name, id, valid, hidden, 
            achievement, rank, basic, ship, graph } = this.state;

    let RootView = home ? Surface : WoWsInfo;
    if (id == null || id == "") {
      // Show an error page or if it is from home, ask user to add an account first
      return (
        <RootView style={error}>
          {
            home ? <Text>Add yourself first</Text>
            : <Text>BUG</Text>
          }
        </RootView>
      );
    } else if (!valid) {
      // Not valid (API or Internet error)
      return (
        <RootView style={container}>
          <Text>{'Data is not valid\nPlease try again later'}</Text>
        </RootView>
      );
    } else if (hidden) {
      // Hidden account
      return (
        <RootView style={container}>
          <Text>{`${name} is Hidden`}</Text>
        </RootView>
      );
    } else {
      // Display player data
      return (
        <RootView noLeft={friend} title={`${id}`}>
          <Title style={playerName}>{name}</Title>
          { this.renderBasic(basic) }
          <FooterPlus style={footer}>
            { this.renderAchievement(achievement) }
            { this.renderGraph(graph) }
            { this.renderShip(ship) }
            { this.renderRank(rank) }
          </FooterPlus>
        </RootView>
      );
    }

  };

  ///
  // I will do parallel data loading so each of them will have 
  // their own state to check if the button could be rendered
  ///

  renderBasic(basic) {
    const { container } = styles;

    return (
      <View style={container}>
      { 
        !basic ? <LoadingIndicator /> :
        null
      }
      </View>
    )
  }

  renderAchievement(achievement) {
    let loading = true;
    if (achievement) loading = false;

    return <TabButton icon={require('../../img/AchievementTab.png')} color={this.theme}
      disabled={loading} label={lang.tab_achievement_title}/>
  }

  renderShip(ship) {
    let loading = true;
    if (ship) loading = false;

    return <TabButton icon={require('../../img/Ship.png')} color={this.theme}
      disabled={loading} label={lang.tab_ship_title}/>  
  }

  renderRank(rank) {
    let loading = true;
    if (rank) loading = false;

    return <TabButton icon={require('../../img/Rank.png')} color={this.theme}
      disabled={loading} label={lang.tab_rank_title}/>
  }

  renderGraph(graph) {
    return <TabButton icon={require('../../img/Graph.png')} color={this.theme}
      label={lang.tab_graph_title}/>
  }
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
  },
  playerName: {
    alignSelf: 'center',
    fontSize: 24,
    padding: 8
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export { Statistics };
