/**
 * Menu.js
 * 
 * Menu shows wiki and extra
 * It also has the ability to search players and clans
 */

import React, { PureComponent } from 'react';
import { Alert, ScrollView, StyleSheet, Linking, View } from 'react-native';
import { isAndroid } from 'react-native-device-detection';
import { List, Colors } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { WoWsInfo, SectionTitle, AppName, Donation } from '../../component';
import { lang } from '../../value/lang';
import { SafeAction, Downloader } from '../../core';
import { ThemeBackColour, TintColour } from '../../value/colour';
import { getCurrDomain, getCurrServer, getCurrPrefix, APP, LOCAL, getFirstLaunch, setFirstLaunch, setLastLocation } from '../../value/data';
import { Loading } from '../common/Loading';
import { FlatGrid } from 'react-native-super-grid';

class Menu extends PureComponent {

  constructor(props) {
    super(props);

    let first = getFirstLaunch();
    this.state = {
      loading: first,
      main: DATA[LOCAL.userInfo]
    };

    this.getData();

    if (first) {
      // Update data here if it is not first launch
      let dn = new Downloader(getCurrServer());
      dn.updateAll(true).then(obj => {
        // Make sure it finishes downloading
        if (obj.status) {
          this.setState({loading: false});
          setFirstLaunch(false);
        } else {
          // Reset to a special page
          // For now, just an error message
          Alert.alert(lang.error_title, lang.error_download_issue + '\n\n' + obj.log);
        }
      });
    }
  }

  componentWillUpdate() {
    this.getData();
    const { main } = this.state;
    let curr = DATA[LOCAL.userInfo];
    setLastLocation('');
    if (curr.account_id !== main.account_id) {
      this.setState({main: curr});
    }
  }

  componentDidMount() {
    if (LASTLOCATION !== '') {
      let extra = {};
      if (LASTLOCATION === 'Statistics') extra = {info: this.state.main};
      else if (LASTLOCATION === 'Upgrade') {
        LASTLOCATION = 'Consumable';
        extra = {upgrade: true};
      }
      setTimeout(() => SafeAction(LASTLOCATION, extra));
    }
  }

  getData() {
        
    // Data for the list
    this.wiki = [{t: lang.wiki_achievement, i: require('../../img/Achievement.png'), p: () => SafeAction('Achievement')},
    {t: lang.wiki_warships, i: require('../../img/Warship.png'), p: () => SafeAction('Warship')},
    {t: lang.wiki_upgrades, i: require('../../img/Upgrade.png'), p: () => SafeAction('Consumable', {upgrade: true})},
    {t: lang.wiki_flags, i: require('../../img/Camouflage.png'), p: () => SafeAction('Consumable')},
    {t: lang.wiki_skills, i: require('../../img/CommanderSkill.png'), p: () => SafeAction('CommanderSkill')},
    {t: lang.wiki_maps, i: 'map', p: () => SafeAction('Map')},
    {t: lang.wiki_collections, i: require('../../img/Collection.png'), p: () => SafeAction('Collection')}];

    const domain = getCurrDomain();
    this.prefix = getCurrPrefix();

    this.support = [{t: lang.support_patreon, d: APP.Patreon}];
    if (GITHUB_VERSION) {
      this.support = [{t: lang.support_patreon, d: APP.Patreon},
        {t: lang.support_paypal, d: APP.PayPal},
        {t: lang.support_wechat, d: APP.WeChat}];
    }

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
    const { loading, main } = this.state;
    if (loading) return <Loading />
    
    // For main account
    let enabled = main.account_id !== '';
    let title = `- ${main.nickname} -`;
    if (title === '-  -') title = '- ??? -';
    
    return (
      <WoWsInfo title={title} onPress={enabled ? () => SafeAction('Statistics', {info: main}) : null} home upper={false}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
          <Animatable.View animation='fadeInDown' easing='ease'>
            <AppName />
          </Animatable.View>
          <Animatable.View animation='fadeInUp' delay={200} easing='ease'>
            { this.renderContent() }
          </Animatable.View>
        </ScrollView>
      </WoWsInfo>
    );
  }

  renderContent() {
    const { icon } = styles;
    return (
      <View>
        <SectionTitle title={lang.wiki_section_title}/>
        <FlatGrid items={this.wiki} itemDimension={300} renderItem={({item}) => {
          return <List.Item title={item.t} style={{padding: 0, paddingLeft: 8}} onPress={() => item.p()} key={item.t}
          left={() => <List.Icon style={[icon, ThemeBackColour()]} color={TintColour()[300]} icon={item.i}/>}
          right={() => isAndroid ? null : <List.Icon color={Colors.grey500} icon='keyboard-arrow-right'/>} />
        }} spacing={0}/>
        <SectionTitle title={lang.extra_section_title}/>
        <List.Item title='RS Beta' description='Realtime Statistics Beta' onPress={() => SafeAction('RS')}/>
        <List.Section title={lang.extra_support_wowsinfo}>
        <Donation />
          { this.support.map(item => { return (
            <List.Item title={item.t} description={item.d} key={item.t}
              onPress={() => Linking.openURL(item.d)}/>
          )})}
        </List.Section>
        <List.Section title={lang.website_title} >
          <FlatGrid items={this.websites} itemDimension={300} renderItem={({item}) => {
            return <List.Item title={item.t} description={item.d} key={item.t}
            onPress={() => Linking.openURL(item.d)}/>
          }} spacing={0}/>
        </List.Section>
        <List.Section title={lang.youtuber_title}>
          <FlatGrid items={this.youtubers} itemDimension={300} renderItem={({item}) => {
            return <List.Item title={item.t} description={item.d} key={item.t}
            onPress={() => Linking.openURL(item.d)}/>
          }} spacing={0}/>
        </List.Section>
        {/* <List.Section title={lang.tool_title}>
        </List.Section> */}
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
