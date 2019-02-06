import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Text, Colors, IconButton } from 'react-native-paper';
import { LOCAL } from '../../value/data';
import { SafeAction } from '../../core';

class Friend extends PureComponent {
  render() {
    const { container } = styles;
    return (
      <View style={container}>
        <FlatList data={DATA[LOCAL.friendList]} renderItem={({item}) => 
          <List.Item key={item.nickname} title={item.nickname} onPress={() => this.navigate(item)}
            right={() => <IconButton color={Colors.grey500} icon='close' onPress={() => null}/> }/>}
          keyExtractor={i => i.account_id} showsVerticalScrollIndicator={false}/>
      </View>
    )
  };

  /**
   * Navigate to player page with necessary information
   * @param {any} info 
   */
  navigate(info) {
    SafeAction('Statistics', {info: info, friend: true})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 32
  }
});

export { Friend };
