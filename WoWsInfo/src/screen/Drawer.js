import React, { Component } from 'react'
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { GREY } from 'react-native-material-color';
import language from '../constant/language';
import { DrawerCell, TextCell } from '../component';
import { Divider } from 'react-native-elements';
import { VERSION } from '../constant/value';
import { navStyle } from '../constant/colour';
import Wiki from './Wiki/Wiki';
import { iconsMap } from '../constant/icon';

export default class Drawer extends Component {
  state = { selected: '' }

  render() {
    const { viewStyle, textStyle, titleStyle, versionStyle } = styles;    
    return (
      <ScrollView style={viewStyle} showsVerticalScrollIndicator={false}>
        <DrawerCell icon={iconsMap['home']} title='Home' onPress={() => this.pushToHome()}/>
        <Divider />
        <Wiki navigator={this.props.navigator} drawer={this.closeDrawer}/>       
        <Divider />        
        <DrawerCell icon={iconsMap['ios-settings']} title={language.drawer_settings} onPress={() => this.pushToScreen('info.settings', language.settings_tab_title)}/>
        <DrawerCell icon={iconsMap['md-information-circle']} title={language.drawer_about} onPress={() => this.pushToScreen('info.about', language.drawer_about)}/>
      </ScrollView>
    )
  }

  /**
   * Pop everything
   */
  pushToHome() {
    this.closeDrawer();
    this.props.navigator.popToRoot({animated: true});
  }

  /**
   * Push to a certain screen
   * @param {*} screen 
   * @param {*} name 
   */
  pushToScreen(screen, name) {
    console.log(screen, name);
    // Close drawer and push to screen
    this.closeDrawer();
    this.props.navigator.push({
      screen: screen,
      title: name,
      navigatorStyle: navStyle()
    })
  }

  /**
   * Close drawer for android
   */
  closeDrawer = () => {
    // Hide drawer
    this.props.navigator.toggleDrawer({
      side: 'left',
      animation: false,
      to: 'closed'
    });
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1, backgroundColor: 'white', width: '90%'
  },
  textStyle: {
    paddingTop: 8, color: GREY[800],
    fontSize: 36, fontWeight: 'bold'
  },
  titleStyle: {
    fontWeight: 'bold', padding: 8,
    color: GREY[800]
  },
  versionStyle: {
    fontSize: 10, fontWeight: 'bold',
    marginTop: 8, padding: 8
  }
})
