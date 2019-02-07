/**
 * ClanInfo.js
 * 
 * 
 */

import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Linking, StyleSheet } from 'react-native';
import { WoWsInfo, LoadingIndicator, InfoLabel, SectionTitle, Touchable } from '../../component';
import { SafeFetch, Guard, humanTimeString, SafeAction } from '../../core';
import { WoWsAPI } from '../../value/api';
import { getDomain, getPrefix, getCurrServer } from '../../value/data';
import { Title, Subheading, Paragraph, List, Caption } from 'react-native-paper';
import { TintColour } from '../../value/colour';
import lang from '../../value/lang';

class ClanInfo extends Component {
  constructor(props) {
    super(props);

    const { clan_id, tag, server } = props.info;
    this.state = {
      id: clan_id,
      tag: tag,
      info: false,
      // Clan ID must be valid
      valid: clan_id != null
    };

    this.server = server;
    this.domain = getDomain(server);
    this.prefix = getPrefix(server);

    SafeFetch.get(WoWsAPI.ClanInfo, this.domain, clan_id).then(data => {
      let clanInfo = Guard(data, `data.${clan_id}`, null);
      if (clanInfo != null) {
        this.setState({info: clanInfo});
      } else {
        this.setState({valid: false});
      }
    });
  }

  render() {
    const { clanTag, container, infoView } = styles;
    const { info, tag, id, valid } = this.state;
    if (valid) {
      return (
        <WoWsInfo title={`- ${id} -`} onPress={() => Linking.openURL(`https://${this.prefix}.wows-numbers.com/clan/${id}, ${tag}/`)}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Title style={clanTag}>{tag}</Title>
            { this.renderClanInfo(info) }
          </ScrollView>
        </WoWsInfo>
      )
    } else {
      return (
        <WoWsInfo title={`- ${id} -`} style={container}>
          <Title style={clanTag}>{`[${tag}]`}</Title>
        </WoWsInfo>
      )
    }
  };
  
  renderClanInfo(data) {
    if (data) {
      console.log(data);
      const { horizontal } = styles;
      const {
        created_at, creator_name, creator_id, leader_name, leader_id,
        description, name, members, members_count
      } = data;

      let memberInfo = [];
      for (let ID in members) {
        memberInfo.push(members[ID]);
      }
      memberInfo.sort((a, b) => a.joined_at - b.joined_at);
      console.log(memberInfo);

      return (
        <View>
          <Subheading style={{color: TintColour()[500], alignSelf: 'center'}}>{name}</Subheading>
          <InfoLabel title={lang.clan_created_date} info={humanTimeString(created_at)}/>
          <View style={[horizontal, {flex: 1, justifyContent: 'space-around'}]}>
            <InfoLabel title={lang.clan_creator_name} info={creator_name}
              onPress={() => this.pushToMaster(creator_name, creator_id)}/>
            <InfoLabel title={lang.clan_leader_name} info={leader_name}
              onPress={() => this.pushToMaster(leader_name, leader_id)}/>
          </View>
          <Paragraph style={{padding: 16}}>{description}</Paragraph>
          <SectionTitle style={{alignSelf: 'flex-start'}} title={`${lang.clan_member_title} - ${members_count}`}/>
          <FlatList data={memberInfo} renderItem={({item}) => {
            return (
              <List.Item title={item.account_name} description={humanTimeString(item.joined_at)}
                onPress={() => this.pushToPlayer(item)}
                right={() => <Caption style={{paddingRight: 8, alignSelf: 'center'}}>{item.account_id}</Caption>}/>
            )
          }} showsVerticalScrollIndicator={false} keyExtractor={d => d.account_id}/>
        </View>
      )
    } else {
      return <LoadingIndicator />
    }
  }

  pushToMaster(name, id) {
    let item = {nickname: name, account_id: id, server: this.server};
    SafeAction('Statistics', {info: item});
  }

  pushToPlayer(item) {
    item.nickname = item.account_name;
    item.server = this.server;
    SafeAction('Statistics', {info: item});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  clanTag: {
    alignSelf: 'center',
    fontSize: 36,
    fontWeight: '500',
    paddingTop: 16,
    textAlign: 'center'
  },
  horizontal: {
    flexDirection: 'row'
  },
});

export { ClanInfo };
