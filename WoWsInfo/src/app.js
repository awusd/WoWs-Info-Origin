import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { Router, Stack, Scene } from 'react-native-router-flux';
import { isTablet } from 'react-native-device-detection';
import { Surface, DarkTheme, DefaultTheme, withTheme } from 'react-native-paper';
import { Home, Menu, Settings } from './page';
import { LOCAL } from './value/data';
import { DataLoader, Guard } from './core';
import { BLUE, GREY } from 'react-native-material-color';
import { LoadingModal } from './component';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      updating: true,
      dark: false
    };

    DataLoader.loadAll().then(data => {
      global.DATA = data;
      const appTheme = Guard(DATA, `${LOCAL.theme}`, BLUE);
      const darkMode = Guard(DATA, `${LOCAL.darkMode}`, true);

      let customised = {};
      // Decide whether dark mode is enabled
      if (darkMode) {
        customised = {
          colors: {
            ...DarkTheme.colors,
            surface: 'black',
            text: GREY[50],
            primary: appTheme[500],
            accent: appTheme[500],
          }
        };
      } else {
        customised = {
          colors: {
            ...DefaultTheme.colors,
            primary: appTheme[500],
            accent: appTheme[500],
          }
        };
      }

      console.log(customised);
      props.theme.roundness = 8;
      props.theme.dark = darkMode;
      props.theme.colors = customised.colors;

      this.setState({loading: false, dark: darkMode});
      // console.log(props);
    });
  }

  render() {
    const { container, scene } = styles;
    const { loading, updating, dark } = this.state;
    if (loading) return <LoadingModal />
    return (
      <Surface style={container}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} 
          backgroundColor={dark ? 'black' : GREY[200]}/>
        <Router sceneStyle={[scene, {backgroundColor: 'transparent'}]}>
          <Stack key='root' hideNavBar>
            <Scene key='Home' component={Home}/>
            <Scene key='Menu' component={Menu}/>
            <Scene key='Settings' component={Settings}/>
          </Stack>
        </Router>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scene: {
    flex: 1,
    paddingLeft: isTablet ? '20%' : null,
    paddingRight: isTablet ? '20%': null,
  },
});

export default withTheme(App);
