import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Linking, Animated } from 'react-native';
import { isTablet, isAndroid } from 'react-native-device-detection';
import { List, Colors, Surface, Searchbar } from 'react-native-paper';
import { FloatingButton } from '../component';
import lang from '../value/lang';

class Menu extends Component {

  constructor(props) {
    super(props);

    // Data for the list
    this.wiki = [{t: lang.wiki_achievement, i: require('../img/Achievement.png')},
    {t: lang.wiki_warships, i: require('../img/Warship.png')},
    {t: lang.wiki_upgrades, i: require('../img/Upgrade.png')},
    {t: lang.wiki_flags, i: require('../img/Camouflage.png')},
    {t: lang.wiki_skills, i: require('../img/CommanderSkill.png')},
    {t: lang.wiki_maps, i: 'map'},
    {t: lang.wiki_collections, i: require('../img/Collection.png')}];
    // TODO: change links base on player server
    this.websites = [{t: lang.website_official_site, d: 'https://worldofwarships.com/'},
    {t: lang.website_premium, d: 'https://asia.wargaming.net/shop/wows/'},
    {t: lang.website_global_wiki, d: 'http://wiki.wargaming.net/en/World_of_Warships/'},
    {t: lang.website_sea_group, d: 'https://sea-group.org/'},
    {t: lang.website_daily_bounce, d: 'https://thedailybounce.net/category/world-of-warships/'},
    {t: lang.website_numbers, d: 'https://wows-numbers.com/'},
    {t: lang.website_today, d: 'https://warships.today/'},
    {t: lang.website_ranking, d: 'http://maplesyrup.sweet.coocan.jp/wows/ranking/'},
    {t: lang.website_models, d: 'https://sketchfab.com/tags/world-of-warships'}];
    this.youtubers = [{t: lang.youtuber_official, d: 'https://www.youtube.com/user/worldofwarshipsCOM'},
    {t: lang.youtuber_flambass, d: 'https://www.youtube.com/user/Flambass'},
    {t: lang.youtuber_notser, d: 'https://www.youtube.com/user/MrNotser'},
    {t: lang.youtuber_jingles, d: 'https://www.youtube.com/user/BohemianEagle'},
    {t: lang.youtuber_panzerknacker, d: 'https://www.youtube.com/user/pzkpasch'},
    {t: lang.youtuber_flamu, d: 'https://www.youtube.com/user/cheesec4t'},
    {t: lang.youtuber_yuro, d: 'https://www.youtube.com/user/spzjess'},
    {t: lang.youtuber_iChaseGaming, d: 'https://www.youtube.com/user/ichasegaming'},
    {t: lang.youtuber_NoZoupForYou, d: 'https://www.youtube.com/user/ZoupGaming'}];

    // Hide search bar when scrolling
    this.scrollY = new Animated.Value(0);
    this.searchBarHeight = this.scrollY.interpolate({
      inputRange: [0, 24, 48],
      outputRange: [48, 24, 0],
  });
  }

  render() {
    const { container, icon } = styles;

    return (
      <Surface style={container}>
        <SafeAreaView style={{flex: 1}}>
          <Animated.View >
            <Searchbar style={{margin: 16}}/>
          </Animated.View>
          <ScrollView showsVerticalScrollIndicator={false} onScroll={Animated.event([
            // so that we could use this for animation
            {nativeEvent: {contentOffset: {y: this.scrollY }}}
          ])} contentContainerStyle={{paddingBottom: 32}}>
            <List.Section title={lang.wiki_section_title}>
              { this.wiki.map(item => { return (
                <List.Item title={item.t} style={{padding: 0, paddingLeft: 8}} onPress={() => console.log('Placeholder')} key={item.t}
                left={() => <List.Icon style={icon} color={Colors.blue300} icon={item.i}/>}
                right={() => isAndroid ? null : <List.Icon icon='keyboard-arrow-right'/>} />
              )})}
            </List.Section>
            <List.Section title={lang.extra_section_title}>
              <List.Accordion title={lang.website_title} >
                { this.websites.map(item => { return (
                  <List.Item title={item.t} description={item.d} key={item.t}
                  onPress={() => Linking.openURL(item.d)}/>
                )})}
              </List.Accordion>
              <List.Accordion title={lang.youtuber_title}>
                { this.youtubers.map(item => { return (
                  <List.Item title={item.t} description={item.d} key={item.t}
                  onPress={() => Linking.openURL(item.d)}/>
                )})}
              </List.Accordion>
            </List.Section>
          </ScrollView>
        </SafeAreaView>
        <FloatingButton mode='Home'/>
      </Surface>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: isTablet ? '20%' : null,
    paddingRight: isTablet ? '20%': null,
  },
  icon: {
    backgroundColor: Colors.blueGrey50, 
    borderRadius: 100
  }
});

export { Menu };
