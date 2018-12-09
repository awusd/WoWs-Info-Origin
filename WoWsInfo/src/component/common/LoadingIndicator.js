/**
 * LoadingIndicator.js
 * 
 * 
 */

import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { isIos } from 'react-native-device-detection';
import { LOCAL } from '../../value/data';
import { BLUE, Grey } from 'react-native-material-color';

class LoadingIndicator extends Component {
  render() {
    //<ActivityIndicator color='white' size='large'/>
    const { style } = this.props;
    let appTheme = DATA[LOCAL.theme];
    if (!appTheme) appTheme = BLUE;

    return <ActivityIndicator size={isIos ? 'small' : 'large'} 
      color={Grey} style={style} />;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export { LoadingIndicator };
