import React, { Component } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { IconButton, Text, Colors, Divider, Surface, Card, Title, Paragraph } from 'react-native-paper';
import { FloatingButton, LoadingModal } from './component';

export default class App extends Component {
  render() {
    const { container, playerLabel, header, card } = styles;
    return (
      <Surface style={container}>
        <StatusBar barStyle='dark-content' backgroundColor={Colors.grey200}/>
        <SafeAreaView style={{height: '100%'}}>
          <Surface style={header}>
            <Text numberOfLines={1} style={playerLabel}>HenryQuan</Text>
            <IconButton icon='settings' size={24} color={Colors.grey500}
              onPress={() => console.log('Pressed')}/>
          </Surface>
          <Divider/>
          <ScrollView contentContainerStyle={{padding: 8}}>
            <Card style={card}>
              <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
              </Card.Content>
            </Card>
            <Card style={card}>
              <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
              </Card.Content>
            </Card>
            <Card style={card}>
              <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
              </Card.Content>
            </Card>
            <Card style={card}>
              <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
              </Card.Content>
            </Card>
            <Card style={card}>
              <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
              </Card.Content>
            </Card>
            <Card style={card}>
              <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
              </Card.Content>
            </Card>
            <Card style={card}>
              <Card.Content>
                <Title>Card title</Title>
              </Card.Content>
            </Card>
          </ScrollView>
          <FloatingButton mode='Menu'/>
          <LoadingModal />
        </SafeAreaView>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8
  },
  playerLabel: {
    fontSize: 32,
    padding: 8,
    width: '80%',
    fontWeight: 'bold'
  },
  card: {
    borderRadius: 8,
    margin: 8,
    elevation: 2
  }
});
