//Imports
import React from 'react';
import { 
  StackNavigator,
} from 'react-navigation';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
} from 'react-native';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

//Import components
import HomeScreen from './js/Home';
import Settings from './js/Settings';
import OneCrypto from './js/OneCrypto';
import Top100 from './js/Top100';
import AddCard from './js/AddCard';
import Converter from './js/Converter.js';
import Globals from './js/Globals';

//Navigator for pages
const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Top100: {
      screen: Top100,
    },
    Settings: {
      screen: Settings,
    },
    OneCrpyto: {
      screen: OneCrypto,
    },
    AddCard: {
      screen: AddCard,
    },
    Converter: {
      screen: Converter,
    }
  },
  {
    headerMode: 'none',
    transitionConfig: getSlideFromRightTransition,//Right to left transition
    initialRouteName: 'Home',//Initial page
  }
);

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    this.retrieveSettings();
  }
  async retrieveSettings() {
    try{
      let savedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
      if(savedSettings)
        Globals.UpdateSettings(JSON.parse(savedSettings));
      this.setState({loading: false});
    }
    catch(error){
      console.log(error)
    }
  }
  render() {
    if(this.state.loading){
      return(
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }
    return (
      <RootStack />
    );
  }
}

const styles = StyleSheet.create({
  loadingScreen:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    fontSize: 20,
    color: 'white',
  },
});
