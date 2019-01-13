/**
 * WarshipDetail.js
 * 
 * Display detailed info of a ship and also show similar ships
 */

import React, { PureComponent } from 'react';
import { View, FlatList,Linking, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Title, Subheading, Headline, Button, Surface, Paragraph, List, Divider } from 'react-native-paper';
import { WoWsInfo, WikiIcon, WarshipCell, LoadingModal, PriceLabel, LoadingIndicator, WarshipStat, InfoLabel, DividerPlus } from '../../component';
import { SAVED, SERVER, LOCAL } from '../../value/data';
import lang from '../../value/lang';
import { SafeFetch, langStr, Guard, getColourWithRange, SafeAction } from '../../core';
import { WoWsAPI } from '../../value/api';
import { Actions } from 'react-native-router-flux';
import { GREY } from 'react-native-material-color';
import { ThemeBackColour } from '../../value/colour';

class WarshipDetail extends PureComponent {
  constructor(props) {
    super(props);

    this.server = SERVER[DATA[LOCAL.userServer]];

    let curr = props.item;
    console.log(curr);

    // Get all other same tier and same type ships
    let warship = DATA[SAVED.warship];
    let similar = Object.entries(warship).filter(s => {
      if (s[1].tier === curr.tier && s[1].type === curr.type) return true;
    });

    // Remove extra information (ship id)
    similar.forEach((s, i) => similar[i] = Object.assign(s[1]));
    console.log(similar);

    this.state = {
      curr: props.item,
      similar: similar,
      loading: true,
      data: {}
    };

    this.delayedRequest = null;
  }

  componentWillMount() {
    // Start loading data here
    this.efficientDataRequest(this.props.item.ship_id);
  }

  render() {
    const { curr, similar } = this.state;
    if (curr) {
      return (
        <WoWsInfo title={`${curr.ship_id_str} ${curr.ship_id}`}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <WikiIcon warship item={curr} scale={3}/>
            { this.renderContent() }
          </ScrollView> 
          <Divider />
          { this.renderSimilar(similar) }
        </WoWsInfo>
      )
    } else {
      // Bug here
    }
  };

  renderContent() {
    const { curr, loading, data } = this.state;
    if (loading) {
      return <LoadingIndicator />
    } else {
      return (
       <View>
        { this.renderBasic(curr, data) }
        { this.renderAll(data) }
       </View>
      )
    }
  }

  renderBasic(curr, data) {
    const { container, shipTitle, centerText, modelBtn } = styles;
    const { name, model, type, nation } = curr;
    const { description } = data;

    return (
      <View style={container}>
        <Title style={shipTitle}>{name}</Title>
        <Text>{nation.toUpperCase()}</Text>
        <Text>{type}</Text>
        <PriceLabel item={data}/>
        { model ? <Button style={modelBtn} onPress={() => Linking.openURL(`https://sketchfab.com/models/${model}/embed?autostart=1&preload=1`)}>
          {lang.warship_model}
        </Button> : null }
        <Paragraph style={[centerText, {margin: 8}]}>{description}</Paragraph>
      </View>
    )
  }

  renderAll(curr) {
    return (
      <View>
        { this.renderStatus(Guard(curr, 'default_profile', null)) }
        <Divider />
        { this.renderSurvivability(curr) }
        <Divider />
        { this.renderMainBattery(Guard(curr, 'default_profile.artillery', null)) }
        <Divider />
        { this.renderSecondary(Guard(curr, 'default_profile.atbas', null)) }
        <Divider />
        { this.renderTorpedo(Guard(curr, 'default_profile.torpedoes', null)) }
        <Divider />
        { this.renderAADefense(Guard(curr, 'default_profile.anti_aircraft', null)) }
        <Divider />
        { this.renderMobility(Guard(curr, 'default_profile.mobility', null)) }
        <Divider />
        { this.renderConcealment(Guard(curr, 'default_profile.concealment', null)) }
        <Divider />
        { this.renderUpgrade(curr) }
        <Divider />
        { this.renderNextShip(Guard(curr, 'next_ships'), null) }
      </View>
    )
  }

  /**
   * Render ship overall status
   * @param {*} profile 
   */
  renderStatus(profile) {
    if (!profile) return null;
    return <WarshipStat profile={profile} />;
  }

