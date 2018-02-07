//Imports
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Platform, 
  Image, 
  Dimensions, 
  Button, 
  TouchableHighlight, 
  ToastAndroid, 
  BackHandler,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { 
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

//Import components
import HomeScreen from './js/Home';
import Settings from './js/Settings';
import OneCrypto from './js/OneCrypto';

const win = Dimensions.get('window');//Viewport

//Navigator for pages
const RootStack = TabNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Settings: {
      screen: Settings,
    },
    OneCrpyto: {
      screen: OneCrypto,
    },
  },
  {
    //Disable visibible tab bar 
    navigationOptions: {
      tabBarVisible: false,
    },
    //Disale swipe to give the appearance of separate pages
    swipeEnabled: false,
    initialRouteName: 'Home',//Initial page
  }
);

export default class App extends React.Component{
  render(){//For navigation
    return(
      <RootStack />
    );
  }
}

