/**
 * Menu.js
 * 
 * Menu shows wiki and extra
 * It also has the ability to search players and clans
 */

import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, Linking, View } from 'react-native';
import { isAndroid, isIphoneX } from 'react-native-device-detection';
import { List, Colors, Text, Searchbar, Title } from 'react-native-paper';
import { FooterButton, WoWsInfo, SectionTitle, PlayerCell, AppName } from '../../component';
import { lang } from '../../value/lang';
import { Actions } from 'react-native-router-flux';
import { SafeAction, SafeFetch, Guard } from '../../core';
import { ThemeBackColour, TintColour } from '../../value/colour';
import { getCurrDomain, getCurrServer, getCurrPrefix, APP, LOCAL } from '../../value/data';
import { WoWsAPI } from '../../value/api';
import { Friend } from '../home/Friend';

class Menu extends Component {

  constructor(props) {
    super(props);

    // Data for the list
    this.wiki = [{t: lang.wiki_achievement, i: require('../../img/Achievement.png'), p: () => SafeAction('Achievement')},
    {t: lang.wiki_warships, i: require('../../img/Warship.png'), p: () => SafeAction('Warship')},
    {t: lang.wiki_upgrades, i: require('../../img/Upgrade.png'), p: () => SafeAction('Consumable', {upgrade: true})},
    {t: lang.wiki_flags, i: require('../../img/Camouflage.png'), p: () => SafeAction('Consumable')},
    {t: lang.wiki_skills, i: require('../../img/CommanderSkill.png'), p: () => SafeAction('CommanderSkill')},
    {t: lang.wiki_maps, i: 'map', p: () => SafeAction('Map')},
    {t: lang.wiki_collections, i: require('../../img/Collection.png'), p: () => SafeAction('Collection')}];

    const domain = getCurrDomain();
    // TODO: change links base on player server
    this.websites = [{t: lang.website_official_site, d: `https://worldofwarships.${domain}/`},
    {t: lang.website_premium, d: `https://${this.prefix}.wargaming.net/shop/wows/`},
    {t: lang.website_global_wiki, d: `http://wiki.wargaming.net/en/World_of_Warships/`},
    {t: lang.website_dev_blog, d: `https://www.facebook.com/wowsdevblog/`},
    {t: lang.website_sea_group, d: `https://sea-group.org/`},
    {t: lang.website_daily_bounce, d: `https://thedailybounce.net/category/world-of-warships/`},
    {t: lang.website_numbers, d: `https://${this.prefix}.wows-numbers.com/`},
    {t: lang.website_today, d: `https://${this.prefix}.warships.today/`},
    {t: lang.website_ranking, d: `http://maplesyrup.sweet.coocan.jp/wows/ranking/`},
    {t: lang.website_models, d: `https://sketchfab.com/tags/world-of-warships`}];
    
    this.youtubers = [{t: lang.youtuber_official, d: 'https://www.youtube.com/user/worldofwarshipsCOM'},
    {t: lang.youtuber_flambass, d: 'https://www.youtube.com/user/Flambass'},
    {t: lang.youtuber_notser, d: 'https://www.youtube.com/user/MrNotser'},
    {t: lang.youtuber_jingles, d: 'https://www.youtube.com/user/BohemianEagle'},
    {t: lang.youtuber_panzerknacker, d: 'https://www.youtube.com/user/pzkpasch'},
    {t: lang.youtuber_flamu, d: 'https://www.youtube.com/user/cheesec4t'},
    {t: lang.youtuber_yuro, d: 'https://www.youtube.com/user/spzjess'},
    {t: lang.youtuber_iChaseGaming, d: 'https://www.youtube.com/user/ichasegaming'},
    {t: lang.youtuber_NoZoupForYou, d: 'https://www.youtube.com/user/ZoupGaming'}];
  }

  render() {
    // For main account
    let main = DATA[LOCAL.userInfo];
    let enabled = main.account_id !== '';
    let title = `- ${main.nickname} -`;
    if (title === '') title = '- ??? -';

    return (
      <WoWsInfo title={title} onPress={enabled ? () => SafeAction('Statistics', {info: main}) : null} home upper={false}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
          <AppName />
          { this.renderContent() }
        </ScrollView>
      </WoWsInfo>
    );
  }

  renderContent() {
    const { icon } = styles;
    return (
      <View>
        <SectionTitle title={lang.wiki_section_title}/>
        { this.wiki.map(item => { return (
          <List.Item title={item.t} style={{padding: 0, paddingLeft: 8}} onPress={() => item.p()} key={item.t}
          left={() => <List.Icon style={[icon, ThemeBackColour()]} color={TintColour()[300]} icon={item.i}/>}
          right={() => isAndroid ? null : <List.Icon color={Colors.grey500} icon='keyboard-arrow-right'/>} />
        )})}
        <SectionTitle title={lang.extra_section_title}/>
          <List.Item title={lang.extra_support_wowsinfo} description={APP.Patreon}
            onPress={() => Linking.openURL(APP.Patreon)}/>
          <List.Section title={lang.website_title} >
            { this.websites.map(item => { return (
              <List.Item title={item.t} description={item.d} key={item.t}
                onPress={() => Linking.openURL(item.d)}/>
            )})}
        </List.Section>
        <List.Section title={lang.youtuber_title}>
          { this.youtubers.map(item => { return (
            <List.Item title={item.t} description={item.d} key={item.t}
              onPress={() => Linking.openURL(item.d)}/>
          )})}
        </List.Section>
        <List.Section title={lang.tool_title}>
        </List.Section>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    borderRadius: 100
  }
});

export { Menu };
