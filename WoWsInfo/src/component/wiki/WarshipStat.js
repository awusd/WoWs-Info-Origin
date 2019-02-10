/**
 * WarshipStat.js
 * 
 * 
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar, Caption } from 'react-native-paper';
import { lang } from '../../value/lang';

class WarshipStat extends Component {
  render() {
    const { container } = styles;
    const { mobility, weaponry, concealment, armour } = this.props.profile;
    const { anti_aircraft, aircraft, artillery, torpedoes } = weaponry;

    return (
      <View style={container}>
        { this.renderProgress(armour.total, lang.warship_survivability) }
        { this.renderProgress(artillery, lang.warship_artillery) }
        { this.renderProgress(torpedoes, lang.warship_torpedoes) }
        { this.renderProgress(anti_aircraft, lang.warship_antiaircraft) }
        { this.renderProgress(mobility.total, lang.warship_maneuverabilty) }
        { this.renderProgress(aircraft, lang.warship_aircraft) }
        { this.renderProgress(concealment.total, lang.warship_concealment) }
      </View>
    )
  };

  renderProgress(value, title) {
    if (value && value > 0) {
      const { header } = styles;
      return (
        <View>
          <View style={header}>
            <Caption>{title}</Caption>
            <Caption>{value}</Caption>
          </View>
          <ProgressBar progress={value/100}/>
        </View>
      )
    } return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flex: 1,
    padding: 0,
    paddingLeft: 16, paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -8
  }
});

export { WarshipStat };
