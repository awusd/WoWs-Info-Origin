import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isIos } from 'react-native-device-detection';
import { Button } from 'react-native-paper';

class MenuButton extends Component {
  render() {
    const { container, button } = styles;
    return (
      <View style={container}>
        <Button style={button} icon='menu' mode='contained' onPress={() => console.log('Pressed')}>
          Menu
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 8, right: isIos ? -8 : 0,
  },
  button: {
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100
  }
})

export { MenuButton };