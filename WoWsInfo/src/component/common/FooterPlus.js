/**
 * FooterPlus.js
 * 
 * This is a view that connect with WoWs Info footer
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import { ThemeBackColour } from '../../value/colour';

class FooterPlus extends Component {
  render() {
    const { children, style } = this.props;
    return (
      <View style={[ThemeBackColour(), style]}>
        {children}
      </View>
    )
  };
}

export { FooterPlus };
