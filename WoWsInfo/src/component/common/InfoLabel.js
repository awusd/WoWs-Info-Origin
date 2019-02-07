/**
 * InfoLabel.js
 * 
 * 
 */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import { Touchable } from './Touchable';

class InfoLabel extends Component {
  render() {
    const { container } = styles;
    const { title, info, left, right, onPress } = this.props;
    return (
      <Touchable fill style={[container, {alignItems: left ? 'flex-start' : right ? 'flex-end' : null}]} onPress={onPress}>
        <Caption style={{textAlign: 'center', marginBottom: -2}}>{title}</Caption>
        <Text style={{textAlign: 'center', marginBottom: 2}}>{info}</Text>
      </Touchable>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export { InfoLabel };