  /**
   * Render information about health, armour
   */
  renderSurvivability(curr) {
    if (!curr) return null;
    let armour = Guard(curr, 'default_profile.armour', null);
    let tier = Guard(curr, 'tier', null);

    const { flood_prob, range, health } = armour;
    const { horizontal, centerText } = styles;
    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{lang.warship_survivability}</Headline>
        <View style={horizontal}>
          <InfoLabel title={lang.warship_survivability_health} info={`${health} - ${health + tier * 350}`}/>
          <InfoLabel title={lang.warship_survivability_armour} info={`${range.min} - ${range.max} mm`}/>
          { flood_prob == 0 ? null : <InfoLabel title={lang.warship_survivability_protection} info={`${flood_prob}%`}/> }
        </View>
      </View>
    );
  }

  /**
   * Render main battery and secondary information
   */
  renderMainBattery(artillery) {
    if (!artillery) return null;
    const { horizontal, centerText } = styles;
    const { max_dispersion, gun_rate, distance, rotation_time, slots, shells } = artillery;
    const { AP, HE } = shells;

    // Get all guns
    var mainGun = '', gunName = '';
    for (gun in slots) mainGun += slots[gun].guns + ' x ' + slots[gun].barrels + '  '; gunName = slots[gun].name;
    
    // Get gun penetration
    let calibar = parseInt(gunName.split(' ')[0]);
    if (HE) {
      var fireRate = calibar > 160 ? 4 : 3;
      var oneFourth = Number(calibar / 4).toFixed(1);
      var oneSixth = Number(calibar / 6).toFixed(1);
      // Mark the penetration 1/6 and 1/4
      var penetration = `1/6 | ${oneSixth} - ${Number(oneSixth * 1.3).toFixed(1)} mm\n` +
        `1/4 | ${oneFourth} - ${Number(oneFourth * 1.3).toFixed(1)} mm`;
      fireRate += HE.burn_probability;
    }

    if (AP) {
      // Overmatch 14.3x
      var overmatch = `${Number(calibar / 14.3).toFixed(2)} mm\n`;
    }

    // Get best reload
    let reload = Number(60 / gun_rate).toFixed(1);
    let re1 = calibar <= 139 ? 0.9 : 1;
    let re2 = this.upgrades.findIndex(u => u === 4280471472) > -1 ? 0.88 : 1;
    let bestReload = Number((60 / gun_rate) * re1 * re2).toFixed(1);
    let reloadMsg = `${reload} - ${bestReload} s`;
    if (reload === bestReload) reloadMsg = `${reload} s`;

    // Get best range
    let range = Number(distance).toFixed(1);
    let ra1 = calibar <= 139 ? 1.2 : 1;
    let ra2 = this.upgrades.findIndex(u => u === 4278374320) > -1 ? 1.16 : 1;
    let bestRange = Number(distance * ra1 * ra2).toFixed(1);
    let rangeMsg = `${range} - ${bestRange} km`;
    if (range === bestRange) rangeMsg = `${range} km`;

    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{lang.warship_artillery_main}</Headline>
        <View style={horizontal}>
          <InfoLabel title={lang.warship_weapon_reload} info={reloadMsg}/>
          <InfoLabel title={lang.warship_weapon_range} info={rangeMsg}/>
          <InfoLabel title={lang.warship_weapon_configuration} info={mainGun}/>
        </View>
        <View style={horizontal}>
          <InfoLabel title={lang.warship_weapon_dispersion} info={`${max_dispersion} m`}/>
          <InfoLabel title={lang.warship_weapon_rotation} info={`${rotation_time} s`}/>
        </View>
        <Title style={centerText}>{gunName}</Title>            
        <View style={horizontal}>
          { HE == null ? null : <View>
            <Title style={centerText}>HE</Title>
            <InfoLabel title={lang.warship_weapon_fire_chance} info={`🔥${HE.burn_probability} - ${fireRate}%`}/>
            <InfoLabel title={lang.warship_artillery_main_weight} info={`${HE.bullet_mass} kg`}/>
            <InfoLabel title={lang.warship_weapon_damage} info={`${HE.damage}`}/>
            <InfoLabel title={lang.warship_weapon_speed} info={`${HE.bullet_speed} m/s`}/>
            <InfoLabel title={lang.warship_weapon_he_penetration} info={penetration}/>
          </View> }
          { AP == null ? null : <View>
            <Title style={centerText}>AP</Title>          
            <InfoLabel title={lang.warship_weapon_fire_chance} info='0%🔥'/>
            <InfoLabel title={lang.warship_artillery_main_weight} info={`${AP.bullet_mass} kg`}/>
            <InfoLabel title={lang.warship_weapon_damage} info={`${AP.damage}`}/>
            <InfoLabel title={lang.warship_weapon_speed} info={`${AP.bullet_speed} m/s`}/>
            <InfoLabel title={lang.warship_weapon_ap_overmatch} info={`${overmatch}`}/>
          </View> }
        </View>
      </View>
    );
  }

  /**
   * Render secondary information
   */
  renderSecondary(secondary) {
    if (!secondary) return null;
    const { horizontal, centerText } = styles;
    const { distance, slots } = secondary;

    var guns = []; for (gun in slots) guns.push(slots[gun]);
    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{`${lang.warship_artillery_secondary} (${distance} km)`}</Headline>
        { guns.map((value, index) => { 
          const { burn_probability, bullet_speed, name, gun_rate, damage, type } = value;            
          return (
            <View key={index}>
              <Title style={centerText}>{`${type} - ${name}`}</Title>
              <View style={horizontal}>
                <InfoLabel title={lang.warship_weapon_reload} info={Number(60 / gun_rate).toFixed(1) + ' s'}/>
                <InfoLabel title={lang.warship_weapon_speed} info={`${bullet_speed} m/s`}/>
                { burn_probability == null ? null : 
                  <InfoLabel title={lang.warship_weapon_fire_chance} info={`🔥${burn_probability}%`} /> }
                <InfoLabel title={lang.warship_weapon_damage} info={damage}/>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  /**
   * Render aircraft information
   */
  renderAircraft() {
    const { basicTextStyle } = styles;
    const { flight_control } = this.state.profile;
    if (flight_control != null) {
      const { fighter_squadrons, torpedo_squadrons, bomber_squadrons } = flight_control;
      return (
        <View style={{margin: 8}}>
          { this.renderTitle(language.detail_aircraft) }
          { this.renderFighter() }
          { this.renderTorpedoBomber() }
          { this.renderBomber() }
          <Text style={basicTextStyle}>{fighter_squadrons + ' - ' + torpedo_squadrons + ' - ' + bomber_squadrons}</Text>
        </View>
      )
    } else return null;
  }

  renderFighter() {
    const { horizontalViewStyle, basicTextStyle, basicTitleStyle, basicViewStyle } = styles;
    const { fighters } = this.state.profile;
    if (fighters != null) {
      const {} = fighters;
      return (
        <View style={{margin: 8}}>
          <Text style={basicTitleStyle}>{language.aircraft_fighter}</Text>
        </View>
      )
    } else return null;
  }

  renderTorpedoBomber() {
    const { horizontalViewStyle, basicTextStyle, basicTitleStyle, basicViewStyle } = styles;
    const { torpedo_bomber } = this.state.profile;
    if (torpedo_bomber != null) {
      return (
        <View style={{margin: 8}}>
          <Text style={basicTitleStyle}>{language.aircraft_torpedo_bomber}</Text>
        </View>
      )
    } else return null;
  }
  
  renderBomber() {
    const { horizontalViewStyle, basicTextStyle, basicTitleStyle, basicViewStyle } = styles;
    const { dive_bomber } = this.state.profile;
    if (dive_bomber != null) {
      return (
        <View style={{margin: 8}}>
          <Text style={basicTitleStyle}>{language.aircraft_bomber}</Text>
        </View>
      )
    } else return null;
  }

  /**
   * Render torpedo information
   */
  renderTorpedo(torpedoes) {
    if (!torpedoes) return null;
    const { horizontal, centerText } = styles;
    const { visibility_dist, distance, torpedo_name, reload_time, torpedo_speed, slots, max_damage } = torpedoes;

    let dist = Number(distance).toFixed(1);
    let torps = ''; for (torp in slots) torps += slots[torp].guns + ' x ' + slots[torp].barrels + '  ';
    let reactionTime = Number(visibility_dist * 1000 / 2.6 / torpedo_speed).toFixed(1);

    // With Torpedo acceleration
    let shortDist = Number(distance * 0.8).toFixed(1);
    let fastestSpeed = torpedo_speed + 5;
    let reactionTimeP = Number(visibility_dist * 1000 / 2.6 / fastestSpeed).toFixed(1);

    // check for torpedo upgrade
    let modifier = this.upgrades.findIndex(u => u === 4279422896) > -1 ? 0.85 : 1;
    let minReload = Number(reload_time * 0.9 * modifier).toFixed(1);

    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{lang.warship_torpedoes}</Headline>
        <View style={horizontal}>
          <InfoLabel title={lang.warship_weapon_reload} info={`${reload_time} - ${minReload} s`}/>
          <InfoLabel title={lang.warship_weapon_range} info={`${dist} - ${shortDist} km`}/>
          <InfoLabel title={lang.warship_weapon_configuration} info={torps}/>
        </View>
        <Title style={centerText}>{`${torpedo_name} (${reactionTime} - ${reactionTimeP}s)`}</Title>
        <View style={horizontal}>
          <InfoLabel title={lang.warship_torpedoes_visible_distance} info={`${visibility_dist} km`}/>
          <InfoLabel title={lang.warship_weapon_damage} info={max_damage}/>
          <InfoLabel title={lang.warship_weapon_speed} info={`${torpedo_speed} - ${fastestSpeed} kt`}/>
        </View>
      </View>
    );
  }

  /**
   * Render aa defense information
   */
  renderAADefense(anti_aircraft) {
    if (!anti_aircraft) return null;
    const { horizontal, centerText } = styles;
    const { slots } = anti_aircraft;

    var AAValues = []; for (aa in slots) AAValues.push(slots[aa]);
    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{lang.warship_antiaircraft}</Headline>
        { AAValues.map((value, index) => {
          const { distance, avg_damage, name, guns } = value;
          return (
            <View key={index}>
              <Title style={centerText}>{name}</Title>
              <View style={horizontal}>
                <InfoLabel title={lang.warship_weapon_configuration} info={`${guns}x`} />
                <InfoLabel title={lang.warship_weapon_range} info={`${distance} km`} />
                <InfoLabel title={lang.warship_weapon_damage} info={`${avg_damage} dps`} />
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  /**
   * Render mobility information
   */
  renderMobility(mobility) {
    if (!mobility) return null;

    const { horizontal, centerText } = styles;
    const { rudder_time, turning_radius, max_speed } = mobility;

    let speedFlag = Number(max_speed * 1.05).toFixed(0);

    // Best stat with upgrades
    let m1 = this.upgrades.findIndex(u => u === 4267888560) > -1 ? 0.8 : 1;
    let m2 = this.upgrades.findIndex(u => u === 4257402800) > -1 ? 0.6 : 1;
    let modifier = m1 + m2 - 1;
    let maxRudder = Number(rudder_time * modifier).toFixed(1);
    var rudderMsg = `${rudder_time} - ${maxRudder} s`;
    if (maxRudder === rudder_time) {
      rudderMsg = `${rudder_time} s`;
    }

    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{lang.warship_maneuverabilty}</Headline>
        <View style={horizontal}>
          <InfoLabel title={lang.warship_maneuverabilty_rudder_time} info={rudderMsg}/>
          <InfoLabel title={lang.warship_maneuverabilty_speed} info={`${max_speed} - ${speedFlag} kt`}/>
          <InfoLabel title={lang.warship_maneuverabilty_turning} info={`${turning_radius} m`}/>
        </View>
      </View>
    );
  }

  /**
   * Render concealment information
   */
  renderConcealment(concealment) {
    if (!concealment) return null;

    const { horizontal, centerText } = styles;
    const { detect_distance_by_plane, detect_distance_by_ship } = concealment;

    // Check if ship has concealment module
    let modifier = this.upgrades.findIndex(u => u === 4265791408) > -1 ? 0.9 : 1;
    // Premium ship already included it
    let camouflage = 0.97;
    let deduction = 0.9 * modifier * camouflage;
    let max_ship_concealment = Number(detect_distance_by_ship * deduction).toFixed(1);
    let max_plane_concealment = Number(detect_distance_by_plane * deduction).toFixed(1);

    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{lang.warship_concealment}</Headline>
        <View style={horizontal}>
          <InfoLabel title={lang.warship_concealment_detect_by_plane} info={`${detect_distance_by_plane} - ${max_plane_concealment} km`}/>
          <InfoLabel title={lang.warship_concealment_detect_by_ship} info={`${detect_distance_by_ship} - ${max_ship_concealment} km`}/>
        </View>
      </View>
    );
  }

  /**
   * Render upgrade list
   */
  renderUpgrade(curr) {
    if (!curr) return null;
    let upgrades = Guard(curr, 'upgrades', null);
    let slots = Guard(curr, 'mod_slots', null);
    if (!upgrades || !slots) return null;
    
    // follow the order from global wiki
    upgrades.sort((a, b) => b - a);
    for (let index in upgrades) {
      let id = upgrades[index];
      upgrades[index] = Object.assign(DATA[SAVED.consumable][id]);
    }
    console.log(upgrades);

    // For looping only
    let count = [];
    for (let i = 0; i < slots; i++) {
      count.push(i);
    }

    const { centerText, upgradeView } = styles;
    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{lang.warship_upgrades}</Headline>
        <ScrollView>
          { count.map(num => {
            let all = upgrades.filter(u => u.slot == num + 1);
            return (
              <View style={upgradeView} key={num}>
                <Title style={{margin: 8}}>{`${num + 1}.`}</Title>
                { all.map(item => <WikiIcon key={item.name} item={item} scale={0.8}
                  onPress={() => Alert.alert(item.name, item.description, [{text: String(item.price_credit)}])}/>) }
              </View>
            )})}
        </ScrollView>
      </View>
    )
  }

  /**
   * Render next ship
   */
  renderNextShip(next_ships) {
    if (!next_ships || Object.keys(next_ships).length == 0) return null;
    // Get all ships from next_ships
    var ships = []; for (key in next_ships) ships.push({key: key, exp: next_ships[key]});
    shipKey = (index) => String(index);
    
    const { centerText } = styles;
    return (
      <View style={{margin: 8}}>
        <Headline style={centerText}>{lang.warship_next_ship}</Headline>
        <FlatList data={ships} horizontal keyExtractor={shipKey} renderItem={({item}) => {  
          let curr = DATA[SAVED.warship][item.key];
          return <WarshipCell scale={1.4} item={curr} onPress={() => {
            // Pop and go to another ships
            Actions.pop();
            SafeAction('WarshipDetail', {item: curr}, 1);
          }}/>
        }}/>
      </View>
    )
  }

  /**
   * Do not render when there are no similar ships...
   * @param {*} similar 
   */
  renderSimilar(similar) {
    if (Object.keys(similar).length > 0) {
      return (
        <View style={[{height: 90}, ThemeBackColour()]}>
          <FlatList keyExtractor={item => item.name} horizontal data={similar} renderItem={({item}) => {
            return <WarshipCell item={item} scale={1.4} onPress={() => {
              this.setState({curr: item, loading: true}, 
                () => this.efficientDataRequest(item.ship_id));
            }}/>
          }} showsHorizontalScrollIndicator={false}/>
        </View>
      )
    } else return null;
  }

  efficientDataRequest(id) {
    clearTimeout(this.delayedRequest);
    // This will not work if you device time is faster than actual time
    this.delayedRequest = setTimeout(() => {
      SafeFetch.get(WoWsAPI.ShipWiki, this.server, id, langStr()).then(json => {
        let data = Guard(json, 'data', {});
        console.log(data);
        this.upgrades = Guard(data[id], 'upgrades', []);
        this.setState({data: data[id], loading: false});
      });
    }, 1000);
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  shipTitle: {
    fontSize: 24,
    paddingBottom: 16
  },
  modelBtn: {
    marginTop: 8
  },
  centerText: {
    textAlign: 'center',
  },
  weaponTitle: {
    textAlign: 'center',
    margin: -16
  },
  upgradeView: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around'
  }
});

export { WarshipDetail };
