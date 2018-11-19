import React, { Component } from 'react';
import { View, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { isAndroid } from 'react-native-device-detection';
import { Text, Portal, Surface, Button, Dialog, Title, Caption } from 'react-native-paper';
import lang from '../../value/lang';

class RS extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tip: false,
      ip: '',
      // Render RS when it is true (iused to check if IP is valid)
      rs: false
    };
  }

  render() {
    const { container, input } = styles;
    const { tip, ip, rs } = this.state;
    return (
      <KeyboardAvoidingView style={container} behavior='padding' enabled>
        <TextInput style={input} value={ip} placeholder='192.168.1.x' 
          keyboardType={isAndroid ? 'decimal-pad' : 'numbers-and-punctuation'}
          onChangeText={t => this.setState({ip: t})}
          onEndEditing={() => this.validIP(ip)}/>
        <Button onPress={() => this.setState({tip: true})}>How to use?</Button>
        { this.renderDialog(tip) }
      </KeyboardAvoidingView>
    )
  };

  /**
   * Check the IP format and try to send a request to it
   * @param {string} ip 
   */
  validIP(ip) {
    let url = ip.split('/').join('') + ':8605';
    Alert.alert('RS Beta', `${url}`);
  }

  /**
   * A dialog to show some instructions
   * @param {*} tip 
   */
  renderDialog(tip) {
    return (
      <Portal>
        <Dialog visible={tip} dismissable={true} theme={{roundness: 8}}
          style={{maxHeight: '61.8%'}} onDismiss={() => this.setState({tip: false})}>
          <Dialog.Content>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Title>{lang.rs_tip_download}</Title>
              <Text>{lang.rs_tip_one}</Text>
              <Title>{lang.rs_tip_setup}</Title>
              <Text>{lang.rs_tip_two}</Text>
              <Title>{lang.rs_tip_enjoy}</Title>
              <Text>{lang.rs_tip_three}</Text>
              <Caption>{'\nHenryQuan'}</Caption>
            </ScrollView>
          </Dialog.Content>
        </Dialog>
      </Portal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    fontSize: 17,
    width: '90%',
    textAlign: 'center',
    marginBottom: 8
  }
});

export { RS };
