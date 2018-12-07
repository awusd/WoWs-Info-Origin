/*
 * WoWsInfo.js
 *
 * This is used as a footer if no name is passed, it is a about button
 */

import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import { isAndroid } from 'react-native-device-detection';
import lang from '../../value/lang';
import { Actions } from 'react-native-router-flux';
import { FooterButton } from './FooterButton';
import { SafeAction } from '../../core';

class WoWsInfo extends Component {
  constructor(props) {
    super(props);

    const name = [lang.wowsinfo, lang.wowsinfo_black, lang.wowsinfo_go, lang.wowsinfo_new, 
                 lang.wowsinfo_pro, lang.wowsinfo_ultimate, lang.wowsinfo_ultra, lang.wowsinfo_white, 
                 lang.wowsinfo_x, lang.wowsinfo_y, lang.wowsinfo_z, '>_<', '#', 
                 '0_0', '^_^', '★', 'α', 'θ', 'Ω', 'Ф', '∞', '░', '( ͡° ͜ʖ ͡°)', '¯\_(ツ)_/¯',
                 '2018', '?', '!', '2017', '2016'];
    // Get a name from used names
    this.lucky = name[Math.floor(Math.random() * name.length)];
  }

  render() {
    const { container, text, footer } = styles;
    const { children, style } = this.props;
    return (
      <Surface style={[container, style]}>
        <SafeAreaView style={container}>
          <Surface style={container}>
            { children }
          </Surface>
          { this.renderFooter() }
        </SafeAreaView>
      </Surface>
    )
  };

  renderFooter() {
    const { title, noBack, home } = this.props;
    if (home) {
      return (
null
      )
    } else {
      return (
        <Surface style={footer}>
          { noBack ? null : <FooterButton /> }
          <Button onPress={this.pressEvent} style={text}>
            { title ? title : `WoWs Info ${this.lucky}`}
          </Button>
        </Surface>
      )
    }
  }

  /**
   * Handle press event, dont always go to about page
   */
  pressEvent = () => {
    const { onPress, about } = this.props;
    if (onPress) return onPress();
    else if (about) return this.navigate();
    else return null;
  }

  /**
   * Navigate to About page
   */
  navigate() {
    SafeAction('About');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 17, fontWeight: isAndroid ? 'bold' : '300',
    textAlign: 'center', alignSelf: 'center',
    width: '70%',
  },
  footer: {
    height: 48, 
    justifyContent: 'center',
    borderWidth: 1
  }
});

export { WoWsInfo };
